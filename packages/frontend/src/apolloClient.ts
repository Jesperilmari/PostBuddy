import { ApolloClient, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { InMemoryCache } from '@apollo/client/cache'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : null,
    },
  }
})

// TODO: Add production URL
const prod_url = ''

const uri =
  process.env.NODE_ENV === 'production' ? `${prod_url}/grapql` : 'http://localhost:3000/graphql'

const apolloClient = new ApolloClient({
  link: authLink.concat(createHttpLink({ uri })),
  cache: new InMemoryCache(),
})

export default apolloClient
