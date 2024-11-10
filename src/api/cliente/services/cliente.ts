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
    return await importCustomersFromSheetUseCase.execute();
  },
  async getGeneralInfo(query: Record<string, any>) {
    const totalCustomers = await strapi.db
      .query("api::cliente.cliente")
      .count();

    const [customers, customersCount] = await strapi.db
      .query("api::cliente.cliente")
      .findWithCount({
        where: query.filters,
        populate: query.populate,
      });

    const calculatedIncome = customers.reduce(
      (acc, customer) =>
        acc +
        customer.contratos?.reduce(
          (acc, contract) => acc + contract.mensalidade,
          0
        ),
      0
    );

    const calculatedLtv = customers.reduce(
      (acc, customer) =>
        acc +
        customer.contratos?.reduce((acc, contract) => acc + contract.ltv, 0),
      0
    );

    const lostCustomers = customers.filter(
      (customer) => customer.status === "perdido"
    ).length;

    const churnRate = (lostCustomers / totalCustomers) * 100;

    return {
      customersCount,
      calculatedIncome,
      calculatedLtv,
      churnRate,
    };
  },
});
