export type AppBindings = {
  DB: D1Database;
  JWT_SECRET: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  R2_PUBLIC_URL?: string;
};

export type AppVariables = {
  jwtPayload: {
    userId: string;
  };
};
