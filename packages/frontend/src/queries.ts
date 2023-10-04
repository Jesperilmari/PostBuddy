import { gql } from '@apollo/client'

export const ALL_USERS = gql`
  query Query {
    users {
      username
      name
      id
      email
    }
  }
`

export const LOGIN = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      token
      user {
        username
        name
        email
        id
      }
    }
  }
`

export const REGISTER = gql`
  mutation Register($user: UserInput!) {
    register(user: $user) {
      token
      user {
        username
        name
        id
        email
      }
    }
  }
`
