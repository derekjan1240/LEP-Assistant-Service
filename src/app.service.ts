import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { AuthenticationDto } from './authentication.dto';
import { UserDto } from './user.dto';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
        retryAttempts: 10,
        retryDelay: 3000, // in miliseconds
      },
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async validAauthentication(headers: any) {
    const authenticationDto = {
      token: headers.token,
      user: headers.user,
    };

    const user = await this.client
      .send<any, AuthenticationDto>('AUTH_valid_user', authenticationDto)
      .toPromise();

    if (!user) {
      throw new HttpException(`您沒有此操作權限!`, HttpStatus.UNAUTHORIZED);
    }

    return UserDto.from(user);
  }

  public async getUsersRelation(users: string[]) {
    const usersData = await this.client
      .send<any, string[]>('AUTH_get_user_relation', users)
      .toPromise();

    return usersData;
  }

  public async getClassroomsRelation(classrooms: string[]) {
    const classroomsData = await this.client
      .send<any, string[]>('CONTENT_get_classroom_relation', classrooms)
      .toPromise();

    return classroomsData;
  }

  public async getMissionContentRelation(missions, withAnswers = false) {
    const data = {
      exerciseIDs: missions
        .filter(mission => mission.exercise !== '')
        .map(mission => mission.exercise),
      unitIDs: missions
        .filter(mission => mission.unit !== '')
        .map(mission => mission.unit),
      withAnswers,
    };
    const missionsData = await this.client
      .send<any, any>('CONTENT_get_mission_relation', data)
      .toPromise();

    return missions.map(mission => {
      return {
        ...mission.toJson(),
        exercise:
          mission.exercise &&
          missionsData.exercises.filter(
            exercise => exercise.id === mission.exercise,
          )[0],
        unit:
          mission.unit &&
          missionsData.units.filter(unit => unit.id === mission.unit)[0],
      };
    });
  }

  /* 實驗用 */
  public async testWithRddis() {
    // Auth
    const dataAuth = await this.client
      .send<any, number>('AUTH_test', 0)
      .toPromise();
    // Content
    const dataContent = await this.client
      .send<any, number>('CONTENT_test', 0)
      .toPromise();
    // Visual
    const dataVisual = await this.client
      .send<any, number>('VISUALIZATION_test', 0)
      .toPromise();

    return {
      authentication: dataAuth,
      content: dataContent,
      visualization: dataVisual,
    };
  }
}
