import { Attribute } from "@strapi/strapi";

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export interface CampaignReportSheet {
  Campaign: string;
  Day: Date;
  "Campaign state": string;
  Cost: number;
  Clicks: number;
  "Avg. CPC": number;
  "Cost / conv.": number;
  CTR: number;
  Conversions: number;
  "Impr.": number;
}

export interface CampaignSheetParserResult {
  campaign: ApiCampaign;
  campaignReport: ApiCampaignReport;
}

export type ApiCampaign = Omit<
  Attribute.GetValues<"api::campanha.campanha">,
  "id" | "cliente"
> & {
  cliente: {
    id: number;
  };
};

export type ApiCampaignReport = Omit<
  Attribute.GetValues<"api::relatorio-campanha.relatorio-campanha">,
  "id"
>;

export interface GeneralCampaignInfoQueryFilters {
  filterOnlyActive: string;
  start?: Date;
  end?: Date;
}
