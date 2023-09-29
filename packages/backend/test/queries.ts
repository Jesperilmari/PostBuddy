export const allUsers = `query Query {
  users {
    username
    name
    id
    email
  }
}`

export const oneUser = `query User($userId: ID!) {
  user(id: $userId) {
    email
    id
    name
    username
  }
}`

export const register = `mutation Mutation($user: UserInput!) {
  register(user: $user) {
    token
    user {
      username
    }
  }
}`
