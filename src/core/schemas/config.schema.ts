import * as J from 'joi';
export const configValidationSchema = J.object({
  STAGE: J.string().required(),
  PG_USER: J.string().required(),
  PG_PASSWORD: J.string().required(),
  PG_DB: J.string().required(),
  PG_PORT: J.number().default(5432).required(),
  PG_HOST: J.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: J.number().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: J.number().required(),
  JWT_ACCESS_TOKEN_SECRET: J.string().required(),
  JWT_REFRESH_TOKEN_SECRET: J.string().required(),
});
