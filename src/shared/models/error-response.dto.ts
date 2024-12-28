import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ type: () => String, example: '90hd009dfsg098fg908sdf' })
  code: string;
  @ApiProperty({ type: () => String, example: 'No encontrado' })
  message: string;
}
