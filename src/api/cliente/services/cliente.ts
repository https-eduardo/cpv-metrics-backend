/**
 * cliente service
 */

import { factories } from "@strapi/strapi";
import { ImportCustomersFromSheetUseCase } from "./use-cases/import-customers-from-sheet";
import fs from "node:fs/promises";
import { differenceInMonths } from "date-fns";

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
    const filterStartDate = query.filters?.contratos?.dataInicial?.$lte;
    const filterEndDate = query.filters?.contratos?.dataFinal?.$lte;

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

    const lostCustomers = await strapi.query("api::cliente.cliente").count({
      where: {
        ...query.filters,
        status: {
          $eq: "perdido",
        },
      },
    });

    const churnRate = (lostCustomers / totalCustomers) * 100;

    return {
      customersCount,
      calculatedIncome,
      calculatedLtv,
      churnRate,
    };
  },
});
