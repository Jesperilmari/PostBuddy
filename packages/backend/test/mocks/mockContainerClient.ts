import { ContainerClient, BlockBlobClient } from "@azure/storage-blob"
import { anyString, anything, instance, mock, when } from "ts-mockito"
import { Readable } from "stream"
// import fs from "fs"

const containerClientMock = mock(ContainerClient)

const containerClientInstance = instance(containerClientMock)

const blockBlobClientMock = mock(BlockBlobClient)

const blockBlobClientInstance = instance(blockBlobClientMock)

when(containerClientMock.getBlockBlobClient(anyString())).thenReturn(
  blockBlobClientInstance,
)

when(blockBlobClientMock.uploadStream(anything())).thenCall(
  (stream: Readable) => {
    expect(stream).toBeDefined()
    // const out = fs.createWriteStream("./test/files/uploaded.png")
    // stream.pipe(out)
  },
)

export default containerClientInstance
