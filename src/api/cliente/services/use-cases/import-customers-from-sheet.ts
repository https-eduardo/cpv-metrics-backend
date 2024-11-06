import XLSX from "xlsx";

interface CustomerFromSheet {
  Cliente: string;
  "Tempo de contrato em meses": number;
  "Início do contrato": Date;
  "Data de término do contrato": Date;
  "Status da Conta": string;
  "Tier do Cliente": string;
  Situação: string;
  Mensalidade: number;
  "Life Time Value": number;
  CIDADE: string;
  ESTADO: string;
}

export class ImportCustomersFromSheetUseCase {
  private DEFAULT_IMPORT_SHEET = "Empresa";
  private parsedData: CustomerFromSheet[];
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

    this.parsedData = json;
  }

  async execute() {
    if (!this.parsedData) throw new Error("Spreadsheet data not parsed.");

    console.log(this.parsedData);
  }
}
