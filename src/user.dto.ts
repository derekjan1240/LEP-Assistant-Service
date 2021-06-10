import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  role: string;

  public static from(dto: Partial<UserDto>) {
    const it = new UserDto();
    it._id = dto._id;
    it.userName = dto.userName;
    it.role = dto.role;
    return it;
  }
}
