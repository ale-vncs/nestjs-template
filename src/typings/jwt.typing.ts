export interface JwtPayloadUserInfo {
  sub: string;
  sc: boolean; //stayConnected
  tt: 'wb'; // Tipo de Token: wb(web)
  iat: number;
  nbf: number;
  jti: string;
}

export interface JwtPayload extends JwtPayloadUserInfo {
  exp: number;
}
