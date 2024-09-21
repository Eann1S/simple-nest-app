export type RegisterDto = {
  email: string;
  password: string;
  name?: string;
};

export type SignInDto = {
  email: string;
  password: string;
};

export type JwtDto = {
  access_token: string;
};
