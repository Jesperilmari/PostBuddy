import { NavigateFunction } from "react-router-dom"
import api from "./api"
import { UploadMessage } from "../interfaces"

export default async function uploadFile(
  navigate: NavigateFunction,
  file?: File
) {
  const token = localStorage.getItem("user-token")
  if (!token) {
    navigate("/login")
  }
  if (!file) {
    return {
      message: "No file found",
      err: new Error("No file found"),
    } as UploadMessage
  }
  try {
    const res = await api.post<{ fileId: string }>("/api/v1/upload", file, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": file.type,
      },
    })
    return {
      message: "Upload successful",
      id: res.data.fileId,
    } as UploadMessage
  } catch (err) {
    console.log(err)
    return {
      message: (err as Error).message,
      err,
    } as UploadMessage
  }
}
