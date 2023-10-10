import ffmpeg from "ffmpeg"
import crypto from "crypto"
import fs from "fs"
import { Readable } from "stream"
import { tmpdir } from "os"
import { error, info } from "../../util/logger"

const Ffmpeg = ffmpeg
const fps = 30
const format = "mp4"
const videoSize = "640x480"

export default async function compressVideo(
  input: Readable,
): Promise<fs.ReadStream | null> {
  try {
    const fileName = await createTmpFile(input)
    // Compress video
    const video = await new Ffmpeg(fileName)
    const path = await video
      .setVideoFrameRate(fps)
      .setVideoFormat(format)
      .setVideoSize(videoSize, true, true)
      .save(tmpFilePath())

    // Create read stream from compressed video
    const stream = fs.createReadStream(path)

    // Delete temp file when stream is closed
    stream.on("close", () => {
      try {
        info("Deleting temp file")
        fs.unlinkSync(path)
      } catch (err) {
        error("Error deleting temp file: ", err)
      }
    })
    return stream
  } catch (err) {
    error("Error compressing video: ", err)
    return null
  }
}

async function createTmpFile(input: Readable): Promise<string> {
  const tmpFile = tmpFilePath()
  const writeStream = fs.createWriteStream(tmpFile)
  input.pipe(writeStream)
  return new Promise((resolve, reject) => {
    input.on("end", () => {
      info("Finished writing to temp file")
      info("Path: ", tmpFile)
      resolve(tmpFile)
    })
    input.on("error", (err) => reject(err))
  })
}

function tmpFilePath() {
  const file = `${crypto.randomUUID()}`
  return `${tmpdir()}/${file}`
}
