import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { AppService } from 'src/app.service';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { CreateMissionTeacherDto } from './dto/create-missionTeacher.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

import { MissionTeacher } from './schemas/missionTeacher.schema';
import { Mission } from './schemas/mission.schema';

@Controller('mission')
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly appService: AppService,
  ) {}

  // 取得所有指派任務
  @Get()
  public async findAllStudentMissions(): Promise<Mission[]> {
    return this.missionService.findAllStudentMissions();
  }

  // 取得單一學生所有指派任務
  @Get('/student')
  public async findStudentMissions(@Req() req): Promise<any[]> {
    const user = await this.appService.validAauthentication(req.headers);
    const missions = await this.missionService.findStudentMissions(user);
    const content = await this.appService.getMissionContentRelation(
      missions.map(mission => mission.mission),
    );
    return missions.map((mission, index) => {
      return {
        ...mission.toJson(),
        content: content[index],
      };
    });
  }

  // 取得特定指派任務
  @Get('/content/:id')
  public async findStudentMission(
    @Req() req,
    @Param('id') id: string,
  ): Promise<any> {
    const user = await this.appService.validAauthentication(req.headers);
    const mission = await this.missionService.findStudentMission(id, user);
    const content = await this.appService.getMissionContentRelation([
      mission.mission,
    ]);
    return {
      ...mission.toJson(),
      content: content[0],
    };
  }

  // 學生完成任務
  @Put('/content/:id')
  public async finishStudentMission(
    @Req() req,
    @Param('id') id: string,
    @Body() finishMissionDto: any,
  ): Promise<any> {
    const user = await this.appService.validAauthentication(req.headers);
    const newMission = await this.missionService.studentFinishMission(
      id,
      finishMissionDto,
      user,
    );
    return newMission.toJson();
  }

  // 教師指派任務
  @Post()
  public async createMission(
    @Req() req,
    @Body() createMissionDto: CreateMissionDto,
  ) {
    const user = await this.appService.validAauthentication(req.headers);
    return this.missionService.createMission(createMissionDto, user);
  }

  // 取得單一教師所有任務模板
  @Get('/teacher')
  public async findAllMissionTeacher(@Req() req): Promise<MissionTeacher[]> {
    const user = await this.appService.validAauthentication(req.headers);
    return this.missionService.findAllMissionTeacher(user);
  }

  // 教師新增任務模板
  @Post('/teacher')
  public async createMissionTeacher(
    @Req() req,
    @Body() createMissionTeacherDto: CreateMissionTeacherDto,
  ) {
    const user = await this.appService.validAauthentication(req.headers);
    return this.missionService.createMissionTeacher(
      createMissionTeacherDto,
      user,
    );
  }

  // @Get(':id')
  // public async findOne(@Param('id') id: string) {
  //   return this.missionService.findOne(+id);
  // }

  // @Put(':id')
  // public async update(
  //   @Param('id') id: string,
  //   @Body() updateMissionDto: UpdateMissionDto,
  // ) {
  //   return this.missionService.update(+id, updateMissionDto);
  // }

  // @Delete(':id')
  // public async remove(@Param('id') id: string) {
  //   return this.missionService.remove(+id);
  // }
}
