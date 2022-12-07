import { Response } from 'express';

export function getRestfulResponse(
  res: Response,
  status: number,
  data?: any | any[],
): any {
  return res.status(status).json(data);
}
