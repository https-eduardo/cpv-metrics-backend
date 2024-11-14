/**
 * relatorio-campanha controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::relatorio-campanha.relatorio-campanha",
  {
    async importFromSheet(ctx) {
      const { file } = ctx.request.files;

      return strapi
        .service("api::relatorio-campanha.relatorio-campanha")
        .importFromSheet(file);
    },

    async getGeneralInfo(ctx) {
      const { filterOnlyActive, start, end } = ctx.request.query;

      return await strapi
        .service("api::relatorio-campanha.relatorio-campanha")
        .getCampaignGeneralInfo({
          filterOnlyActive,
          start,
          end,
        });
    },
  }
);
