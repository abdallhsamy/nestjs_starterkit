import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UseFilters,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { HttpExceptionFilter } from "./http-exception.filter";

@Injectable()
@UseFilters(new HttpExceptionFilter())
export class TypeormErrorFilter implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {

    if (!metatype || !this.toValidate(metatype)) {
      return value
    }


    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    const errorsObject = {}

    let errorMsgs = []

    if (errors.length > 0) {

      const errorsResponse: any = errors.map((val: any) => {

        if( val.children.length === 0 )
        {
          for (const key of Object.keys(val.constraints))
          {

            if (key == "isNotEmpty")
              errorMsgs.push("The " + val.property + " field is required.")
            else
              errorMsgs.push(val.constraints[key])

          }

          errorsObject[val.property] = errorMsgs
          errorMsgs = []

        }else
        {


          for (const child of val.children)
          {
            errorsObject[val.property] = {};

            for (const nestedChild of child.children)
            {
              for (const key of Object.keys(nestedChild.constraints))
              {
                if (key == "isNotEmpty")
                  errorMsgs.push("The " + nestedChild.property + " field is required.")
                else
                  errorMsgs.push(nestedChild.constraints[key])
              }

              errorsObject[val.property][nestedChild.property] = errorMsgs
              errorMsgs = []

            }

          }



        }



      })

      throw new HttpException({
        message: 'Have ' + (errors.length) + ' error(s)',
        ...errorsObject
      },HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return value
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}