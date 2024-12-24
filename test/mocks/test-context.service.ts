import { Global, Injectable, OnModuleInit } from '@nestjs/common';
import { UserMockBuilder } from '@test/utils/user-mock-builder';

@Global()
@Injectable()
export class TestContextService implements OnModuleInit {
  userMockBuilder!: UserMockBuilder;

  onModuleInit() {
    this.init();
  }

  private init() {
    this.userMockBuilder = UserMockBuilder.builder();
  }

  setUserMockBuilder(userMock: UserMockBuilder | undefined) {
    if (userMock) this.userMockBuilder = userMock;
  }

  resetTestContext() {
    this.init();
  }
}
