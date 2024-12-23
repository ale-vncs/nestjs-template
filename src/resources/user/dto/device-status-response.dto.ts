import { EnumResponse } from '@abstracts/enum.abstract';

export class DeviceStatusResponseDto {
  status: EnumResponse | null = null;

  static toDto(status?: EnumResponse) {
    const dto = new DeviceStatusResponseDto();

    if (status) {
      dto.status = status;
    }
    return dto;
  }
}
