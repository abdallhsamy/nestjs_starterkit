import { HttpStatus } from '@nestjs/common';
import { unauthorized } from '@constants/swagger.const';

export const get = {
  req: {
    query: {
      limit: { type: 'number', name: 'limit', example: 10, required: false },
      offset: { type: 'number', name: 'offset', example: 0, required: false },
    },
  },

  res: {
    ok: {
      status: HttpStatus.OK,
      description: 'profile data is fetched successfully',
    },
    unauthorized,
  },
};

export const update = {
  req: {
    body: {
      description: 'name field is required',
      schema: {
        type: 'object',
        properties: {
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          password_confirmation: { type: 'string' },
          avatar: { type: 'string' },
        },
      },
    },
  },
  res: {
    ok: {
      status: HttpStatus.OK,
      description: 'profile is updated successfully',
    },
    unauthorized: unauthorized,
    bad_request_email: {
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid Email',
    },
    bad_request_password: {
      status: HttpStatus.BAD_REQUEST,
      description: 'Should insert new password to update',
    },
    unprocessable: {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: 'email is already used by another user',
    },
  },
};
