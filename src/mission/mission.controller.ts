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

  @Post()
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

  @Get('/teacher')
  public async findAllMissionTeacher(
    @Req() req,
    @Query() query,
  ): Promise<MissionTeacher[]> {
    const user = await this.appService.validAauthentication(req.headers);
    return this.missionService.findAllMissionTeacher(query, user);
  }

  @Get('/')
  public async findAllMissions(): Promise<Mission[]> {
    return this.missionService.findAllMissions();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.missionService.findOne(+id);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ) {
    return this.missionService.update(+id, updateMissionDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.missionService.remove(+id);
  }
}