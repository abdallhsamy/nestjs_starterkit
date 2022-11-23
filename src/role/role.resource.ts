import { RoleEntity } from './entities/role.entity';
import { ResourceResponse } from '../libs/classes/resource-response';
import {
  calculateRoleTaxes,
  getAvailableTaxes, getImageBasePath,
} from '../libs/utils/methods';
import { Transform } from 'class-transformer';

export class RoleResource extends ResourceResponse {
  static single(role: RoleEntity) {
    return this.#toArray(role);
  }

  static collection(roles: RoleEntity[]) {
    return roles.map((role) => this.#toArray(role));
  }

  static #toArray(role: RoleEntity) {

    const roleTotalTax = calculateRoleTaxes(role['price']);

    return {
      id: role['id'],
      // mainImage : getImageBasePath() + role['mainImage'],
      // images: JSON.parse(role['images']).map( (image) => getImageBasePath() + image ),
      // sku: role['sku'],
      // stockQuantity: role['stockQuantity'],
      // status: role['status'],
      // rate: role['rate'],
      // categoryId: role['categoryId'],
      created_at: role['created_at'],
      // price: +role['price'],
      // discount_from: role['discount_from'],
      // discount_to: role['discount_to'],
      // // tax: roleTotalTax,
      // // price_after_vat: +role['price'] + roleTotalTax,
      name: role['name'],
      // shortDescription: role['shortDescription'],
      // longDescription: role['longDescription'],

    };
  }
}
