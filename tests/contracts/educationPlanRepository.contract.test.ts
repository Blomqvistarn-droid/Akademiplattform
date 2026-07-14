import { createLocalEducationPlanRepository } from "../../src/infrastructure/repositories/local/localEducationPlanRepository";
import { runEducationPlanRepositoryContractTests } from "./runEducationPlanRepositoryContractTests";

runEducationPlanRepositoryContractTests("local education plan repository contract", {
  createForOrganization: async (organizationId) =>
    createLocalEducationPlanRepository({ organizationId }),
});