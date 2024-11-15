export interface ListCampaignsQueryParams {
  sort: string;
  sortOrder: "asc" | "desc";
  filterName: string;
  filterActive: string;
  start: Date;
  end: Date;
  page: number;
  pageSize: number;
}
