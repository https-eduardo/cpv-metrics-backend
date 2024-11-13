export default {
  routes: [
    {
      method: "POST",
      path: "/relatorio-campanhas/import-sheet",
      handler: "relatorio-campanha.importFromSheet",
    },
  ],
};
