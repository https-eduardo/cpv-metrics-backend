import { Attribute } from "@strapi/strapi";
import { CustomerFromSheet } from "./import-customers-from-sheet";

type ApiCustomerAddress = Omit<Attribute.GetValues<"cliente.endereco">, "id">;
type ApiCustomer = Omit<
  Attribute.GetValues<"api::cliente.cliente">,
  "endereco" | "id"
> & {
  endereco: ApiCustomerAddress;
};
type ApiContract = Omit<Attribute.GetValues<"api::contrato.contrato">, "id">;
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

interface CustomerSheetParseResult {
  customer: ApiCustomer;
  contract: ApiContract;
}

export class CustomerSheetParser {
  private sheetCustomer: CustomerFromSheet;

  constructor(sheetCustomer: CustomerFromSheet) {
    this.sheetCustomer = sheetCustomer;
  }

  parse(): CustomerSheetParseResult {
    return {
      customer: {
        nome: this.sheetCustomer.Cliente,
        classificacao: this.getCustomerClassification(),
        status: this.getCustomerStatus(),
        endereco: {
          cidade: this.sheetCustomer.CIDADE,
          estado: this.sheetCustomer.ESTADO,
          regiao: this.getCustomerZone(),
        },
      },
      contract: {
        situacao: this.getContractSituation(),
        mensalidade: this.sheetCustomer.Mensalidade,
        ltv: this.sheetCustomer["Life Time Value"],
        mesesContratuais: this.sheetCustomer["Tempo de contrato em meses"],
        dataFinal: this.sheetCustomer["Data de término do contrato"],
        dataInicio: this.sheetCustomer["Início do contrato"],
      },
    };
  }

  private getCustomerClassification() {
    return this.sheetCustomer["Tier do Cliente"]
      .replace(/Cliente/g, "")
      .trim()
      .toUpperCase() as PropType<ApiCustomer, "classificacao">;
  }

  private getCustomerStatus() {
    const flagsMapped: Record<string, PropType<ApiCustomer, "status">> = {
      "RED FLAG": "bandeira_vermelha",
      "YELLOW FLAG": "bandeira_amarela",
      "GREEN FLAG": "bandeira_verde",
      "WHITE FLAG": "bandeira_branca",
      PERDIDO: "perdido",
    };

    return flagsMapped[this.sheetCustomer["Status da Conta"]];
  }

  private getContractSituation() {
    const sheetSituation = this.sheetCustomer["Situação"];

    if (sheetSituation === "Em aberto") return "aberto";
    else return "perdido";
  }

  private getCustomerZone() {
    const stateWithoutAccents = this.sheetCustomer.ESTADO?.normalize("NFD")
      ?.replace(/\p{Diacritic}/gu, "")
      ?.toLowerCase();

    const zoneMapping: Record<
      string,
      PropType<ApiCustomerAddress, "regiao">
    > = {
      parana: "Sul",
      "rio grande do sul": "Sul",
      "santa catarina": "Sul",
      "sao paulo": "Sudeste",
      "minas gerais": "Sudeste",
      "rio de janeiro": "Sudeste",
      "espirito santo": "Sudeste",
      "mato grosso do sul": "Centro Oeste",
      "distrito federal": "Centro Oeste",
      bahia: "Nordeste",
      alabama: "Internacional",
      california: "Internacional",
      "nova jersey": "Internacional",
    };

    return zoneMapping[stateWithoutAccents];
  }
}
