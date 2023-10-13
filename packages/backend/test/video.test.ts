import fs from "fs"
import compressVideo from "../src/api/controllers/video"
import { Readable } from "stream"
import dotenv from "dotenv"

dotenv.config()

const skip = true //process.env.LOCAL_TEST

describe(
  "VideoCompressor",
  skip
    ? () => {
        let video: Readable

        beforeAll(async () => {})

        beforeEach(async () => {
          try {
            fs.copyFileSync("./test/files/otto2.mp4", "./test/files/copy.mp4")
            video = fs.createReadStream("./test/files/otto2.mp4")
          } catch (err) {
            console.log(err)
          }
        })

        afterEach(async () => {
          try {
            fs.unlinkSync("./test/files/copy.mp4")
          } catch (err) {
            console.log(err)
          }
        })

        it("should make a copy of video", async function () {
          expect(video).not.toBeNull()
          expect(video).toBeInstanceOf(Readable)
        })

        it("should compress a video", async () => {
          const compressed: fs.ReadStream | null = await compressVideo(video)
          expect(compressed).not.toBeNull()
          expect(compressed).toBeInstanceOf(fs.ReadStream)
        })
      }
    : () => {
        it("should skip", async () => {
          expect(!true).toBe(false)
        })
      },
)
