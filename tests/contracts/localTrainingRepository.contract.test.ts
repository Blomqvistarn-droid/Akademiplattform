import { createLocalTrainingRepository } from "../../src/infrastructure/repositories/local/localTrainingRepository";
import { createOrganizationContext } from "../../src/application/context/OrganizationContext";
import { runTrainingRepositoryContractTests } from "./runTrainingRepositoryContractTests";

runTrainingRepositoryContractTests("local training repository", {
  createForOrganization: async (organizationId) =>
    createLocalTrainingRepository(createOrganizationContext(organizationId)),
});
