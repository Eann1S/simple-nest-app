export type RegisterDto = {
  email: string;
  password: string;
  name?: string;
};

export type JwtDto = {
  access_token: string;
};

export type UserDto = {
  id: number;
  email: string;
  name?: string;
};
