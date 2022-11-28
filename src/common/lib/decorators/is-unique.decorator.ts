import { ormOptions } from '@src/ormconfig';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UniqueExistConstraint implements ValidatorConstraintInterface {
  private connection: DataSource;
  constructor() {
    this.connection = new DataSource(ormOptions);
  }
  async validate(value: any, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`];
    const items = await this.connection.getRepository(entity).findOne({ [args.property]: value });
    return !items;
  }
}

export function Unique(entity: Function, validationOptions?: ValidationOptions) {
  validationOptions = { ...{ message: '$value already exists. Choose another.' }, ...validationOptions };
  return function (object: Object, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueExistConstraint,
    });
  }
}