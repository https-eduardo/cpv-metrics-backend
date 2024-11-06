/**
 * cliente service
 */

import { factories } from "@strapi/strapi";
import { ImportCustomersFromSheetUseCase } from "./use-cases/import-customers-from-sheet";
import fs from "node:fs/promises";

export default factories.createCoreService("api::cliente.cliente", {
  async importFromSheet(file: { path: string }) {
    const buffer = await fs.readFile(file.path);

    const importCustomersFromSheetUseCase = new ImportCustomersFromSheetUseCase(
      buffer
    );

    importCustomersFromSheetUseCase.setup();
    await importCustomersFromSheetUseCase.execute();
  },
});
