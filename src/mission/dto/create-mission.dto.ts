import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMissionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: '任務不得為空' })
  mission: ObjectId;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: '被指派人不得為空' })
  @IsString({ message: '被指派人型態錯誤' })
  assignee: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: '所屬班級不得為空' })
  @IsString({ message: '所屬班級型態錯誤' })
  classroom: string;
}
