declare module 'express' {
  interface Request {
    // @ts-ignore
    cookies: {
      access_token?: string;
      sc?: boolean;
    };
  }

  interface Response {
    locals: {
      timeIni: number;
    };
  }
}

declare module 'cookie-parser' {
  namespace express {
    interface Request {
      cookies: {
        access_token?: string;
        fgp?: string;
        [p: string]: unknown;
      };
    }
  }
}

export type {};
