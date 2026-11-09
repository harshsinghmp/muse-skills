import { describe, expect, test } from "bun:test";
import { auditDocCommands } from "../scripts/audit-doc-commands";

describe("documented script paths", () => {
  test("every documented script path resolves", () => {
    const findings = auditDocCommands();
    expect(
      findings.map((finding) => `${finding.file}:${finding.line} ${finding.target}`),
      "Run `bun scripts/audit-doc-commands.ts --fix`, then fix any remaining targets.",
    ).toEqual([]);
  });
});
