/**
 * 🗄️ Database Migration Guard Test Suite
 *
 * Verifies the Zero-Downtime Migration & Locking Guard:
 *   1. Lock level classification and comparison
 *   2. Statement parsing with dollar-quotes and comments
 *   3. Critical DDL hazard detection (non-concurrent index, unvalidated FK, table rewrites)
 *   4. Safe migration pattern recognition (CONCURRENTLY, NOT VALID, lock_timeout)
 *   5. Unindexed foreign key scanner with share-lock hazard warnings
 *   6. CLI execution with human-readable and JSON reporting
 */

import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  analyzeStatement,
  auditMigrationSql,
  compareLockLevels,
  formatAuditReport,
  LOCK_LEVEL_SEVERITY,
  scanUnindexedForeignKeys,
  splitSqlStatements,
} from "../skills/agency-delivery/database/scripts/migration-guard";

const SCRIPT_PATH = path.resolve(__dirname, "../skills/agency-delivery/database/scripts/migration-guard.ts");

describe("🗄️ Database Migration Guard — Core Engine", () => {
  test("Lock levels are ordered correctly and compared accurately", () => {
    expect(LOCK_LEVEL_SEVERITY.ACCESS_EXCLUSIVE).toBeGreaterThan(LOCK_LEVEL_SEVERITY.EXCLUSIVE);
    expect(LOCK_LEVEL_SEVERITY.EXCLUSIVE).toBeGreaterThan(LOCK_LEVEL_SEVERITY.SHARE);
    expect(LOCK_LEVEL_SEVERITY.SHARE).toBeGreaterThan(LOCK_LEVEL_SEVERITY.SHARE_UPDATE_EXCLUSIVE);
    expect(LOCK_LEVEL_SEVERITY.SHARE_UPDATE_EXCLUSIVE).toBeGreaterThan(LOCK_LEVEL_SEVERITY.ROW_EXCLUSIVE);
    expect(LOCK_LEVEL_SEVERITY.ROW_EXCLUSIVE).toBeGreaterThan(LOCK_LEVEL_SEVERITY.ACCESS_SHARE);

    expect(compareLockLevels("ACCESS_SHARE", "ACCESS_EXCLUSIVE")).toBe("ACCESS_EXCLUSIVE");
    expect(compareLockLevels("SHARE_UPDATE_EXCLUSIVE", "SHARE")).toBe("SHARE");
    expect(compareLockLevels("ROW_EXCLUSIVE", "ROW_EXCLUSIVE")).toBe("ROW_EXCLUSIVE");
  });

  test("splitSqlStatements handles comments, quotes, and dollar-quotes properly", () => {
    const sql = `
      -- First statement comment
      SET lock_timeout = '2s';
      /* Multi line comment */
      CREATE TABLE test_users (
        id text PRIMARY KEY,
        metadata text DEFAULT 'val;with;semicolons'
      );
      CREATE OR REPLACE FUNCTION trigger_fn() RETURNS trigger AS $$
      BEGIN
        SELECT 1;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    const statements = splitSqlStatements(sql);
    expect(statements.length).toBe(3);
    expect(statements[0].statement).toContain("SET lock_timeout = '2s'");
    expect(statements[1].statement).toContain("CREATE TABLE test_users");
    expect(statements[2].statement).toContain("CREATE OR REPLACE FUNCTION trigger_fn()");
  });

  describe("DDL Rule Violations & Zero-Downtime Hazards", () => {
    test("flags non-concurrent index creation (DDL-001) as SHARE lock", () => {
      const result = analyzeStatement("CREATE INDEX idx_users_email ON users (email);", 1);
      expect(result.lockLevel).toBe("SHARE");
      expect(result.issues.length).toBe(1);
      expect(result.issues[0].id).toBe("DDL-001");
      expect(result.issues[0].severity).toBe("critical");
      expect(result.issues[0].remediation).toContain("CONCURRENTLY");
    });

    test("approves concurrent index creation as SHARE_UPDATE_EXCLUSIVE without critical issues", () => {
      const result = analyzeStatement("CREATE INDEX CONCURRENTLY idx_users_email ON users (email);", 1);
      expect(result.lockLevel).toBe("SHARE_UPDATE_EXCLUSIVE");
      expect(result.issues.length).toBe(0);
    });

    test("flags non-concurrent index drop (DDL-002) as ACCESS_EXCLUSIVE lock", () => {
      const result = analyzeStatement("DROP INDEX idx_users_email;", 1);
      expect(result.lockLevel).toBe("ACCESS_EXCLUSIVE");
      expect(result.issues.length).toBe(1);
      expect(result.issues[0].id).toBe("DDL-002");
      expect(result.issues[0].severity).toBe("critical");
    });

    test("approves concurrent index drop as SHARE_UPDATE_EXCLUSIVE", () => {
      const result = analyzeStatement("DROP INDEX CONCURRENTLY idx_users_email;", 1);
      expect(result.lockLevel).toBe("SHARE_UPDATE_EXCLUSIVE");
      expect(result.issues.length).toBe(0);
    });

    test("flags foreign key added without NOT VALID (DDL-003)", () => {
      const result = analyzeStatement(
        "ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id);",
        1,
      );
      expect(result.lockLevel).toBe("ACCESS_EXCLUSIVE");
      const fkIssue = result.issues.find((i) => i.id === "DDL-003");
      expect(fkIssue).toBeDefined();
      expect(fkIssue?.severity).toBe("critical");
      expect(fkIssue?.remediation).toContain("NOT VALID");
    });

    test("approves foreign key added with NOT VALID and subsequent VALIDATE CONSTRAINT", () => {
      const addFk = analyzeStatement(
        "ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) NOT VALID;",
        1,
      );
      expect(addFk.issues.some((i) => i.id === "DDL-003")).toBe(false);

      const validate = analyzeStatement("ALTER TABLE orders VALIDATE CONSTRAINT fk_orders_user;", 2);
      expect(validate.lockLevel).toBe("SHARE_UPDATE_EXCLUSIVE");
      expect(validate.issues.length).toBe(0);
    });

    test("flags volatile column defaults as full table rewrite (DDL-004)", () => {
      const result = analyzeStatement("ALTER TABLE accounts ADD COLUMN token uuid DEFAULT gen_random_uuid();", 1);
      const rewriteIssue = result.issues.find((i) => i.id === "DDL-004");
      expect(rewriteIssue).toBeDefined();
      expect(rewriteIssue?.causesTableRewrite).toBe(true);
      expect(rewriteIssue?.severity).toBe("critical");
    });

    test("flags in-place column type alteration as table rewrite (DDL-005)", () => {
      const result = analyzeStatement("ALTER TABLE accounts ALTER COLUMN balance TYPE numeric(12,2);", 1);
      const rewriteIssue = result.issues.find((i) => i.id === "DDL-005");
      expect(rewriteIssue).toBeDefined();
      expect(rewriteIssue?.causesTableRewrite).toBe(true);
      expect(rewriteIssue?.severity).toBe("critical");
    });

    test("flags column and table renames violating expansion/contraction (DDL-006 & DDL-007)", () => {
      const colRename = analyzeStatement("ALTER TABLE users RENAME COLUMN email TO primary_email;", 1);
      expect(colRename.issues.some((i) => i.id === "DDL-006")).toBe(true);

      const tblRename = analyzeStatement("ALTER TABLE users RENAME TO legacy_users;", 2);
      expect(tblRename.issues.some((i) => i.id === "DDL-007")).toBe(true);
    });

    test("flags direct table truncate/drop and VACUUM FULL (DDL-010 & DDL-011)", () => {
      const truncate = analyzeStatement("TRUNCATE TABLE audit_logs;", 1);
      expect(truncate.issues.some((i) => i.id === "DDL-010")).toBe(true);

      const vacuumFull = analyzeStatement("VACUUM FULL orders;", 1);
      expect(vacuumFull.issues.some((i) => i.id === "DDL-011")).toBe(true);
      expect(vacuumFull.issues.find((i) => i.id === "DDL-011")?.causesTableRewrite).toBe(true);
    });
  });

  describe("auditMigrationSql Suite & Lock Timeout Invariant", () => {
    test("flags missing lock_timeout when high-severity DDL locks are used (DDL-000)", () => {
      const unsafeSql = `
        CREATE INDEX idx_users_name ON users (name);
      `;
      const audit = auditMigrationSql(unsafeSql, "unsafe.sql");
      expect(audit.clean).toBe(false);
      expect(audit.hasLockTimeout).toBe(false);
      expect(audit.issues.some((i) => i.id === "DDL-000")).toBe(true);
    });

    test("passes clean when safe patterns and lock_timeout are provided", () => {
      const safeSql = `
        SET lock_timeout = '2s';
        CREATE INDEX CONCURRENTLY idx_users_active ON users (id) WHERE active = true;
        ALTER TABLE orders ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) NOT VALID;
      `;
      const audit = auditMigrationSql(safeSql, "safe.sql");
      expect(audit.hasLockTimeout).toBe(true);
      expect(audit.summary.criticalCount).toBe(0);
      expect(audit.clean).toBe(true);
    });
  });

  describe("Unindexed Foreign Key Scanner (scanUnindexedForeignKeys)", () => {
    test("flags foreign key lacking supporting index on child table", () => {
      const schemaSql = `
        CREATE TABLE users (
          id uuid PRIMARY KEY,
          email text
        );

        CREATE TABLE orders (
          id uuid PRIMARY KEY,
          user_id uuid REFERENCES users (id),
          total numeric
        );
      `;

      const unindexed = scanUnindexedForeignKeys(schemaSql);
      expect(unindexed.length).toBe(1);
      expect(unindexed[0].table).toBe("orders");
      expect(unindexed[0].columns).toContain("user_id");
      expect(unindexed[0].hasIndex).toBe(false);
      expect(unindexed[0].suggestedIndexSql).toContain("CREATE INDEX CONCURRENTLY");
    });

    test("skips foreign key when supporting index is defined", () => {
      const schemaSql = `
        CREATE TABLE users (
          id uuid PRIMARY KEY,
          email text
        );

        CREATE TABLE orders (
          id uuid PRIMARY KEY,
          user_id uuid REFERENCES users (id),
          total numeric
        );

        CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders (user_id);
      `;

      const unindexed = scanUnindexedForeignKeys(schemaSql);
      expect(unindexed.length).toBe(0);
    });
  });

  describe("CLI & Terminal Reporting Execution", () => {
    test("formatAuditReport produces formatted diagnostic table", () => {
      const audit = auditMigrationSql("CREATE INDEX idx_a ON t (col);", "demo.sql");
      const report = formatAuditReport([audit], []);
      expect(report).toContain("MUSE DATABASE ZERO-DOWNTIME MIGRATION GUARD");
      expect(report).toContain("DDL-001");
      expect(report).toContain("CREATE INDEX CONCURRENTLY");
    });

    test("CLI runs on SQL file and exits 0 for safe migration, 1 for unsafe", () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "migration-guard-test-"));
      try {
        const safeFile = path.join(tempDir, "safe.sql");
        fs.writeFileSync(
          safeFile,
          "SET lock_timeout = '2s';\nCREATE INDEX CONCURRENTLY idx_safe ON users (email);\n",
          "utf8",
        );

        const safeRun = spawnSync("bun", [SCRIPT_PATH, safeFile], { encoding: "utf8" });
        expect(safeRun.status).toBe(0);
        expect(safeRun.stdout).toContain("All migrations verified zero-downtime compliant");

        const unsafeFile = path.join(tempDir, "unsafe.sql");
        fs.writeFileSync(
          unsafeFile,
          "CREATE INDEX idx_unsafe ON users (email);\nALTER TABLE users DROP COLUMN phone;\n",
          "utf8",
        );

        const unsafeRun = spawnSync("bun", [SCRIPT_PATH, unsafeFile], { encoding: "utf8" });
        expect(unsafeRun.status).toBe(1);
        expect(unsafeRun.stdout).toContain("Migration Guard Failed");

        const jsonRun = spawnSync("bun", [SCRIPT_PATH, safeFile, "--json"], { encoding: "utf8" });
        expect(jsonRun.status).toBe(0);
        const parsed = JSON.parse(jsonRun.stdout);
        expect(parsed.clean).toBe(true);
        expect(Array.isArray(parsed.auditResults)).toBe(true);
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });
});
