/**
 * campanha service
 */

import { factories } from "@strapi/strapi";
import { ListCampaignsQueryParams } from "../types";
import { ListCampaignsUseCase } from "./use-cases/list-campaigns";

export default factories.createCoreService("api::campanha.campanha", {
  async listCampaigns(params: ListCampaignsQueryParams) {
    const listCampaignsUseCase = new ListCampaignsUseCase(params);

    return await listCampaignsUseCase.execute();
  },
});
