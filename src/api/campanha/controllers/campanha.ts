/**
 * campanha controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::campanha.campanha", {
  async listCampaigns(ctx) {
    const query = ctx.request.query;

    return strapi.service("api::campanha.campanha").listCampaigns(query);
  },
});
