import ffmpeg from "ffmpeg"
import crypto from "crypto"
import fs from "fs"
import { Readable } from "stream"
import { tmpdir } from "os"
import { error, info } from "../../util/logger"

const Ffmpeg = ffmpeg
const fps = 30
const format = "mp4"
const videoSize = "1280x720"
const maxDuration = 135
const maxOutSize = 1024 * 1000 * 100

export default async function compressVideo(
  input: Readable,
): Promise<fs.ReadStream | null> {
  try {
    const fileName = await createTmpFile(input)
    // Compress video
    const video = await new Ffmpeg(fileName)
    const dur = video.metadata.duration

    const isTooLong = dur && dur.seconds > maxDuration
    if (isTooLong) {
      video.setVideoDuration(maxDuration)
    }

    info("Compressing video", fileName)
    const path = await video
      .setVideoFrameRate(fps)
      .setVideoFormat(format)
      .setVideoSize(videoSize, true, true)
      .save(tmpFilePath())

    info("Done compressing", fileName)
    // Create read stream from compressed video
    const stream = fs.createReadStream(path, {
      start: 0,
      end: maxOutSize,
    })

    // Delete temp file when stream is closed
    stream.on("close", () => {
      try {
        fs.unlinkSync(path)
        fs.unlinkSync(fileName)
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
      resolve(tmpFile)
    })
    input.on("error", (err) => reject(err))
  })
}

function tmpFilePath() {
  const file = `${crypto.randomUUID()}`
  return `${tmpdir()}/${file}`
}
