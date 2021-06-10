import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  user: string;
}
