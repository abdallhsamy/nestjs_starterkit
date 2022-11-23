import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiResponse
{

  static successResponse( message: string, data , status: number )
  {
    return { message, data , status }
  }

  static errorResponse( message: string, errors, status: number )
  {
    throw new HttpException({ message, ...errors },status);
  }

  static unAuthorizedResponse()
  {
    throw new HttpException({ message: 'unauthorized'  } , HttpStatus.UNAUTHORIZED);
  }

  static notFoundResponse( message = 'not found' )
  {
    throw new HttpException({ message } , HttpStatus.NOT_FOUND);
  }


}