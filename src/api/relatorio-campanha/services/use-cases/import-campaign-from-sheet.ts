import XLSX from "xlsx";
import {
  CampaignReportSheet,
  ApiCampaign,
  ApiCampaignReport,
} from "../../types";
import { CampaignSheetParser } from "./campaign-sheet-parser";

export class ImportCampaignFromSheetUseCase {
  private DEFAULT_IMPORT_SHEET = "Untitled";
  private parsedSheet: CampaignReportSheet[];
  private spreadsheet: Buffer;

  constructor(spreadsheet: Buffer) {
    this.spreadsheet = spreadsheet;
  }

  setup() {
    const workbook = XLSX.read(this.spreadsheet, {
      type: "buffer",
      cellDates: true,
    });

    const worksheet = workbook.Sheets[this.DEFAULT_IMPORT_SHEET];
    // Skip first row (sync row)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    range.s.r = 1;

    const json = XLSX.utils.sheet_to_json<CampaignReportSheet>(worksheet, {
      range,
    });

    this.parsedSheet = json;
  }

  async execute() {
    if (!this.parsedSheet) throw new Error("Spreadsheet data not parsed.");

    // For now, only homeney will have campaign
    const homeneyCustomer = await strapi.query("api::cliente.cliente").findOne({
      where: { nome: { $containsi: "homeney" } },
    });

    if (!homeneyCustomer) throw new Error("Homeney customer not found");

    for (const campaignFromSheet of this.parsedSheet) {
      const campaignSheetParser = new CampaignSheetParser(
        campaignFromSheet,
        homeneyCustomer.id
      );

      const { campaign, campaignReport } = campaignSheetParser.parse();

      // Skip invalid reports, just upsert the campaign
      if (!campaignFromSheet.Cost || !campaignFromSheet.Clicks) {
        await this.upsertCampaign(campaign);
        continue;
      }
      console.log(campaign.nome, campaignReport.dataReferencia);

      const upsertedCustomer = await this.upsertCampaign(campaign);
      await this.upsertCampaignReport(
        Number(upsertedCustomer.id),
        campaignReport
      );
    }
  }

  async upsertCampaign(campaign: ApiCampaign) {
    const existentCampaign = await strapi
      .query("api::campanha.campanha")
      .findOne({
        where: {
          nome: campaign.nome,
        },
      });

    if (!existentCampaign)
      return await strapi.entityService.create("api::campanha.campanha", {
        data: campaign,
      });

    return await strapi.entityService.update(
      "api::campanha.campanha",
      existentCampaign.id,
      {
        data: campaign,
      }
    );
  }
  async upsertCampaignReport(
    campaignId: number,
    campaignReport: ApiCampaignReport
  ) {
    const registeredCampaignReport = await strapi
      .query("api::relatorio-campanha.relatorio-campanha")
      .findOne({
        where: {
          dataReferencia: campaignReport.dataReferencia,
          campanha: {
            id: campaignId,
          },
        },
      });

    if (!registeredCampaignReport)
      return await strapi.entityService.create(
        "api::relatorio-campanha.relatorio-campanha",
        {
          data: {
            ...campaignReport,
            campanha: {
              id: campaignId,
            },
          },
        }
      );

    return await strapi.entityService.update(
      "api::relatorio-campanha.relatorio-campanha",
      registeredCampaignReport.id,
      {
        data: campaignReport,
      }
    );
  }
}
