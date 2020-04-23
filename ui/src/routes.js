/* eslint-disable react/no-array-index-key */
import React, {
  lazy,
  Suspense,
  Fragment
} from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import LoadingScreen from 'src/components/LoadingScreen';
import {AuthGuard} from "./components/AuthGuard";

const routesConfig = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/pages/Error404View'))
  },
  {
    path: '*',
    layout: DashboardLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: '/',
        component: lazy(() => import('src/views/home/HomeView'))
      },
      {
        exact: true,
        path: '/visual-graph',
        component: lazy(() => import('src/views/explore/GraphView'))
      },
      {
        exact: true,
        path: '/sparql',
        component: lazy(() => import('src/views/explore/SparqlView'))
      },
      {
        exact: true,
        path: '/web-crawler',
        component: lazy(() => import('src/views/integration/WebCrawlerView'))
      },
      {
        exact: true,
        path: '/rml',
        component: lazy(() => import('src/views/integration/RMLView'))
      },
      {
        exact: true,
        path: '/projects',
        component: lazy(() => import('src/views/management/ProjectsView'))
      },
      {
        component: () => <Redirect to="/404"/>
      }
    ]
  }
];

const renderRoutes = (routes) => (routes ? (
  <Suspense fallback={<LoadingScreen/>}>
    <Switch>
      {routes.map((route, i) => {
        const Layout = route.layout || Fragment;
        const Component = route.component;
        const Guard = route.guard || Fragment;
        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
) : null);

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
