import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const referenceDirectory = join(root, "exercise-finished");
const reference = JSON.parse(
  readFileSync(join(referenceDirectory, "package.json"), "utf8"),
);
const referenceLockfile = join(referenceDirectory, "pnpm-lock.yaml");
const groups = ["dependencies", "devDependencies"];

const exercises = readdirSync(root)
  .filter(
    (name) =>
      name.startsWith("exercise-") &&
      name !== "exercise-finished" &&
      name !== "exercise-angular-cli" &&
      existsSync(join(root, name, "package.json")),
  )
  .map((name) => ({
    name,
    directory: join(root, name),
    manifest: JSON.parse(
      readFileSync(join(root, name, "package.json"), "utf8"),
    ),
  }));

// Validate every exercise before changing any files.
if (!existsSync(referenceLockfile)) {
  throw new Error(
    "Install exercise-finished with pnpm before synchronizing dependencies.",
  );
}
for (const { name, manifest } of exercises) {
  for (const group of groups) {
    for (const dependency of Object.keys(manifest[group] ?? {})) {
      if (!reference[group]?.[dependency]) {
        throw new Error(
          `${name}: ${dependency} is missing from the reference ${group}.`,
        );
      }
    }
  }
}

for (const { name, directory, manifest } of exercises) {
  for (const group of groups) {
    manifest[group] = Object.fromEntries(
      Object.entries(reference[group] ?? {}).filter(([dependency]) =>
        Object.hasOwn(manifest[group] ?? {}, dependency),
      ),
    );
  }
  writeFileSync(
    join(directory, "package.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  copyFileSync(referenceLockfile, join(directory, "pnpm-lock.yaml"));

  console.log(`\nSynchronizing ${name}`);
  // pnpm prunes unused reference dependencies and reuses their cached versions.
  // Windows' shell resolves both pnpm.cmd and standalone pnpm.exe installations.
  const result = spawnSync(
    "pnpm",
    ["install", "--offline", "--no-frozen-lockfile"],
    {
      cwd: directory,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
