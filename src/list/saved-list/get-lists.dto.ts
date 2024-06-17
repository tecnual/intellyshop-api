import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum } from 'class-validator';

enum ValidHiddenFields {
  images,
  cartItems,
  listItems,
}

export class GetListsDto {
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === 'yes') return true;
    if (value === 'false' || value === '0' || value === 'no') return false;
    return value;
  })
  @IsBoolean()
  readonly isIncome?: boolean;

  @Transform(({ value }) => {
    return value.split(',');
  })
  @IsEnum(ValidHiddenFields, { each: true })
  readonly hideFields?: ValidHiddenFields[];
}
