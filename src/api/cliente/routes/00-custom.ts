export default {
  routes: [
    {
      method: "POST",
      path: "/clientes/import-sheet",
      handler: "cliente.importFromSheet",
    },
    {
      method: "GET",
      path: "/clientes/general-info",
      handler: "cliente.getGeneralInfo",
    },
  ],
};
