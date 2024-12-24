import { RoleEnum } from '@enums/role.enum';
import { UserPendingIssuesEnum } from '@enums/user-pending-issues.enum';
import { TestUtil } from '@test/utils/test.util';
import { testingE2eUtil } from '@test/utils/testing-e2e.util';

describe('AuthController', () => {
  const { itUtil } = testingE2eUtil();

  it('Deve autenticar usuário com email', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.autoLogin(false);
      user.role(RoleEnum.ADMINISTRATOR);
    });

    const { status, body, headers } = await api
      .post('/auth/login')
      .set({
        sc: 'wb',
      })
      .send({
        identity: 'user.test@test.com',
        password: 'abc123',
      })
      .then(TestUtil.parseResponseUtil);

    const cr = TestUtil.parseCookieUtil(
      headers['set-cookie'] as unknown as string[],
    )[0];

    expect(status).toBe(200);
    expect(body).toStrictEqual({
      name: 'User Test',
      email: 'user.test@test.com',
      role: 'ADMINISTRATOR',
    });
    expect(cr.Path).toBe('/');
    expect(cr.Secure).toBeUndefined();
    expect(cr.HttpOnly).toBeUndefined();
    expect(cr.SameSite).toBe('None');
    expect(cr.access_token).toBeTruthy();
    expect(TestUtil.jwtDecode(cr.access_token ?? '')).toStrictEqual({
      sub: '0d6e7a61-05d9-4c5f-84f6-40919f754d56',
      sc: false,
      jti: expect.any(String),
      nbf: expect.any(Number),
      tt: 'wb',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('Não deve autenticar com email errado', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.autoLogin(false);
    });

    const { status, body } = await api
      .post('/auth/login')
      .set({
        sc: 'wb',
      })
      .send({
        identity: 'user.test@test.c',
        password: 'abc123',
      })
      .then(TestUtil.parseResponseUtil);

    expect(status).toBe(403);
    expect(body).toStrictEqual({
      code: 'PASSWORD_OR_EMAIL_WRONG',
      msg: expect.any(String),
    });
  });

  it('Não deve autenticar com senha errada', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.autoLogin(false);
    });

    const { status, body } = await api
      .post('/auth/login')
      .set({
        sc: 'wb',
      })
      .send({
        identity: 'user.test@test.com',
        password: 'KAkBAskjd',
      })
      .then(TestUtil.parseResponseUtil);

    expect(status).toBe(403);
    expect(body).toStrictEqual({
      code: 'PASSWORD_OR_EMAIL_WRONG',
      msg: expect.any(String),
    });
  });

  it('Deve deslogar usuário com sucesso', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.role(RoleEnum.ADMINISTRATOR);
    });

    const { status } = await api
      .post('/auth/logout')
      .then(TestUtil.parseResponseUtil);

    expect(status).toBe(200);
  });

  it('Deve buscar informações do usuário', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.role(RoleEnum.ADMINISTRATOR);
    });

    const { status, body } = await api
      .get('/auth/me')
      .then(TestUtil.parseResponseUtil);

    expect(status).toBe(200);
    expect(body).toStrictEqual({
      name: 'User Test',
      email: 'user.test@test.com',
      role: 'ADMINISTRATOR',
    });
  });

  it('Não deve buscar informações do usuário, se não autenticado', async () => {
    const { api } = itUtil();

    const { status, body } = await api
      .get('/auth/me')
      .then(TestUtil.parseResponseUtil);

    expect(status).toBe(401);
    expect(body).toStrictEqual({
      code: 'NOT_AUTHORIZED',
      details: 'Unauthorized',
      msg: expect.any(String),
    });
  });

  it('Deve buscar as pendências do usuário com sucesso', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.pendingIssues(UserPendingIssuesEnum.values());
      user.role(RoleEnum.ADMINISTRATOR);
    });

    const { status, body } = await api
      .get('/auth/pending-issues')
      .then(TestUtil.parseResponseUtil);

    expect(status).toBe(200);
    expect(body).toStrictEqual([
      { description: 'Necessário alterar senha', name: 'TEMPORARY_PASSWORD' },
    ]);
  });

  it('Deve buscar as pendências do usuário', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.pendingIssues([UserPendingIssuesEnum.TEMPORARY_PASSWORD]);
      user.role(RoleEnum.ADMINISTRATOR);
    });

    const { status, body } = await api
      .get('/auth/pending-issues')
      .then(TestUtil.parseResponseUtil);

    expect(status).toBe(200);
    expect(body).toStrictEqual([
      {
        description: 'Necessário alterar senha',
        name: 'TEMPORARY_PASSWORD',
      },
    ]);
  });
});
