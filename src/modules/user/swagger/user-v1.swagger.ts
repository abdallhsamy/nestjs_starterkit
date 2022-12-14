import { HttpStatus } from '@nestjs/common';
import { unauthorized } from '@constants/swagger.const';

export const findAll = {
  req: {
    query: {
      limit: { type: 'number', name: 'limit', example: 10, required: false },
      offset: { type: 'number', name: 'offset', example: 0, required: false },
    },
  },

  res: {
    ok: {
      status: HttpStatus.OK,
      description: 'Users are fetched successfully',
    },
    unauthorized,
  },
};

export const findOne = {
  req: {
    params: {
      id: { type: 'string', name: 'id', example: '1', required: true },
    },
  },
  res: {
    ok: {
      status: HttpStatus.OK,
      description: 'User is fetched successfully',
    },
    unauthorized,
  },
};

export const create = {
  req: {
    body: {
      description: 'All fields are required except password field',
      schema: {
        type: 'object',
        properties: {
          translations: { type: 'array' },
        },
      },
    },
  },
  res: {
    created: {
      status: HttpStatus.CREATED,
      description: 'User is created successfully',
    },
    unauthorized: unauthorized,
    bad_request: {
      status: HttpStatus.BAD_REQUEST,
      description: 'Error while creating user',
    },
    conflict: {
      status: HttpStatus.CONFLICT,
      description: 'Duplicate name',
    },
  },
};

export const update = {
  req: {
    params: {
      id: { type: 'string', name: 'id', example: '1', required: true },
    },
    body: {
      description: 'name field is required',
      schema: {
        type: 'object',
        properties: {
          translations: { type: 'array' },
        },
      },
    },
  },
  res: {
    ok: {
      status: HttpStatus.OK,
      description: 'User is updated successfully',
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
      description: 'name is already used by another user',
    },
  },
};

export const softDelete = {
  req: {
    params: {
      id: { type: 'string', name: 'id', example: '1', required: true },
    },
  },
  res: {
    ok: {
      status: HttpStatus.OK,
      description: 'User is deleted successfully',
    },
    unauthorized: unauthorized,
    unprocessable: {
      status: HttpStatus.BAD_REQUEST,
      description: 'Error while deleting user',
    },
  },
};
