import { Transform, TransformCallback, TransformOptions } from "stream"

const FOUR_MB = 1024 * 1000 * 4

// Very big chungus
export default class BigChungus extends Transform {
  private buf: Buffer

  private readonly chunkSize

  constructor(chunkSize?: number, options?: TransformOptions) {
    super(options)
    this.buf = Buffer.alloc(0)
    this.chunkSize = chunkSize || FOUR_MB
  }

  _transform(chunk: any, _encoding: any, callback: TransformCallback): void {
    this.buf = Buffer.concat([this.buf, chunk])
    if (this.buf.length >= this.chunkSize) {
      this.push(this.buf)
      this.buf = Buffer.alloc(0)
    }
    callback()
  }

  _flush(callback: TransformCallback): void {
    if (this.buf.length > 0) {
      this.push(this.buf)
    }
    callback()
  }
}
