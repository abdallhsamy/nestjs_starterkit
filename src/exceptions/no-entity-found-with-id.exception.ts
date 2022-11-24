import { TypeORMError } from '../typeorm.error';

export class NoEntityFoundWithId extends TypeORMError {
  constructor(id) {
    super(400, 'No Entity Found with id ' + id);
  }
}
