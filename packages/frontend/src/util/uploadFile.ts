import api from "./api";

export default async function uploadFile(file: File) {
  const token = localStorage.getItem("user-token");
  if (!token) {
    return "";
  }
  try {
    const res = await api.post<{ fileId: string }>("/api/v1/upload", file, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": file.type,
      },
    });
    return res.data.fileId;
  } catch (err) {
    console.log(err);
    return "";
  }
}
