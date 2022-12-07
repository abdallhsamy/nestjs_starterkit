import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { config } from 'dotenv';

config();

@Injectable()
export class SetGlobalVarsMiddleware implements NestMiddleware {
  async use(req: Request, res: Response<any>, next: () => any): Promise<any> {
    global.accept_lang = req.headers['accept-language'] || 'ar';
    next();
  }
}
