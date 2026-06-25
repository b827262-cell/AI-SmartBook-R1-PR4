import { createDbHandle } from "../client";
import { createRepositories } from "./index";
import { runMigrations } from "../migrate";
import { r2IntegrationStatusSchema } from "@ai-smartbook/schema";

function testR2Integration() {
  console.log("Starting R2 integration repository tests...");

  // 1. Initialize DB in-memory so we don't mutate disk database
  const { db, sqlite } = createDbHandle(":memory:");
  runMigrations(sqlite);
  const repos = createRepositories(db);

  // 2. Test Get Default Integration Status
  const status = repos.r2Integration.get();
  console.log("Default status branch:", status.branch);
  console.log("Default overallStatus:", status.overallStatus);
  console.log("Default modules count:", status.modules.length);

  if (status.branch !== "r2/integration") {
    throw new Error("Expected default branch to be 'r2/integration'");
  }
  if (status.overallStatus !== "gray") {
    throw new Error("Expected default overallStatus to be 'gray'");
  }
  if (status.modules.length !== 5) {
    throw new Error("Expected 5 modules");
  }

  // 3. Test Save & Update
  console.log("Testing updateModule...");
  const updated = repos.r2Integration.updateModule("pdf-reader-ai-core", {
    status: "yellow",
    blockers: ["PDF viewer is broken"]
  });

  console.log("Updated overallStatus:", updated.overallStatus);
  console.log("Updated blockers:", updated.currentBlockers);

  if (updated.overallStatus !== "yellow") {
    throw new Error("Expected overallStatus to become 'yellow' when one module is yellow");
  }
  if (updated.currentBlockers.length !== 1 || updated.currentBlockers[0] !== "PDF viewer is broken") {
    throw new Error("Expected blockers list to contain 'PDF viewer is broken'");
  }

  // 4. Test Red Status Priority
  console.log("Testing red status priority...");
  const updatedRed = repos.r2Integration.updateModule("book-content-pipeline", {
    status: "red",
    blockers: ["PDF parser fails with 404"]
  });

  console.log("Updated overallStatus (with red):", updatedRed.overallStatus);
  if (updatedRed.overallStatus !== "red") {
    throw new Error("Expected overallStatus to become 'red' when a module is red");
  }
  if (updatedRed.currentBlockers.length !== 2) {
    throw new Error("Expected overall blockers to accumulate");
  }

  // 5. Test Green Overall Status
  console.log("Testing green overall status...");
  // Clear blockers and set all to green
  const ids = ["pdf-reader-ai-core", "book-content-pipeline", "admin-files-settings", "smart-ai-backend", "question-bank-solve"];
  let finalStatus;
  for (const id of ids) {
    finalStatus = repos.r2Integration.updateModule(id, {
      status: "green",
      blockers: []
    });
  }

  console.log("Final overallStatus (all green):", finalStatus?.overallStatus);
  if (finalStatus?.overallStatus !== "green") {
    throw new Error("Expected overallStatus to become 'green' when all modules are green");
  }
  if (finalStatus?.currentBlockers.length !== 0) {
    throw new Error("Expected currentBlockers to be empty when no module has blockers");
  }

  console.log("All R2 integration repository tests passed successfully!");
}

testR2Integration();
