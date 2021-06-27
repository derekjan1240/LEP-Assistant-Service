import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsEnum,
} from 'class-validator';

enum Type {
  Video = 'Video',
  Exercise = 'Exercise',
}
export class CreateMissionTeacherDto {
  @ApiProperty({ required: true })
  @Length(1, 100, { message: '任務名稱長度需要小於一百' })
  @IsString({ message: '任務名稱型態錯誤' })
  @IsNotEmpty({ message: '任務名稱不得為空' })
  name: string;

  @ApiProperty({ required: true })
  @IsEnum(Type, { message: '任務種類型態錯誤' })
  @IsNotEmpty({ message: '任務種類不得為空' })
  type: Type;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: '習題 ID 型態錯誤' })
  exercise: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: '單元 ID 型態錯誤' })
  unit: string;
}
