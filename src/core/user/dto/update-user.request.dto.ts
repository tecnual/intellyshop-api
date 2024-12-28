import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsOptional()
  readonly username?: string;
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;
  @IsString()
  @IsOptional()
  readonly password?: string;
  @IsEmail()
  @IsOptional()
  readonly email?: string;
  @IsString()
  @IsOptional()
  readonly lang?: string;
}

export class FireflySettings {
  token: string;
  defaultSourceAccount: EntityReference;
  defaultDestinationAccount: EntityReference;
  defaultBudget: EntityReference;
  defaultCategory: EntityReference;
  accounts: Account[];
}

export class EntityReference {
  id: string;
  name: string;
}

export class Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
}
