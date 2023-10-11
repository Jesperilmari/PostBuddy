import { Transform, TransformCallback, TransformOptions } from "stream"
import { error } from "./logger"

const FOUR_MB = 1024 * 1000 * 4

// Very big chungus
/**
 * Used for uploading files in about `chunkSize` chunks.
 */
export default class BigChungus extends Transform {
  private buf: Buffer

  private readonly chunkSize

  constructor(chunkSize?: number, options?: TransformOptions) {
    super(options)
    this.buf = Buffer.alloc(0)
    this.chunkSize = chunkSize || FOUR_MB
  }

  _transform(chunk: Buffer, _encoding: any, callback: TransformCallback): void {
    const bufIsFull = this.buf.length + chunk.length >= this.chunkSize
    if (bufIsFull) {
      this.consumeBuf()
    }
    this.appendChunk(chunk)
    callback()
  }

  _flush(callback: TransformCallback): void {
    if (this.buf.length > 0) {
      this.push(this.buf)
    }
    callback()
  }

  private appendChunk(chunk: any) {
    this.buf = Buffer.concat([this.buf, chunk])
  }

  private consumeBuf() {
    const ok = this.push(this.buf)
    if (!ok) {
      error("Error while consuming buffer")
    }
    this.buf = Buffer.alloc(0)
  }
}
