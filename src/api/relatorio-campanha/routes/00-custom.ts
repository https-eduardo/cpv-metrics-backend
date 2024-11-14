export default {
  routes: [
    {
      method: "POST",
      path: "/relatorio-campanhas/import-sheet",
      handler: "relatorio-campanha.importFromSheet",
    },
    {
      method: "GET",
      path: "/relatorio-campanhas/general-info",
      handler: "relatorio-campanha.getGeneralInfo",
    },
  ],
};
