import Hashes from "./hash-list.json";

const force = Bun.argv.includes("--force");

const hashFile = Bun.file("./hash-list.json");

async function checkFile(path: string) {
  const current_hash = fileToHash(await Bun.file(path).arrayBuffer());
  if (current_hash === Hashes.hash && !force) return;
  await hashFile.write(JSON.stringify({ hash: current_hash }, undefined, 2));
  Bun.spawnSync({
    cmd: [
      "go",
      "build",
      "-o",
      "dist/lib/linux/libprompt.so",
      "-buildmode=c-shared",
      "./src/main.go",
    ],
    env: {
      CGO_ENABLED: "1",
      ...process.env,
    },
    stderr: "inherit",
    stdout: "inherit",
  });
}

function fileToHash(buffer: ArrayBuffer) {
  return Bun.hash(buffer).toString();
}

await checkFile("./src/main.go");
