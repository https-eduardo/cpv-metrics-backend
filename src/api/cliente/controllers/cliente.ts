/**
 * cliente controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::cliente.cliente", {
  async importFromSheet(ctx) {
    const { file } = ctx.request.files;

    return await strapi.service("api::cliente.cliente").importFromSheet(file);
  },
  async getGeneralInfo(ctx) {
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    return await strapi
      .service("api::cliente.cliente")
      .getGeneralInfo(sanitizedQueryParams);
  },
});
