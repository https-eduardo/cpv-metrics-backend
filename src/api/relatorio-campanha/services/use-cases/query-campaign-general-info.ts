import { GeneralCampaignInfoQueryFilters } from "../../types";

export class QueryCampaignGeneralInfoUseCase {
  private filters: GeneralCampaignInfoQueryFilters;

  constructor(filters: GeneralCampaignInfoQueryFilters) {
    this.filters = filters;
  }

  async execute() {
    return await this.db("relatorio_campanhas as rlcam")
      .sum({
        clicks: "clicks",
        impressions: "impressoes",
        cost: "custo",
        conversions: "conversoes",
      })
      .leftJoin(
        "relatorio_campanhas_campanha_links as camlk",
        "rlcam.id",
        "camlk.relatorio_campanha_id"
      )
      .leftJoin("campanhas as cam", "cam.id", "camlk.campanha_id")
      .modify((builder) => {
        if (this.filters.filterOnlyActive)
          builder.where("cam.status", "=", "ativa");
        if (this.filters.start) {
          builder.where(
            "rlcam.data_referencia",
            ">=",
            new Date(this.filters.start)
          );
          if (this.filters.end) {
            builder.where(
              "rlcam.data_referencia",
              "<=",
              new Date(this.filters.end)
            );
          }
        }
      });
  }

  private get db() {
    return strapi.db.connection;
  }
}
