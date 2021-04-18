import { Expose, Transform, Type,  } from "class-transformer";
import { IsBoolean, IsBooleanString, IsOptional, ValidateIf } from "class-validator";

export class IncomeDto {
  @Transform(({value}) => value === 'true')
  income?: boolean;
}
