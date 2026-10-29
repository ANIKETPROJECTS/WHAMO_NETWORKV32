const fs = require("node:fs");
const path = require("node:path");

const localExeDirectory = path.resolve(__dirname, "..");
const projectRoot = path.resolve(localExeDirectory, "..");
const builtClientDirectory = path.join(projectRoot, "dist", "public");
const sourceEngine = path.join(projectRoot, "server", "engines", "WHAMO.EXE");
const packagedClientDirectory = path.join(localExeDirectory, "app-assets");
const packagedEngineDirectory = path.join(localExeDirectory, "engine");
const packagedEngine = path.join(packagedEngineDirectory, "WHAMO.EXE");

const localDesktopText = [
  ["saved to your account.", "saved on this computer."],
  ["opened from your account.", "opened from this computer."],
  ["save your current network to your account.", "save your current network on this computer."],
  ["Change your account password", "Password changes are unavailable in local mode"],
];

function adaptBuiltAssets(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      adaptBuiltAssets(entryPath);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

    let content = fs.readFileSync(entryPath, "utf8");
    for (const [from, to] of localDesktopText) {
      content = content.replaceAll(from, to);
    }
    fs.writeFileSync(entryPath, content, "utf8");
  }
}

if (!fs.existsSync(path.join(builtClientDirectory, "index.html"))) {
  throw new Error(
    `Built Designer files were not found at ${builtClientDirectory}. Run the root project's build first.`
  );
}

if (!fs.existsSync(sourceEngine)) {
  throw new Error(`The WHAMO executable was not found at ${sourceEngine}.`);
}

fs.rmSync(packagedClientDirectory, { recursive: true, force: true });
fs.cpSync(builtClientDirectory, packagedClientDirectory, { recursive: true });
adaptBuiltAssets(packagedClientDirectory);

fs.mkdirSync(packagedEngineDirectory, { recursive: true });
fs.copyFileSync(sourceEngine, packagedEngine);

console.log("Prepared local desktop assets:");
console.log(`  Designer files: ${packagedClientDirectory}`);
console.log(`  WHAMO engine:   ${packagedEngine}`);
