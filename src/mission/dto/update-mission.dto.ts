import { PartialType } from '@nestjs/mapped-types';
import { CreateMissionTeacherDto } from './create-missionTeacher.dto';

export class UpdateMissionDto extends PartialType(CreateMissionTeacherDto) {}
