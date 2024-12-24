import { RoleEnum } from '@enums/role.enum';
import { UserPendingIssuesEnum } from '@enums/user-pending-issues.enum';
import { RandomPasswordResponseDto } from '@resources/user/dto/random-password-response.dto';
import { UserRepository } from '@resources/user/user.repository';
import { TestUtil } from '@test/utils/test.util';
import { testingE2eUtil } from '@test/utils/testing-e2e.util';

describe('UserController', () => {
  const { itUtil } = testingE2eUtil();

  it('Deve gerar uma senha temporária e comparar com retorno', async () => {
    const { api, execScript, mockUserAuthenticated, getModule } = itUtil();

    const userRepository = getModule(UserRepository);

    mockUserAuthenticated((user) => {
      user.role(RoleEnum.ADMINISTRATOR);
      user.stayConnected(true);
    });

    await execScript('user/new-user.sql');
    const userId = '0bdbcf6d-2f7f-48b2-9749-35fa6b8eb12c';

    const resetPasswordResponse = await api
      .put(`/users/${userId}/reset-password`)
      .send()
      .then(TestUtil.parseResponseUtil<RandomPasswordResponseDto>);

    const temporaryPasswordResponse = await api
      .get(`/users/${userId}/temporary-password`)
      .send()
      .then(TestUtil.parseResponseUtil<RandomPasswordResponseDto>);

    const user = await userRepository.findOneByOrFail({
      id: userId,
    });

    expect(resetPasswordResponse.status).toBe(200);
    expect(temporaryPasswordResponse.status).toBe(200);
    expect(resetPasswordResponse.body).toStrictEqual(
      temporaryPasswordResponse.body,
    );
    expect(user.pendingIssues).toContain(
      UserPendingIssuesEnum.TEMPORARY_PASSWORD,
    );
  });

  it('Não deve resetar a senha ou buscar a mesma se não for ADMINISTRADOR', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.stayConnected(true);
      user.role(RoleEnum.GUEST);
    });

    const userId = '0bdbcf6d-2f7f-48b2-9749-35fa6b8eb12c';

    const resetPasswordResponse = await api
      .put(`/users/${userId}/reset-password`)
      .send()
      .then(TestUtil.parseResponseUtil<RandomPasswordResponseDto>);

    const temporaryPasswordResponse = await api
      .get(`/users/${userId}/temporary-password`)
      .send()
      .then(TestUtil.parseResponseUtil<RandomPasswordResponseDto>);

    expect(resetPasswordResponse.status).toEqual(403);
    expect(temporaryPasswordResponse.status).toEqual(403);
  });

  it('Deve alterar a senha com sucesso', async () => {
    const { api, mockUserAuthenticated, getModule } = itUtil();

    const userAuth = mockUserAuthenticated((user) => {
      user.role(RoleEnum.ADMINISTRATOR);
      user.pendingIssues([UserPendingIssuesEnum.TEMPORARY_PASSWORD]);
    });

    const userRepository = getModule(UserRepository);

    const { status } = await api
      .put('/users/change-password')
      .send({
        oldPassword: 'abc123',
        newPassword: 'Senha@123',
      })
      .then(TestUtil.parseResponseUtil);

    const user = await userRepository.findOneByOrFail({
      id: userAuth.id,
    });

    expect(status).toEqual(200);
    expect(user.pendingIssues).toStrictEqual([]);
  });

  it('Não deve alterar a senha se for fraca', async () => {
    const { api, mockUserAuthenticated } = itUtil();

    mockUserAuthenticated((user) => {
      user.role(RoleEnum.ADMINISTRATOR);
      user.pendingIssues([UserPendingIssuesEnum.TEMPORARY_PASSWORD]);
    });

    const { status, body } = await api
      .put('/users/change-password')
      .send({
        oldPassword: 'abc123',
        newPassword: '123abc',
      })
      .then(TestUtil.parseResponseUtil);

    expect(status).toEqual(422);
    expect(body).toStrictEqual({
      code: 'WEAK_PASSWORD',
      msg: 'Senha fraca',
      details:
        'Senha deve possuir pelo menos 10 caracteres, letra maiúscula e caractere especial',
    });
  });
});
