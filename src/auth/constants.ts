import { getSecret } from '../common/utils/secrets.util';

export const jwtConstants = {
  secret: getSecret('JWT_SECRET') || 'nest-backend09',
};