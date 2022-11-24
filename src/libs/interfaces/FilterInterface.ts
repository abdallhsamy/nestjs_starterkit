export interface FilterInterface {
  page: number;
  limit: number;
  sort_key: string; // such as id , name , ...
  order: string; // asc or desc
  filters: Object;
}
