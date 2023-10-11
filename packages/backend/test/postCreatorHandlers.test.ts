// @ts-nocheck
import { anything, instance, mock, when } from "ts-mockito"
import { createTwitterPostImpl } from "../src/api/handlers/createTwitterPost"
import { User } from "../src/api/interfaces/User"
import { uploadClient, postClient } from "./mocks/twitterMocks"
import connectAndClearDb from "./util/connectAndClearDb"
import PostTestUtils from "./util/postFunctions"
import UserTestUtils from "./util/userFunctions"
import { BlockBlobClient, ContainerClient } from "@azure/storage-blob"

jest.mock("@azure/storage-blob", () => {
  const originalModule = jest.requireActual("@azure/storage-blob")
  const m: ContainerClient = mock(originalModule.ContainerClient)
  const blockBlobThing: BlockBlobClient = mock(originalModule.BlockBlobClient)
  when(blockBlobThing.exists()).thenResolve(true)
  when(blockBlobThing.downloadToBuffer()).thenResolve(Buffer.from("hi"))
  when(blockBlobThing.deleteIfExists()).thenResolve({})
  when(m.getBlockBlobClient(anything())).thenReturn(instance(blockBlobThing))
  return {
    __esModule: true,
    ...originalModule,
    ContainerClient: function ContainerClient(_auth: string) {
      return instance(m)
    },
  }
})

describe("Post creation stuff", () => {
  let user: User

  beforeAll(async () => {
    await connectAndClearDb()
    user = await UserTestUtils.createUser()
  })

  it("should create a twitter post", async () => {
    const post = await PostTestUtils.createPost(user)
    const res = await createTwitterPostImpl(post, uploadClient, postClient)
    expect(res.isOk).toBe(true)
  })

  it("should give a correct error when upload fails", async () => {
    process.env.FAIL_UPLOAD = "true"
    const post = await PostTestUtils.createPost(
      user,
      "fail",
      "fail",
      ["twitter"],
      new Date(),
      "fail",
    )
    const res = await createTwitterPostImpl(post, uploadClient, postClient)
    expect(res.isErr).toBe(true)
    expect(res.isErr && res.error).toBe("Failed to upload media")
    process.env.FAIL_UPLOAD = undefined
  })

  it("should give a correct error when post fails", async () => {
    const post = await PostTestUtils.createPost(
      user,
      "fail",
      "fail",
      ["twitter"],
      new Date(),
      "fail",
    )
    const res = await createTwitterPostImpl(post, uploadClient, postClient)
    expect(res.isErr).toBe(true)
    expect(res.isErr && res.error).toBe("Error creating tweet")
  })
})