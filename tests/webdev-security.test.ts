import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { auditPwaReadiness, generateServiceWorker } from "../skills/agency-delivery/webdev/scripts/sw-generator";
import {
  releasePort,
  scaffoldPresignedUpload,
  scanSsrBoundaries,
  verifyPackageHealth,
} from "../skills/agency-delivery/webdev/scripts/webdev";

describe("webdev security hardening", () => {
  test("service worker never precaches '/' and guards credentialed responses", () => {
    const sw = generateServiceWorker();
    expect(sw).toContain("isCacheable");
    expect(sw).toContain("response.ok");
    expect(sw).toContain("no-store");
    expect(sw).toContain("LOGOUT");
    expect(sw).not.toContain("  '/',\n");
  });

  test("PWA audit penalizes a caching service worker without a response guard", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pwa-audit-"));
    try {
      fs.writeFileSync(
        path.join(dir, "sw.js"),
        "self.addEventListener('fetch', (event) => { if (event.request.mode === 'navigate') { caches.put('x', x); } });\n",
      );
      fs.writeFileSync(
        path.join(dir, "manifest.webmanifest"),
        JSON.stringify({ name: "x", start_url: "/", display: "standalone", icons: [] }),
      );
      fs.writeFileSync(path.join(dir, "offline.html"), "offline");
      const report = auditPwaReadiness(dir);
      expect(report.hasServiceWorker).toBe(true);
      expect(report.findings.join(" ")).toContain("authenticated HTML");
      expect(report.passed).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("port cleanup refuses to run without explicit confirmation", async () => {
    const result = await releasePort(9, { confirm: false });
    expect(result.released).toBe(false);
    expect(result.message).toContain("explicit confirmation");
  });

  test("presigned upload binds content length and type into the signature", () => {
    const code = scaffoldPresignedUpload("s3");
    expect(code).toContain("ContentLength: sizeBytes");
    expect(code).toContain("signableHeaders");
    expect(code).toContain("content-length");
    expect(code).toContain("attachment");
  });

  test("SSR scan resumes after an idiomatic effect closer", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ssr-boundary-"));
    try {
      fs.writeFileSync(
        path.join(dir, "Component.tsx"),
        [
          "export function C() {",
          "  useEffect(() => {",
          "    window.localStorage.getItem('x');",
          "  }, []);",
          "  const width = window.innerWidth;",
          "  return <div>{width}</div>;",
          "}",
        ].join("\n"),
      );
      const report = scanSsrBoundaries(dir);
      expect(report.violations).toHaveLength(1);
      expect(report.violations[0].line).toBe(5);
      expect(report.violations[0].globalUsed).toBe("window");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test("package check is honest about offline verification", () => {
    const known = verifyPackageHealth("drizzle-orm");
    expect(known.valid).toBe(true);
    expect(known.verified).toBe(false);
    expect(known.reason).toContain("not a registry existence check");
    expect(verifyPackageHealth("lodahs").verified).toBe(true);
  });
});
