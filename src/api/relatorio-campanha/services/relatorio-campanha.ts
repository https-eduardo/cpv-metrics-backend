/**
 * relatorio-campanha service
 */

import { factories } from "@strapi/strapi";
import fs from "node:fs/promises";
import { ImportCampaignFromSheetUseCase } from "./use-cases/import-campaign-from-sheet";
import { QueryCampaignGeneralInfoUseCase } from "./use-cases/query-campaign-general-info";
import { GeneralCampaignInfoQueryFilters } from "../types";

export default factories.createCoreService(
  "api::relatorio-campanha.relatorio-campanha",
  {
    async importFromSheet(file: { path: string }) {
      const buffer = await fs.readFile(file.path);

      const importCampaignsFromSheetUseCase =
        new ImportCampaignFromSheetUseCase(buffer);

      importCampaignsFromSheetUseCase.setup();
      importCampaignsFromSheetUseCase.execute();
      return {
        message: "Campaign reports import started.",
      };
    },
    async getCampaignGeneralInfo(filters: GeneralCampaignInfoQueryFilters) {
      const queryCampaignGeneralInfoUseCase =
        new QueryCampaignGeneralInfoUseCase(filters);

      const sum = await queryCampaignGeneralInfoUseCase.execute();

      return {
        clicks: Number(sum[0].clicks),
        impressions: Number(sum[0].impressions),
        cost: Number(sum[0].cost),
        conversions: Number(sum[0].conversions),
      };
    },
  }
);
