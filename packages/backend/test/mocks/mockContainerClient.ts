import { ContainerClient, BlockBlobClient } from "@azure/storage-blob"
import { anyString, anything, instance, mock, when } from "ts-mockito"
import { Readable, PassThrough } from "stream"
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
    // Simulate stream going somewhere
    const passThrough = new PassThrough()
    stream.pipe(passThrough)
  },
)

export default containerClientInstance
