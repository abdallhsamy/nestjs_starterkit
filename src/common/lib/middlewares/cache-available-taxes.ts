import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheAvailableTaxesMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async use(req: Request, res: Response<any>, next: () => any): Promise<any> {
    // global.available_taxes = await this.cacheManager.get('available_taxes');
    //
    // if ( ! global.available_taxes )
    //   global.available_taxes = await this.cacheManager.set('available_taxes', await getAvailableTaxes(), 1000);

    next();
  }
}
