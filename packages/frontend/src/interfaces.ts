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
