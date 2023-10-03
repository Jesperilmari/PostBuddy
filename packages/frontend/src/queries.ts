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
