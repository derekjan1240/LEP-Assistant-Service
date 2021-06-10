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

  public async getUserRelation(manager: string[], students: string[]) {
    const managerData = await this.client
      .send<any, string[]>('AUTH_get_user_relation', manager)
      .toPromise();

    const studentsData = await this.client
      .send<any, string[]>('AUTH_get_user_relation', students)
      .toPromise();

    return {
      manager: managerData[0],
      studentList: studentsData,
    };
  }
}
