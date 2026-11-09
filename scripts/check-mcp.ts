#!/usr/bin/env bun
/**
 * Validate .mcp.json before it reaches a workflow.
 *
 * Scope: shape, server names, transport, command allowlist, and literal-secret
 * detection. MCP servers execute local processes, so an unknown command or a
 * shell wrapper is rejected rather than trusted.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MCP_PATH = join(process.cwd(), ".mcp.json");
const ALLOWED_COMMANDS = new Set(["npx", "bunx", "uvx", "node", "python3", "docker"]);
const FORBIDDEN_SHELLS = new Set(["sh", "bash", "zsh", "dash", "cmd", "powershell", "pwsh"]);
const SECRET_SHAPE =
  /sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|glpat-[A-Za-z0-9-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----/;

const failures: string[] = [];
const fail = (message: string) => failures.push(message);

if (!existsSync(MCP_PATH)) {
  console.log("✅ .mcp.json not present; nothing to validate.");
  process.exit(0);
}

let config: unknown;
try {
  config = JSON.parse(readFileSync(MCP_PATH, "utf8"));
} catch (error) {
  console.error(`❌ .mcp.json is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

if (!config || typeof config !== "object" || Array.isArray(config)) {
  console.error("❌ .mcp.json must be a JSON object.");
  process.exit(1);
}

const record = config as Record<string, unknown>;
const allowedTopLevel = new Set(["mcpServers", "_notes"]);
for (const key of Object.keys(record)) {
  if (!allowedTopLevel.has(key)) fail(`unknown top-level key '${key}'`);
}

const servers = record.mcpServers;
if (servers === undefined) {
  console.log("✅ .mcp.json has no mcpServers block; nothing to validate.");
  process.exit(failures.length > 0 ? 1 : 0);
}
if (!servers || typeof servers !== "object" || Array.isArray(servers)) {
  console.error("❌ mcpServers must be an object keyed by server name.");
  process.exit(1);
}

for (const [name, raw] of Object.entries(servers as Record<string, unknown>)) {
  if (!/^[A-Za-z0-9._-]+$/.test(name))
    fail(`server name '${name}' may only use letters, digits, dot, dash, underscore`);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    fail(`server '${name}' must be an object`);
    continue;
  }
  const server = raw as Record<string, unknown>;
  const hasCommand = typeof server.command === "string";
  const hasUrl = typeof server.url === "string";
  if (hasCommand === hasUrl) fail(`server '${name}' must define exactly one of command or url`);

  if (hasUrl) {
    const url = server.url as string;
    const parsed = (() => {
      try {
        return new URL(url);
      } catch {
        return undefined;
      }
    })();
    if (!parsed) {
      fail(`server '${name}' has an invalid url`);
    } else if (parsed.protocol !== "https:" && !["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
      fail(`server '${name}' url must be https (or loopback for local development)`);
    }
  }

  if (hasCommand) {
    const command = server.command as string;
    const basename = command.split(/[\\/]/).pop() ?? command;
    if (FORBIDDEN_SHELLS.has(basename)) {
      fail(`server '${name}' uses forbidden shell wrapper '${basename}'`);
    } else if (!ALLOWED_COMMANDS.has(basename)) {
      fail(`server '${name}' command '${basename}' is not in the allowlist (${[...ALLOWED_COMMANDS].join(", ")})`);
    }
  }

  if (server.env !== undefined) {
    if (!server.env || typeof server.env !== "object" || Array.isArray(server.env)) {
      fail(`server '${name}' env must be an object`);
    } else {
      for (const [key, value] of Object.entries(server.env as Record<string, unknown>)) {
        if (typeof value === "string" && SECRET_SHAPE.test(value)) {
          fail(`server '${name}' env '${key}' contains a literal secret; reference it from the environment instead`);
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error("❌ .mcp.json validation failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`✅ .mcp.json valid (${Object.keys(servers as Record<string, unknown>).length} server(s)).`);
