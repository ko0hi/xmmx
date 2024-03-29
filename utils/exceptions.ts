export class XmmxError extends Error {
  constructor(e?: string) {
    super(e)
    this.name = new.target.name

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    // https://future-architect.github.io/typescript-guide/exception.html
    // 下記の行はTypeScriptの出力ターゲットがES2015より古い場合(ES3, ES5)のみ必要
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class UnsupportedExchangeError extends XmmxError {}

export class MarketNotFoundError extends XmmxError {}

export class UnsupportedOrderTypeError extends XmmxError {}

export class NotImplementedError extends XmmxError {}
