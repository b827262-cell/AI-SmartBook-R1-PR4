import type { Db } from "../client";
import { appSettings } from "../schema";
import { eq } from "drizzle-orm";
import { nowIso } from "./util";
import {
  r2IntegrationStatusSchema,
  type R2IntegrationStatus,
  type R2ModuleStatus
} from "@ai-smartbook/schema";

const R2_INTEGRATION_KEY = "r2_integration_status";

const DEFAULT_MODULES: R2ModuleStatus[] = [
  {
    id: "pdf-reader-ai-core",
    name: "PDF Reader & AI Core",
    moduleBranch: "module/pdf-reader-ai-core",
    status: "gray",
    typecheckStatus: "pending",
    buildStatus: "pending",
    smokeTestStatus: "pending",
    blockers: [],
    ownedAreas: ["apps/AI-Stu-R1/src/components/Reader"],
    relatedRoutes: ["/pdf-view"],
    relatedFiles: []
  },
  {
    id: "book-content-pipeline",
    name: "Book / Content Pipeline",
    moduleBranch: "module/book-content-pipeline",
    status: "gray",
    typecheckStatus: "pending",
    buildStatus: "pending",
    smokeTestStatus: "pending",
    blockers: [],
    ownedAreas: ["packages/book-core"],
    relatedRoutes: ["/api/admin/books/:bookId/upload"],
    relatedFiles: []
  },
  {
    id: "admin-files-settings",
    name: "Admin / Files / Settings",
    moduleBranch: "module/admin-files-settings",
    status: "gray",
    typecheckStatus: "pending",
    buildStatus: "pending",
    smokeTestStatus: "pending",
    blockers: [],
    ownedAreas: ["apps/AI-adm-D1/src/components/FilesTab"],
    relatedRoutes: ["/api/admin/settings"],
    relatedFiles: []
  },
  {
    id: "smart-ai-backend",
    name: "Smart AI Backend",
    moduleBranch: "module/smart-ai-backend",
    status: "gray",
    typecheckStatus: "pending",
    buildStatus: "pending",
    smokeTestStatus: "pending",
    blockers: [],
    ownedAreas: ["packages/ai"],
    relatedRoutes: [],
    relatedFiles: []
  },
  {
    id: "question-bank-solve",
    name: "Question Bank / Solve",
    moduleBranch: "module/question-bank-solve",
    status: "gray",
    typecheckStatus: "pending",
    buildStatus: "pending",
    smokeTestStatus: "pending",
    blockers: [],
    ownedAreas: ["packages/quiz-core"],
    relatedRoutes: [],
    relatedFiles: []
  }
];

export function makeR2IntegrationRepo(db: Db) {
  return {
    get(): R2IntegrationStatus {
      const row = db.select().from(appSettings).where(eq(appSettings.key, R2_INTEGRATION_KEY)).get();
      if (!row) {
        return {
          branch: "r2/integration",
          overallStatus: "gray",
          modules: DEFAULT_MODULES,
          currentBlockers: [],
          updatedAt: nowIso()
        };
      }
      try {
        const parsed = JSON.parse(row.value);
        return r2IntegrationStatusSchema.parse(parsed);
      } catch {
        return {
          branch: "r2/integration",
          overallStatus: "gray",
          modules: DEFAULT_MODULES,
          currentBlockers: [],
          updatedAt: nowIso()
        };
      }
    },

    save(status: R2IntegrationStatus): void {
      const ts = nowIso();
      const validated = r2IntegrationStatusSchema.parse({ ...status, updatedAt: ts });
      const value = JSON.stringify(validated);

      db.insert(appSettings)
        .values({ key: R2_INTEGRATION_KEY, value, updatedAt: ts })
        .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: ts } })
        .run();
    },

    updateModule(moduleId: string, patch: Partial<R2ModuleStatus>): R2IntegrationStatus {
      const current = this.get();
      const updatedModules = current.modules.map(mod => {
        if (mod.id === moduleId) {
          return { ...mod, ...patch };
        }
        return mod;
      });

      // Recalculate overall status based on module status hierarchy:
      // red > yellow > gray > green
      let overall: R2IntegrationStatus["overallStatus"] = "green";
      const statuses = updatedModules.map(m => m.status);
      if (statuses.includes("red")) {
        overall = "red";
      } else if (statuses.includes("yellow")) {
        overall = "yellow";
      } else if (statuses.includes("gray")) {
        overall = "gray";
      }

      const updatedBlockers = updatedModules.reduce<string[]>((acc, mod) => {
        return acc.concat(mod.blockers || []);
      }, []);

      const nextStatus: R2IntegrationStatus = {
        ...current,
        overallStatus: overall,
        modules: updatedModules,
        currentBlockers: updatedBlockers
      };

      this.save(nextStatus);
      return nextStatus;
    }
  };
}

export type R2IntegrationRepo = ReturnType<typeof makeR2IntegrationRepo>;
