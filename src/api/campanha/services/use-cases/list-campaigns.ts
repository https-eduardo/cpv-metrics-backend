import { ListCampaignsQueryParams } from "../../types";

export class ListCampaignsUseCase {
  private params: ListCampaignsQueryParams;

  constructor(params: ListCampaignsQueryParams) {
    this.params = params;
  }

  async execute() {
    const campaignsCountWithFilter = await this.db("campanhas as campanha")
      .countDistinct("campanha.id as total")
      .innerJoin(
        "relatorio_campanhas_campanha_links",
        "campanha.id",
        "relatorio_campanhas_campanha_links.campanha_id"
      )
      .innerJoin(
        "relatorio_campanhas",
        "relatorio_campanhas_campanha_links.relatorio_campanha_id",
        "relatorio_campanhas.id"
      )
      .modify((builder) => {
        if (this.params.filterName)
          builder.whereILike("campanha.nome", `%${this.params.filterName}%`);
        if (this.params.filterActive && this.params.filterActive === "true") {
          builder.where("campanha.status", "=", "ativa");
        }
        if (this.params.start) {
          builder.where(
            "relatorio_campanhas.data_referencia",
            ">=",
            new Date(this.params.start)
          );
          if (this.params.end) {
            builder.where(
              "relatorio_campanhas.data_referencia",
              "<=",
              new Date(this.params.end)
            );
          }
        }
      })
      .first();

    const pageCount = Math.ceil(
      campaignsCountWithFilter.total / this.params.pageSize || 1
    );

    const results = await this.db("campanhas as campanha")
      .select(
        "campanha.nome",
        "campanha.status",
        this.db.raw("SUM(relatorio_campanhas.clicks) + 0 AS total_clicks"),
        this.db.raw("SUM(relatorio_campanhas.conversoes) AS total_conversoes"),
        this.db.raw(
          "SUM(relatorio_campanhas.impressoes) + 0 AS total_impressoes"
        ),
        this.db.raw("SUM(relatorio_campanhas.custo) AS total_custo"),
        this.db.raw(`
  CASE
    WHEN SUM(relatorio_campanhas.impressoes) > 0
    THEN CAST(SUM(relatorio_campanhas.clicks) AS DECIMAL) / CAST(SUM(relatorio_campanhas.impressoes) AS DECIMAL) * 100
    ELSE 0
  END AS total_ctr
`),
        this.db.raw(
          "CASE WHEN SUM(relatorio_campanhas.conversoes) > 0 THEN SUM(relatorio_campanhas.custo) / SUM(relatorio_campanhas.conversoes) ELSE 0 END AS custo_por_conversao"
        )
      )
      .innerJoin(
        "relatorio_campanhas_campanha_links",
        "campanha.id",
        "relatorio_campanhas_campanha_links.campanha_id"
      )
      .innerJoin(
        "relatorio_campanhas",
        "relatorio_campanhas_campanha_links.relatorio_campanha_id",
        "relatorio_campanhas.id"
      )
      .groupBy("campanha.id", "campanha.nome", "campanha.status")
      .limit(this.params.pageSize)
      .offset((this.params.page - 1) * (this.params.pageSize || 1))
      .modify((builder) => {
        if (this.params.filterName)
          builder.whereILike("campanha.nome", `%${this.params.filterName}%`);
        if (this.params.filterActive && this.params.filterActive === "true") {
          builder.where("campanha.status", "=", "ativa");
        }
        if (this.params.sort && this.params.sortOrder)
          builder.orderBy(this.params.sort, this.params.sortOrder);
        if (this.params.start) {
          builder.where(
            "relatorio_campanhas.data_referencia",
            ">=",
            new Date(this.params.start)
          );
          if (this.params.end) {
            builder.where(
              "relatorio_campanhas.data_referencia",
              "<=",
              new Date(this.params.end)
            );
          }
        }
      });

    return {
      data: results,
      pagination: {
        total: campaignsCountWithFilter.total,
        pageSize: this.params.pageSize,
        page: this.params.page,
        pageCount,
      },
    };
  }

  private get db() {
    return strapi.db.connection;
  }
}
