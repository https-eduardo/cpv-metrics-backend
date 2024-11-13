import {
  ApiCampaign,
  CampaignReportSheet,
  CampaignSheetParserResult,
  PropType,
} from "../../types";

export class CampaignSheetParser {
  private sheetCampaign: CampaignReportSheet;
  private customerId: number;

  constructor(sheetCampaign: CampaignReportSheet, customerId: number) {
    this.sheetCampaign = sheetCampaign;
    this.customerId = customerId;
  }

  parse(): CampaignSheetParserResult {
    console.log(this.sheetCampaign.CTR);
    return {
      campaign: {
        nome: this.sheetCampaign.Campaign,
        status: this.getCampaignStatus(),
        cliente: {
          id: this.customerId,
        },
      },
      campaignReport: {
        clicks: this.sheetCampaign.Clicks || 0,
        ctr: this.sheetCampaign.CTR || 0,
        cpc:
          this.sheetCampaign["Avg. CPC"] ||
          this.sheetCampaign.Clicks / this.sheetCampaign.Cost ||
          0,
        impressoes: this.sheetCampaign["Impr."] || 0,
        conversoes: this.sheetCampaign.Conversions || 0,
        custo: this.sheetCampaign.Cost || 0,
        dataReferencia: this.sheetCampaign.Day,
      },
    };
  }

  private getCampaignStatus() {
    const statusMapped: Record<string, PropType<ApiCampaign, "status">> = {
      Enabled: "ativa",
      Paused: "pausada",
      Removed: "deletada",
    };

    return statusMapped[this.sheetCampaign["Campaign state"]];
  }
}
