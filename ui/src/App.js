import React from 'react';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {create} from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import {SnackbarProvider} from 'notistack';
import {
  createStyles,
  jssPreset,
  makeStyles,
  StylesProvider,
  ThemeProvider
} from '@material-ui/core';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import SettingsNotification from 'src/components/SettingsNotification';
import ScrollReset from 'src/components/ScrollReset';
import {useSettings} from "./hooks";
import {createTheme} from 'src/theme';
import Routes from 'src/Routes';
import Keycloak from 'keycloak-js'
import {KeycloakProvider} from '@react-keycloak/web'
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';
import {ApolloLink} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {ApolloProvider} from '@apollo/react-hooks';

const history = createBrowserHistory();
const jss = create({plugins: [...jssPreset().plugins, rtl()]});


const keycloak = new Keycloak({
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
})

const keycloakProviderInitConfig = {
  onLoad: 'login-required',
}

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


const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      height: '100%',
      width: '100%'
    },
    body: {
      height: '100%',
      width: '100%'
    },
    '#root': {
      height: '100%',
      width: '100%'
    }
  }
}));

function App() {
  useStyles();

  const {settings} = useSettings();

  return (
    <KeycloakProvider
      keycloak={keycloak}
      initConfig={keycloakProviderInitConfig}>
      <ThemeProvider theme={createTheme(settings)}>
        <StylesProvider jss={jss}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <SnackbarProvider maxSnack={1}>
              <Router history={history}>
                <ApolloProvider client={client}>
                  <ScrollReset/>
                  <SettingsNotification/>
                  <Routes/>
                </ApolloProvider>
              </Router>
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </ThemeProvider>
    </KeycloakProvider>
  );
}

export default App;
