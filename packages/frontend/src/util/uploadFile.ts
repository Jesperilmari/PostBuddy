import { NavigateFunction } from "react-router-dom"
import api from "./api"
import { uploadMessage } from "../interfaces"

export default async function uploadFile(
  file: File,
  navigate: NavigateFunction
) {
  const token = localStorage.getItem("user-token")
  if (!token) {
    navigate("/login")
  }
  if (file.name === "") {
    return {
      message: "No file found",
      id: "",
      err: true,
    } as uploadMessage
  }
  try {
    const res = await api.post<{ fileId: string }>("/api/v1/upload", file, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": file.type,
      },
    })
    return {
      message: "upload successful",
      id: res.data.fileId,
      err: false,
    } as uploadMessage
  } catch (err) {
    console.log(err)
    return {
      message: err,
      id: "",
      err: true,
    } as uploadMessage
  }
}
