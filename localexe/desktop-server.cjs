const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const express = require("express");

const LOCAL_TOKEN = "whamo-desktop-local-session";
const TOKEN_KEY = "whamo_auth_token";
const LOCAL_USER = {
  id: "local-desktop-user",
  email: "local@whamo.invalid",
  fullName: "Local User",
  role: "normalUser",
  sectionAccess: [
    "designer",
    "projects",
    "simulation",
    "visualization",
    "outputRequests",
    "flexTable",
    "excelIO",
    "networkSettings",
  ],
};

function ensureDataDirectory(dataDirectory) {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const projectsFile = path.join(dataDirectory, "projects.json");
  if (!fs.existsSync(projectsFile)) {
    fs.writeFileSync(projectsFile, "[]\n", "utf8");
  }
  return projectsFile;
}

function readProjects(projectsFile) {
  const value = JSON.parse(fs.readFileSync(projectsFile, "utf8"));
  if (!Array.isArray(value)) {
    throw new Error("The local projects file does not contain a project list.");
  }
  return value;
}

function writeProjects(projectsFile, projects) {
  const tempFile = `${projectsFile}.${process.pid}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(tempFile, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
  fs.renameSync(tempFile, projectsFile);
}

function sendLocalError(res, message, error) {
  console.error(message, error);
  res.status(500).json({ message });
}

function runWhamo({ inpContent, enginePath, dataDirectory }) {
  return new Promise((resolve, reject) => {
    if (typeof inpContent !== "string" || inpContent.trim() === "") {
      reject(new Error("No INP content was provided."));
      return;
    }
    if (!fs.existsSync(enginePath)) {
      reject(new Error(`The local WHAMO executable is missing: ${enginePath}`));
      return;
    }

    const runRoot = path.join(dataDirectory, "runs");
    fs.mkdirSync(runRoot, { recursive: true });
    const runDirectory = fs.mkdtempSync(path.join(runRoot, "whamo-"));
    const localEnginePath = path.join(runDirectory, "whamo.exe");

    try {
      fs.copyFileSync(enginePath, localEnginePath);
      fs.writeFileSync(path.join(runDirectory, "input.inp"), inpContent, "utf8");
    } catch (error) {
      fs.rmSync(runDirectory, { recursive: true, force: true });
      reject(error);
      return;
    }

    let child;
    let stderr = "";
    let timedOut = false;
    let finished = false;
    let timeout;

    const cleanup = () => {
      if (timeout) clearTimeout(timeout);
      fs.rmSync(runDirectory, { recursive: true, force: true });
    };
    const fail = (error) => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(error);
    };

    try {
      child = spawn(localEnginePath, [], {
        cwd: runDirectory,
        windowsHide: true,
        stdio: ["pipe", "ignore", "pipe"],
      });
    } catch (error) {
      fail(error);
      return;
    }

    timeout = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, 120_000);

    child.stderr.on("data", (chunk) => {
      stderr = `${stderr}${chunk.toString()}`.slice(-8000);
    });

    child.once("error", (error) => {
      fail(new Error(`Could not start the local WHAMO executable: ${error.message}`));
    });

    child.once("close", (code) => {
      if (finished) return;
      if (timedOut) {
        fail(new Error("The local WHAMO simulation exceeded the two-minute limit."));
        return;
      }
      if (code !== 0) {
        fail(new Error(`WHAMO exited with code ${code}.${stderr ? ` ${stderr}` : ""}`));
        return;
      }

      try {
        const files = {};
        const outputNames = {
          out: "input_OUT.OUT",
          plt: "input_PLT.PLT",
          tab: "input_SHEET.TAB",
        };
        for (const [key, fileName] of Object.entries(outputNames)) {
          const outputPath = path.join(runDirectory, fileName);
          if (fs.existsSync(outputPath)) {
            files[key] = fs.readFileSync(outputPath).toString("base64");
          }
        }

        if (Object.keys(files).length === 0) {
          fail(new Error("WHAMO finished but did not create an OUT, PLT, or TAB file."));
          return;
        }

        finished = true;
        cleanup();
        resolve({ success: true, files });
      } catch (error) {
        fail(error);
      }
    });

    child.stdin.end("input.inp\r\ninput_OUT.OUT\r\ninput_PLT.PLT\r\ninput_SHEET.TAB\r\n");
  });
}

async function startDesktopServer({ assetDirectory, enginePath, dataDirectory }) {
  const indexPath = path.join(assetDirectory, "index.html");
  if (!fs.existsSync(indexPath)) {
    throw new Error(`The built Designer page is missing: ${indexPath}`);
  }

  const projectsFile = ensureDataDirectory(dataDirectory);
  const profileFile = path.join(dataDirectory, "profile.json");
  let currentUser = { ...LOCAL_USER };
  if (fs.existsSync(profileFile)) {
    currentUser = { ...currentUser, ...JSON.parse(fs.readFileSync(profileFile, "utf8")) };
  }

  const bootstrapScript =
    `<style>button[title="Share project"]{display:none!important}</style>` +
    `<script>localStorage.setItem(${JSON.stringify(TOKEN_KEY)},${JSON.stringify(LOCAL_TOKEN)});</script>`;
  const originalHtml = fs.readFileSync(indexPath, "utf8");
  const desktopHtml = originalHtml.replace(/<head[^>]*>/i, (head) => `${head}${bootstrapScript}`);

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "50mb" }));

  const requireLocalSession = (req, res, next) => {
    if (req.get("authorization") !== `Bearer ${LOCAL_TOKEN}`) {
      return res.status(401).json({ message: "The local desktop session is missing. Restart the app." });
    }
    next();
  };

  app.get("/api/auth/me", requireLocalSession, (_req, res) => {
    res.json({ user: currentUser });
  });

  app.put("/api/auth/profile", requireLocalSession, (req, res) => {
    const fullName = typeof req.body?.fullName === "string" ? req.body.fullName.trim() : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    if (!fullName || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    currentUser = { ...currentUser, fullName, email };
    try {
      fs.writeFileSync(profileFile, `${JSON.stringify(currentUser, null, 2)}\n`, "utf8");
      res.json({ user: currentUser, token: LOCAL_TOKEN });
    } catch (error) {
      sendLocalError(res, "Could not save the local profile.", error);
    }
  });

  app.put("/api/auth/password", requireLocalSession, (_req, res) => {
    res.status(400).json({ message: "Password changes are not used in local desktop mode." });
  });

  app.get("/api/projects", requireLocalSession, (_req, res) => {
    try {
      const projects = readProjects(projectsFile)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      res.json(projects);
    } catch (error) {
      sendLocalError(res, "Could not read the local projects file.", error);
    }
  });

  app.get("/api/projects/:id", requireLocalSession, (req, res) => {
    try {
      const project = readProjects(projectsFile).find((item) => item.id === req.params.id);
      if (!project) return res.status(404).json({ message: "Local project not found." });
      res.json(project);
    } catch (error) {
      sendLocalError(res, "Could not read the local project.", error);
    }
  });

  app.post("/api/projects", requireLocalSession, (req, res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    if (!name || req.body?.content === undefined) {
      return res.status(400).json({ message: "A project name and project content are required." });
    }

    try {
      const now = new Date().toISOString();
      const project = {
        id: crypto.randomUUID(),
        name,
        content: req.body.content,
        userId: LOCAL_USER.id,
        sharedWith: [],
        createdAt: now,
        updatedAt: now,
      };
      const projects = readProjects(projectsFile);
      projects.push(project);
      writeProjects(projectsFile, projects);
      res.status(201).json(project);
    } catch (error) {
      sendLocalError(res, "Could not save the local project.", error);
    }
  });

  app.put("/api/projects/:id", requireLocalSession, (req, res) => {
    try {
      const projects = readProjects(projectsFile);
      const index = projects.findIndex((item) => item.id === req.params.id);
      if (index < 0) return res.status(404).json({ message: "Local project not found." });

      const updates = {};
      if (typeof req.body?.name === "string" && req.body.name.trim()) {
        updates.name = req.body.name.trim();
      }
      if (req.body?.content !== undefined) updates.content = req.body.content;

      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      writeProjects(projectsFile, projects);
      res.json(projects[index]);
    } catch (error) {
      sendLocalError(res, "Could not update the local project.", error);
    }
  });

  app.delete("/api/projects/:id", requireLocalSession, (req, res) => {
    try {
      const projects = readProjects(projectsFile);
      const remaining = projects.filter((item) => item.id !== req.params.id);
      if (remaining.length === projects.length) {
        return res.status(404).json({ message: "Local project not found." });
      }
      writeProjects(projectsFile, remaining);
      res.status(204).end();
    } catch (error) {
      sendLocalError(res, "Could not delete the local project.", error);
    }
  });

  app.post("/api/projects/:id/share", requireLocalSession, (_req, res) => {
    res.status(501).json({ message: "Project sharing is not available in local desktop mode." });
  });

  app.delete("/api/projects/:id/share", requireLocalSession, (_req, res) => {
    res.status(501).json({ message: "Project sharing is not available in local desktop mode." });
  });

  const simulationHandler = async (req, res) => {
    try {
      const result = await runWhamo({
        inpContent: req.body?.inpContent,
        enginePath,
        dataDirectory,
      });
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Local WHAMO run failed:", error);
      res.status(500).json({ success: false, error: message });
    }
  };

  app.post("/api/generate-out", requireLocalSession, simulationHandler);
  app.post("/api/run-whamo", requireLocalSession, simulationHandler);

  app.use(express.static(assetDirectory, { index: false }));

  app.get(["/login", "/register", "/admin"], (_req, res) => {
    res.redirect(302, "/designer");
  });

  app.get(/.*/, (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ message: "Local API route not found." });
    }
    res.type("html").send(desktopHtml);
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1");
    server.once("error", reject);
    server.once("listening", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not determine the local server address."));
        return;
      }
      resolve({
        server,
        url: `http://127.0.0.1:${address.port}`,
        close: () => server.close(),
      });
    });
  });
}

module.exports = { startDesktopServer };
