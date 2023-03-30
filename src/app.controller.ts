import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ResponseApi } from '@utils/result.util'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return ResponseApi.builder().ok().body(this.appService.getHello())
  }
}
