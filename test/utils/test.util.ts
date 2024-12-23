import * as request from 'supertest';

export class TestUtil {
  static jwtDecode<T = unknown>(token: string) {
    return JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    ) as T;
  }

  static parseResponseUtil<T = unknown>(response: request.Response) {
    return {
      status: response.status,
      body: response.body as T,
      headers: response.headers,
    };
  }

  static parseCookieUtil(cookieString: string[]) {
    return cookieString.map((c) => {
      return c
        .split(';')
        .map((c) => c.trim())
        .reduce(
          (prev, c) => {
            const [key, value] = c.split('=');
            return Object.assign(prev, {
              [key]: value,
            });
          },
          {} as Record<string, string | undefined>,
        );
    });
  }
}
