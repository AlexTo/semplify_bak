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
import ScrollReset from './components/ScrollReset'
import {useSettings} from "./hooks";
import {createTheme} from "./theme";
import Routes from './routes';
import keycloak from "./services/keycloak";
import {KeycloakProvider} from '@react-keycloak/web'
import {ApolloProvider} from '@apollo/react-hooks';
import apolloClient from "./services/apollo";
import axios from "./services/axios";

const history = createBrowserHistory();
const jss = create({plugins: [...jssPreset().plugins, rtl()]});


const keycloakProviderInitConfig = {
  onLoad: 'login-required',
}


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
      initConfig={keycloakProviderInitConfig}
      onTokens={tokens => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.token}`;
      }}>
      <ThemeProvider theme={createTheme(settings)}>
        <StylesProvider jss={jss}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <SnackbarProvider maxSnack={1}>
              <Router history={history}>
                <ApolloProvider client={apolloClient}>
                  <ScrollReset/>
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
