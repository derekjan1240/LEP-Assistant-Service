import {
  Controller,
  Get,
  HttpException,
  HttpService,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MissionService } from './mission/mission.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    private readonly missionService: MissionService,
  ) {}

  @Get()
  public test(): string {
    return '[Assistant Service] : OK!';
  }

  /* 實驗用 API */
  @Get('/test/missions')
  public async getMissionsWithHttp(@Req() req) {
    try {
      const responseValidUser = await this.httpService
        .post('http://localhost:8081/test/valid/user', {
          data: {
            token: req.headers.token,
            user: req.headers.user,
          },
        })
        .toPromise();

      const user = responseValidUser.data;

      if (!user) {
        throw new HttpException(`使用者驗證失敗!`, HttpStatus.UNAUTHORIZED);
      }

      // 拉取任務
      const missions = await this.missionService.findStudentMissions(user);

      // 關聯任務內容
      const responseMissionRelation = await this.httpService
        .post('http://localhost:8083/test/get/mission/relation', {
          data: {
            contents: missions.map(mission => mission.mission),
            withAnswers: false,
          },
        })
        .toPromise();

      const contents = responseMissionRelation.data;

      // 關聯 指派人 & 被指派人
      let assignees = [];
      let assigners = [];

      if (user.role !== 'Student') {
        const ids = missions.map(mission => mission.assignee);
        const responseUserRelation = await this.httpService
          .post('http://localhost:8081/test/relation/user', {
            data: {
              ids,
            },
          })
          .toPromise();
        assignees = responseUserRelation.data;
      } else {
        const ids = missions.map(mission => mission.assignee);
        const responseUserRelation = await this.httpService
          .post('http://localhost:8081/test/relation/user', {
            data: {
              ids,
            },
          })
          .toPromise();
        assigners = responseUserRelation.data;
      }

      // 關聯所屬班級資料
      const responseUserRelation = await this.httpService
        .post('http://localhost:8083/test/get/classroom/relation', {
          data: {
            classrooms: missions.map(mission => mission.classroom),
          },
        })
        .toPromise();

      const classrooms = responseUserRelation.data;

      return missions.map((mission, index) => {
        return {
          ...mission.toJson(),
          content: contents[index],
          classroom: classrooms.filter(
            classroom => classroom.id === mission.classroom,
          )[0],
          assignee:
            user.role !== 'Student'
              ? assignees.filter(
                  assignee => assignee._id === mission.assignee,
                )[0]
              : user,
          assigner:
            user.role !== 'Student'
              ? user
              : assigners.filter(
                  assigner => assigner._id === mission.assigner,
                )[0],
        };
      });

      // return { missions, contents, assignees, assigners, classrooms };
    } catch (error) {
      return error;
    }
  }

  @Get('/test/withRedis')
  public async testWithRedis() {
    const data = await this.appService.testWithRddis();
    return data;
  }

  @Get('/test/withoutRedis')
  public async testWithoutRedis() {
    // Auth
    const responseAuth = await this.httpService
      .post('http://localhost:8081/test', {
        data: {
          id: 0,
        },
      })
      .toPromise();
    const dataAuth = responseAuth.data;
    console.log(dataAuth);
    // Content
    const responseContent = await this.httpService
      .post('http://localhost:8083/test', {
        data: {
          id: 0,
        },
      })
      .toPromise();
    const dataContent = responseContent.data;
    // Visual
    const responseVisual = await this.httpService
      .post('http://localhost:8086/test', {
        data: {
          id: 0,
        },
      })
      .toPromise();
    const dataVisual = responseVisual.data;

    return {
      authentication: dataAuth,
      content: dataContent,
      visualization: dataVisual,
    };
  }
}
