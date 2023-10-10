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

export const login = `mutation Mutation($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    token
    user {
      username
      name
      id
      email
    }
  }
}`

export const updateUser = `mutation UpdateUser($user: UserUpdate!) {
  updateUser(user: $user) {
    email
    name
    username
  }
}`

export const updatePassword = `mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
  updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    email
    id
    name
    username
  }
}`

export const me = `query Me {
  me {
    email
    id
    name
    username
  }
}`

export const connections = `query Connections {
  connections {
    id
    name
  }
}`

export const createPost = `
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
`

export const deletePost = `
mutation Mutation($deletePostId: [ID!]!) {
  deletePost(id: $deletePostId) {
    message
  }
}`

export const editPost = `
mutation Mutation($editPostId: ID!, $post: EditPost!) {
  editPost(id: $editPostId, post: $post) {
    title
    id
    dispatchTime
    description
  }
}`

export const postsByFilter = `query Query($platformName: String, $postTitle: String) {
  postsByFilter(platformName: $platformName, postTitle: $postTitle) {
    description
    dispatchTime
    id
    media
    postOwner
    title
    platforms
  }
}`
