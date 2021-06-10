import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MissionTeacher,
  MissionTeacherDocument,
} from './schemas/missionTeacher.schema';
import { Mission, MissionDocument } from './schemas/mission.schema';
import { CreateMissionTeacherDto } from './dto/create-missionTeacher.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { UserDto } from 'src/user.dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectModel(MissionTeacher.name)
    private missionTeacherModel: Model<MissionTeacherDocument>,
    @InjectModel(Mission.name)
    private missionModel: Model<MissionDocument>,
  ) {}

  public async createFakeMissionTeacher() {
    const newMission = await this.missionTeacherModel.create({
      name: 'FAKE_MISSION_TEACHER',
      type: 'Video',
      exercise: '',
      unit: '9bd54ccd-6584-4cf5-9bf5-435d0e2fcadc',
      owner: '609c247d4099fa16842d9dba',
    });
    newMission.save();
  }

  public async createFakeMission() {
    const Missions = await this.missionTeacherModel.find();
    const newMission = await this.missionModel.create({
      mission: Missions[0]._id,
      assigner: '609c247d4099fa16842d9dba',
      assignee: '60aafa453d89db5b647e0c46',
    });
    newMission.save();
  }

  public async createMissionTeacher(
    createMissionTeacherDto: CreateMissionTeacherDto,
    user: UserDto,
  ) {
    // console.log(createMissionTeacherDto, user);
    try {
      const newMissionTeacher = await this.missionTeacherModel.create({
        ...createMissionTeacherDto,
        owner: user._id,
      });
      return newMissionTeacher.save().then(missionTeacher => {
        return missionTeacher.toJson();
      });
    } catch (error) {
      throw new HttpException(
        `新增任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findAllMissionTeacher(query, user: UserDto) {
    try {
      const Missions = await this.missionTeacherModel
        .find({ owner: user._id })
        .sort({ createdAt: 1 });
      return Missions;
    } catch (error) {
      throw new HttpException(
        `查詢任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findAllMissions() {
    const Missions = await this.missionModel.find().populate('mission');
    return Missions;
  }

  public async findOne(id: number) {
    return `This action returns a #${id} mission`;
  }

  public async update(id: number, updateMissionDto: UpdateMissionDto) {
    return `This action updates a #${id} mission`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} mission`;
  }
}
