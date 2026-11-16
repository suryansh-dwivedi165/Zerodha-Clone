const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "vercel-dist");
const frontendBuild = path.join(projectRoot, "frontend", "build");
const dashboardBuild = path.join(projectRoot, "dashboard", "build");

for (const buildDirectory of [frontendBuild, dashboardBuild]) {
  if (!fs.existsSync(path.join(buildDirectory, "index.html"))) {
    throw new Error(`Build output is missing: ${buildDirectory}`);
  }
}

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.cpSync(frontendBuild, outputDirectory, { recursive: true });
fs.cpSync(dashboardBuild, path.join(outputDirectory, "dashboard"), {
  recursive: true,
});
