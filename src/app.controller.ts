import { Controller, Get, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { ResponseApi } from '@utils/result.util'
import { Response } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    const response = new ResponseApi(res)

    response.setOk().setBody(this.appService.getHello())

    return response.send()
  }
}
