import type { Schema, Attribute } from '@strapi/strapi';

export interface ClienteEndereco extends Schema.Component {
  collectionName: 'components_cliente_enderecos';
  info: {
    displayName: 'Endereco';
    icon: 'earth';
  };
  attributes: {
    cidade: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Londrina'>;
    estado: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Paran\u00E1'>;
    regiao: Attribute.Enumeration<
      ['Sul', 'Sudeste', 'Centro Oeste', 'Nordeste', 'Norte']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'Sul'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'cliente.endereco': ClienteEndereco;
    }
  }
}
