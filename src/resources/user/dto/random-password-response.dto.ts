export class RandomPasswordResponseDto {
  randomPassword: string | null = null;
  expireIn: string | null = null;

  static toDto(password: string | null, expireIn: string | null = null) {
    const dto = new RandomPasswordResponseDto();
    dto.randomPassword = password;
    dto.expireIn = expireIn;
    return dto;
  }
}
