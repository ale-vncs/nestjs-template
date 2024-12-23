import { AsyncLocalStorage } from 'node:async_hooks';
import { AppContextType, ContextKeys } from '@typings/context.typings';
import { Undefined } from '@typings/generic.typing';
import { merge } from 'lodash';
import { v4 as uuidV4 } from 'uuid';

export class ContextUtil {
  private static instance: ContextUtil;
  private als: AsyncLocalStorage<Partial<ContextKeys>>;

  private constructor() {
    this.als = new AsyncLocalStorage();
    ContextUtil.instance = this;
  }

  static getInstance() {
    if (!ContextUtil.instance) ContextUtil.instance = new ContextUtil();
    return ContextUtil.instance;
  }

  changeContext<T>(namespace: AppContextType, cb: () => Promise<T>) {
    return this.als.run({}, () => {
      this.setContext('logger', {
        context: namespace,
        transactionId: uuidV4(),
      });
      return cb();
    });
  }

  setContext<K extends keyof ContextKeys>(
    key: K,
    data: Partial<ContextKeys[K]>,
  ) {
    const oldData = this.als.getStore() ?? {};
    const newData = merge(oldData, { [key]: data });
    this.als.enterWith(newData);
  }

  getContext<K extends keyof ContextKeys>(key: K): Undefined<ContextKeys[K]> {
    // @ts-ignore
    return this.als.getStore()?.[key];
  }
}
