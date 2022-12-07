import { InternalServerErrorException } from '@nestjs/common';
import { ormOptions } from '@src/common/ormconfig';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsExistConstraint implements ValidatorConstraintInterface {
  private connection;
  constructor() {
    this.connection = new DataSource(ormOptions).initialize();
  }
  async validate(value: any, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`];

    // create connection to database
    this.connection = await createConnection();
    if (!this.connection) throw new InternalServerErrorException();

    // fetch item by specific condition
    const item = await this.connection
      .getRepository(entity)
      .findOneBy({ [args.property]: value });
    return !!item;
  }
}

export function IsExist(
  entity: Function,
  validationOptions?: ValidationOptions,
) {
  validationOptions = {
    ...{ message: 'data is not exists with this $property.' },
    ...validationOptions,
  };
  return function (object: Object, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsExistConstraint,
    });
  };
}

async function createConnection() {
  return await new DataSource(ormOptions).initialize();
}
