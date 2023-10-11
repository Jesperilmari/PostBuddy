export interface User {
  id: string
  username: string
  name: string
  email: string
}

export interface LoginResponse {
  login: {
    user: User
    token: string
  }
}

export interface RegisterResponse {
  register: {
    user: User
    token: string
  }
}
export interface Connection {
  name: string
  id: number
}

export type uploadMessage = {
  message: string
  id: string
  err: boolean
}

export interface PostResponse {
  id: string
  title: string
  description: string
  platforms: string[]
  media: string
  mediaType?: string
  dispatchTime: Date
  postOwner: string
}

export interface AlertInput {
  active: boolean
  alert: {
    severity: "success" | "info" | "warning" | "error"
    message?: string | "alert"
    title?: string | null
    onClose?: boolean
    timeout?: number
    variant?: "outlined" | "filled" | "standard"
  }
}

export interface IStack<T> {
  push(item: T): void
  pop(): T | undefined
  peek(): T | undefined
  size(): number
}

export type Conn = {
  id: string
  name: string
}

export interface PostInput {
  title: string
  description: string
  platforms: string[]
  media?: string
  mediaType?: string
  dispatchTime: Date
}

export interface Post {
  id: string
  title: string
  description: string
  platforms: string[]
  media: string
  mediatype?: string
  dispatchTime: string
  postOwner: string
}
