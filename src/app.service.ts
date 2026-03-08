import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { instanceId: process.env.INSTANCE_ID };
  }
}
