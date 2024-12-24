import { RoleEnum } from '@enums/role.enum';
import { UserPendingIssuesEnum } from '@enums/user-pending-issues.enum';
import { JwtPayload } from '@typings/jwt.typing';

export type MockUserFn = (builder: UserMockBuilder) => void;

export interface UserMock {
  id: string;
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
  pendingIssues: UserPendingIssuesEnum[];
}

export class UserMockBuilder {
  private readonly userMock: UserMock;
  private _autoLogin: boolean;
  private _tokenType: JwtPayload['tt'];
  private _stayConnected: boolean;

  constructor() {
    this._autoLogin = false;
    this._tokenType = 'wb';
    this._stayConnected = false;
    this.userMock = {
      id: '0d6e7a61-05d9-4c5f-84f6-40919f754d56',
      name: 'User Test',
      email: 'user.test@test.com',
      password: 'abc123',
      role: RoleEnum.ADMINISTRATOR,
      pendingIssues: [],
    };
  }

  static builder() {
    return new UserMockBuilder();
  }

  id(id: string) {
    this.userMock.id = id;
    return this;
  }

  name(name: string) {
    this.userMock.name = name;
    return this;
  }

  email(email: string) {
    this.userMock.email = email;
    return this;
  }

  password(password: string) {
    this.userMock.password = password;
    return this;
  }

  role(role: RoleEnum) {
    this.userMock.role = role;
    return this;
  }

  pendingIssues(issues: UserPendingIssuesEnum[]) {
    this.userMock.pendingIssues = issues;
    return this;
  }

  autoLogin(autoLogin: boolean) {
    this._autoLogin = autoLogin;
    return this;
  }

  stayConnected(connected: boolean) {
    this._stayConnected = connected;
    return this;
  }

  static getNewUserMock() {
    return new UserMockBuilder().userMock;
  }

  getUser() {
    return this.userMock;
  }

  getAutoLogin() {
    return this._autoLogin;
  }

  getTokenType() {
    return this._tokenType;
  }

  getStayConnected() {
    return this._stayConnected;
  }
}
