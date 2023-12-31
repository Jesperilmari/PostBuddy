import axios from "axios"

const devUrl = "http://localhost:3000"
const prodUrl = "https://postbuddy-api.azurewebsites.net"
const baseURL = import.meta.env.MODE !== "development" ? prodUrl : devUrl

export const api = axios.create({
  baseURL,
})

export async function connectPlatform(platform: string) {
  const token = localStorage.getItem("user-token")
  if (!token) {
    return null
  }

  const res = await api.get<{ url: string }>(`api/v1/oauth/${platform}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data.url
}

export default api
