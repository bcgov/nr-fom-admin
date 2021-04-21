import { Configuration, Middleware, RequestArgs } from './typescript-rxjs';
export class RxjsAuthInterceptor extends Configuration {
  private static config: RxjsAuthInterceptor;

  private constructor() {
    const middleware: Middleware[] = [
      {
        pre(request: RequestArgs): RequestArgs {
          const token = undefined;

          return {
            ...request,
            headers: {
              ...request.headers,
              Authorization: `Bearer ${token}`,
            },
          };
        },
      },
    ];

    super({ middleware });
  }

  public static get Instance() {
    return RxjsAuthInterceptor.config || (RxjsAuthInterceptor.config = new this());
  }
}
