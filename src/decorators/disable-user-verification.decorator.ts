import { SetMetadata } from '@nestjs/common';

export const DISABLE_USER_PENDING_ISSUES_VERIFICATION_KEY =
  'disable_user_pending_issues_verification';
export const DisableUserPendingIssuesVerification = () =>
  SetMetadata(DISABLE_USER_PENDING_ISSUES_VERIFICATION_KEY, true);

export const DISABLE_USER_DEVICE_VERIFICATION_KEY =
  'disable_user_device_verification';
export const DisableUserDeviceVerification = () =>
  SetMetadata(DISABLE_USER_DEVICE_VERIFICATION_KEY, true);
