/* eslint-disable no-use-before-define */
import React, {useEffect} from 'react';
import {useLocation, matchPath} from 'react-router';
import {Link as RouterLink} from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  makeStyles
} from '@material-ui/core';
import {
  Hexagon as HexagonIcon,
  Globe as GlobeIcon,
  Upload as UploadIcon,
  Code as CodeIcon,
  Trello as TrelloIcon,
  Terminal as TerminalIcon,
  Grid as GridIcon,
} from 'react-feather';
import Logo from 'src/components/Logo';
import NavItem from './NavItem';
import {useKeycloak} from "@react-keycloak/web";

const navConfig = [
  {
    subheader: 'Explore',
    items: [
      {
        title: 'Graphs',
        icon: GridIcon,
        href: '/graphs'
      },
      {
        title: 'SPARQL',
        icon: TerminalIcon,
        href: '/sparql'
      },
      {
        title: 'Visual Graph',
        icon: HexagonIcon,
        href: '/visual-graph'
      }
    ]
  },
  {
    subheader: 'Data Integration',
    items: [
      {
        title: 'Import',
        icon: UploadIcon,
        href: '/import'
      },
      {
        title: 'Web Crawler',
        icon: GlobeIcon,
        href: '/web-crawler'
      },
      {
        title: 'RDF Mapping Language',
        icon: CodeIcon,
        href: '/rml'
      }
    ]
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Projects',
        icon: TrelloIcon,
        href: '/projects'
      }
    ]
  },
];

function renderNavItems({items, ...rest}) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({acc, item, ...rest}),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
                             acc,
                             pathname,
                             item,
                             depth = 0
                           }) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        key={key}
        info={item.info}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        key={key}
        info={item.info}
        title={item.title}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

function NavBar({openMobile, onMobileClose,}) {
  const classes = useStyles();
  const location = useLocation();
  const {keycloak} = useKeycloak();
  const {idTokenParsed: token} = keycloak;

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <PerfectScrollbar options={{suppressScrollX: true}}>
        <Hidden lgUp>
          <Box
            p={2}
            display="flex"
            justifyContent="center"
          >
            <RouterLink to="/">
              <Logo/>
            </RouterLink>
          </Box>
        </Hidden>
        <Box p={2}>
          <Box
            display="flex"
            justifyContent="center"
          >
            <RouterLink to="/">
              {token.picture && <Avatar
                alt="User"
                className={classes.avatar}
                src={token.picture}
              />}
              {!token.picture && <Avatar
                className={classes.avatar}>
                {`${token.given_name.substring(0, 1)} ${token.family_name.substring(0, 1)}`}
              </Avatar>}
            </RouterLink>
          </Box>
          <Box
            mt={2}
            textAlign="center">
            {token.name && <Link
              component={RouterLink}
              to="/"
              variant="h5"
              color="textPrimary"
              underline="none">
              {token.name}
            </Link>}
          </Box>
        </Box>
        <Divider/>
        <Box p={2}>
          {navConfig.map((config) => (
            <List
              key={config.subheader}
              subheader={(
                <ListSubheader
                  disableGutters
                  disableSticky
                >
                  {config.subheader}
                </ListSubheader>
              )}
            >
              {renderNavItems({items: config.items, pathname: location.pathname})}
            </List>
          ))}
        </Box>
        <Divider/>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{paper: classes.mobileDrawer}}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{paper: classes.desktopDrawer}}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
}

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
