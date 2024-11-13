/**
 * relatorio-campanha service
 */

import { factories } from "@strapi/strapi";
import fs from "node:fs/promises";
import { ImportCampaignFromSheetUseCase } from "./use-cases/import-campaign-from-sheet";

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
  }
);
