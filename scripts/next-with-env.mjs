import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Loads .env.<profile> (localhost | stage | prod) and runs the matching Next command.
const [, , profile = "localhost", command = "dev", ...extraArgs] = process.argv;
const rootDir = process.cwd();
const envPath = path.join(rootDir, `.env.${profile}`);

const parseEnvFile = (filePath) => {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separator = trimmed.indexOf("=");
    if (separator === -1) return;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

parseEnvFile(envPath);

process.env.NEXT_PUBLIC_APP_ENV ||= profile;

// Pin NODE_ENV per command. Without an explicit "production", a clean `next build`
// emits the dev JSX runtime (jsxDEV) and crashes at runtime in production.
process.env.NODE_ENV = command === "dev" ? "development" : "production";

const argsByCommand = {
  build: ["build"],
  dev: ["dev", "--hostname", "0.0.0.0"],
  start: ["start", "--hostname", "0.0.0.0"],
};

const nextArgs = argsByCommand[command];
if (!nextArgs) {
  console.error(`Unknown Next command "${command}". Use build, dev, or start.`);
  process.exit(1);
}

console.log(`Using ${envPath} for ${command} (${profile})`);

const executable = process.platform === "win32" ? "next.cmd" : "next";
const result = spawnSync(executable, [...nextArgs, ...extraArgs], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
