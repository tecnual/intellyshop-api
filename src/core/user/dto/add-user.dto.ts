export interface UserDto {
  readonly username: string;
  readonly name?: string;
  readonly password?: string;
  readonly email?: string;
  readonly lang?: string;
}
export class AddUserDto implements UserDto {
  readonly username: string;
  readonly name?: string;
  readonly password?: string;
  readonly email?: string;
  readonly lang?: string;
}
