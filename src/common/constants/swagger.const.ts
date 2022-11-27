import { HttpStatus } from '@nestjs/common';

// More general swagger constants
export const unauthorized = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized',
};
