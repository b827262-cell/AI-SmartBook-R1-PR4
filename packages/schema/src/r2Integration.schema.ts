import { z } from "zod";

export const r2ModuleStatusValueSchema = z.enum(["green", "yellow", "red", "gray"]);
export type R2ModuleStatusValue = z.infer<typeof r2ModuleStatusValueSchema>;

export const r2TypecheckStatusSchema = z.enum(["pass", "fail", "pending"]);
export type R2TypecheckStatus = z.infer<typeof r2TypecheckStatusSchema>;

export const r2ModuleStatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  moduleBranch: z.string(),
  status: r2ModuleStatusValueSchema.default("gray"),
  lastCommit: z.string().optional(),
  lastValidatedAt: z.string().optional(),
  typecheckStatus: r2TypecheckStatusSchema.default("pending"),
  buildStatus: r2TypecheckStatusSchema.default("pending"),
  smokeTestStatus: r2TypecheckStatusSchema.default("pending"),
  blockers: z.array(z.string()).default([]),
  ownedAreas: z.array(z.string()).default([]),
  relatedRoutes: z.array(z.string()).default([]),
  relatedFiles: z.array(z.string()).default([])
});
export type R2ModuleStatus = z.infer<typeof r2ModuleStatusSchema>;

export const r2IntegrationStatusSchema = z.object({
  branch: z.string().default("r2/integration"),
  overallStatus: r2ModuleStatusValueSchema.default("gray"),
  modules: z.array(r2ModuleStatusSchema).default([]),
  currentBlockers: z.array(z.string()).default([]),
  lastReportPath: z.string().optional(),
  updatedAt: z.string().optional()
});
export type R2IntegrationStatus = z.infer<typeof r2IntegrationStatusSchema>;
