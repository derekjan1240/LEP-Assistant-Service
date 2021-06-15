import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MissionTeacher,
  MissionTeacherDocument,
} from './schemas/missionTeacher.schema';
import { Mission, MissionDocument } from './schemas/mission.schema';
import { CreateMissionDto } from './dto/create-mission.dto';
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

  // public async createFakeMissionTeacher() {
  //   const newMission = await this.missionTeacherModel.create({
  //     name: 'FAKE_MISSION_TEACHER',
  //     type: 'Video',
  //     exercise: '',
  //     unit: '9bd54ccd-6584-4cf5-9bf5-435d0e2fcadc',
  //     owner: '609c247d4099fa16842d9dba',
  //   });
  //   newMission.save();
  // }

  // public async createFakeMission() {
  //   const Missions = await this.missionTeacherModel.find();
  //   const newMission = await this.missionModel.create({
  //     mission: Missions[0]._id,
  //     assigner: '609c247d4099fa16842d9dba',
  //     assignee: '60aafa453d89db5b647e0c46',
  //   });
  //   newMission.save();
  // }

  public async createMission(
    createMissionDto: CreateMissionDto,
    user: UserDto,
  ) {
    try {
      const mission = await this.missionTeacherModel.findById(
        createMissionDto.mission,
      );
      if (!mission) {
        throw new HttpException(`任務不存在!`, HttpStatus.NOT_FOUND);
      }
      const newMission = await this.missionModel.create({
        mission: mission._id,
        assigner: user._id,
        assignee: createMissionDto.assignee,
        classroom: createMissionDto.classroom,
      });
      return newMission.toJson();
    } catch (error) {
      throw new HttpException(
        `新增任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createMissionTeacher(
    createMissionTeacherDto: CreateMissionTeacherDto,
    user: UserDto,
  ) {
    try {
      const newMissionTeacher = await this.missionTeacherModel.create({
        ...createMissionTeacherDto,
        owner: user._id,
      });
      return newMissionTeacher.toJson();
    } catch (error) {
      throw new HttpException(
        `新增任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async studentFinishMission(
    id: string,
    finishMissionDto: any,
    user: UserDto,
  ) {
    try {
      const mission = await this.missionModel.findById(id);
      if (!mission) {
        throw new HttpException(`任務不存在!`, HttpStatus.NOT_FOUND);
      }
      // 確認為該任務被指派人
      if (mission.assignee !== user._id) {
        throw new HttpException(`您無權編輯此任務!`, HttpStatus.UNAUTHORIZED);
      }
      // 防止重複完成
      if (mission.is_complated) {
        throw new HttpException(`此任務已完成!`, HttpStatus.BAD_REQUEST);
      }
      const newMission = await this.missionModel.findByIdAndUpdate(
        id,
        {
          answer: finishMissionDto.answers,
          is_complated: true,
          complated_date: new Date(),
        },
        { new: true },
      );
      return newMission;
    } catch (error) {
      throw new HttpException(
        `編輯任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async studentReviewMission(
    id: string,
    reviewMissionDto: any,
    user: UserDto,
  ) {
    try {
      const mission = await this.missionModel.findById(id);
      if (!mission) {
        throw new HttpException(`任務不存在!`, HttpStatus.NOT_FOUND);
      }
      // 確認為該任務指派人
      if (mission.assigner !== user._id) {
        throw new HttpException(`您無權編輯此任務!`, HttpStatus.UNAUTHORIZED);
      }
      // 防止重複批閱
      if (mission.is_reviewed) {
        throw new HttpException(`此任務已批閱!`, HttpStatus.BAD_REQUEST);
      }
      const newMission = await this.missionModel.findByIdAndUpdate(
        id,
        {
          review: reviewMissionDto,
          is_reviewed: true,
          reviewed_date: new Date(),
        },
        { new: true },
      );
      return newMission;
    } catch (error) {
      throw new HttpException(
        `編輯任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findAllMissionTeacher(user: UserDto) {
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

  public async findAllStudentMissions() {
    try {
      return await this.missionModel.find().populate('mission');
    } catch (error) {
      throw new HttpException(
        `查詢任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findStudentMissions(user: UserDto) {
    try {
      const query =
        user.role === 'Student'
          ? { assignee: user._id }
          : { assigner: user._id };
      return await this.missionModel
        .find(query)
        .populate('mission')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new HttpException(
        `查詢任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findStudentMission(id: string, user: UserDto) {
    try {
      const mission = await this.missionModel.findById(id).populate('mission');
      if (!mission) {
        throw new HttpException(`任務不存在!`, HttpStatus.NOT_FOUND);
      }
      if (mission.assignee !== user._id && mission.assigner !== user._id) {
        throw new HttpException(`您無權限瀏覽該任務!`, HttpStatus.UNAUTHORIZED);
      }
      return mission;
    } catch (error) {
      throw new HttpException(
        `查詢任務失敗!`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // public async findOne(id: number) {
  //   return `This action returns a #${id} mission`;
  // }

  // public async update(id: number, updateMissionDto: UpdateMissionDto) {
  //   return `This action updates a #${id} mission`;
  // }

  // public async remove(id: number) {
  //   return `This action removes a #${id} mission`;
  // }
}
