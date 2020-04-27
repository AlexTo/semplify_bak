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
  const token = keycloak.token;
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
