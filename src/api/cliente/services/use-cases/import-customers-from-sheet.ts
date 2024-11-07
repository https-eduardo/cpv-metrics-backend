import XLSX from "xlsx";
import { CustomerSheetParser } from "./customer-sheet-parser";
import { ApiContract, ApiCustomer, CustomerFromSheet } from "../../types";

export class ImportCustomersFromSheetUseCase {
  private DEFAULT_IMPORT_SHEET = "Empresa";
  private parsedSheet: CustomerFromSheet[];
  private spreadsheet: Buffer;

  constructor(spreadsheet: Buffer) {
    this.spreadsheet = spreadsheet;
  }

  setup() {
    const workbook = XLSX.read(this.spreadsheet, {
      type: "buffer",
      cellDates: true,
    });

    const json = XLSX.utils.sheet_to_json<CustomerFromSheet>(
      workbook.Sheets[this.DEFAULT_IMPORT_SHEET]
    );

    this.parsedSheet = json;
  }

  async execute() {
    if (!this.parsedSheet) throw new Error("Spreadsheet data not parsed.");
    let upsertedCount = 0;

    for (const customerFromSheet of this.parsedSheet) {
      const customerSheetParser = new CustomerSheetParser(customerFromSheet);

      const { customer, contract } = customerSheetParser.parse();

      await strapi.db.transaction(async () => {
        const upsertedCustomer = await this.upsertCustomer(customer);
        await this.upsertContract(Number(upsertedCustomer.id), contract);
        upsertedCount++;
      });
    }

    return {
      upsertedCount,
      errorsCount: this.parsedSheet.length - upsertedCount,
    };
  }
  private async upsertCustomer(customer: ApiCustomer) {
    const existentCustomer = await strapi
      .query("api::cliente.cliente")
      .findOne({
        where: {
          nome: customer.nome,
        },
      });

    if (!existentCustomer)
      return await strapi.entityService.create("api::cliente.cliente", {
        data: customer,
      });

    return await strapi.entityService.update(
      "api::cliente.cliente",
      existentCustomer.id,
      {
        data: customer,
      }
    );
  }

  private async upsertContract(customerId: number, contract: ApiContract) {
    const registeredCustomer = await strapi.entityService.findOne(
      "api::cliente.cliente",
      customerId,
      {
        populate: {
          contratos: true,
        },
      }
    );

    const contractWithSameStartDate = registeredCustomer.contratos.find(
      (registeredContract: ApiContract) => {
        if (!registeredContract.dataInicio && !contract.dataInicio) return true;

        return (
          new Date(registeredContract.dataInicio).getTime() ===
          new Date(contract.dataInicio).getTime()
        );
      }
    );

    if (!contractWithSameStartDate) {
      return await strapi.entityService.create("api::contrato.contrato", {
        data: {
          ...contract,
          cliente: {
            id: registeredCustomer.id,
          },
        },
      });
    }

    return await strapi.entityService.update(
      "api::contrato.contrato",
      contractWithSameStartDate.id,
      {
        data: contract,
      }
    );
  }
}
