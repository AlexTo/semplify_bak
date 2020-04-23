import {setContext} from "apollo-link-context";
import keycloak from "./keycloak";
import {ApolloLink} from "apollo-link";
import {ApolloClient} from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {createHttpLink} from "apollo-link-http";

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = keycloak.token;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const link = ApolloLink.from([authLink, httpLink]);


const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

export default apolloClient;
