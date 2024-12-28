import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DefaultResponse } from './shared/models/default-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  getStatus(): DefaultResponse<any> {
    const res: DefaultResponse<any> = new DefaultResponse({ status: 'ok' });
    return res;
  }
}
