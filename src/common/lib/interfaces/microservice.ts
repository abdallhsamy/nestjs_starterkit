export interface MicroServiceMessagePattern {
  data?: any;
  params?: any;
  request: {
    headers: any;
    body: any;
    params: any;
  };
  service: string;
}
