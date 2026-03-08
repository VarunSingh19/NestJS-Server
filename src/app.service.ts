import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    console.log('Coming from app service');
    return { instanceId: process.env.INSTANCE_ID };
  }
}
