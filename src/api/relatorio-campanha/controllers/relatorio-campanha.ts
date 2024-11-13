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
  }
);
