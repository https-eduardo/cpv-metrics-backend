export default {
  routes: [
    {
      method: "POST",
      path: "/clientes/import-sheet",
      handler: "cliente.importFromSheet",
    },
  ],
};
