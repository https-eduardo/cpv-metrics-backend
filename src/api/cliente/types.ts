import { Attribute } from "@strapi/strapi";

export type ApiCustomerAddress = Omit<
  Attribute.GetValues<"cliente.endereco">,
  "id"
>;
export type ApiCustomer = Omit<
  Attribute.GetValues<"api::cliente.cliente">,
  "endereco" | "id"
> & {
  endereco: ApiCustomerAddress;
};
export type ApiContract = Omit<
  Attribute.GetValues<"api::contrato.contrato">,
  "id"
>;
export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export interface CustomerFromSheet {
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

export interface CustomerSheetParseResult {
  customer: ApiCustomer;
  contract: ApiContract;
}
