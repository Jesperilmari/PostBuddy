import { gql } from "@apollo/client";

export const ALL_USERS = gql`
  query Query {
    users {
      username
      name
      id
      email
    }
  }
`;

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
`;

export const USERBYUSERNAME = gql`
  query UserByUsername($username: String!) {
    userByUsername(username: $username) {
      email
      id
      name
      username
    }
  }
`;

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
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      name
      email
    }
  }
`;

export const CONNECTIONS = gql`
  query Connections {
    connections {
      name
      id
    }
  }
`;

export const CREATEPOST = gql`
  mutation CreatePost($post: PostInput!) {
    createPost(post: $post) {
      description
      dispatchTime
      id
      media
      platforms
      postOwner
      title
    }
  }
`;
