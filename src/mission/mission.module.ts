import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MissionService } from './mission.service';
import {
  MissionTeacher,
  MissionTeacherSchema,
} from './schemas/missionTeacher.schema';
import { Mission, MissionSchema } from './schemas/mission.schema';
import { MissionController } from './mission.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MissionTeacher.name, schema: MissionTeacherSchema },
      { name: Mission.name, schema: MissionSchema },
    ]),
  ],
  controllers: [MissionController],
  providers: [MissionService],
})
export class MissionModule {}
