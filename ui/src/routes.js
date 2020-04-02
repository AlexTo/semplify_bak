import React, {lazy} from 'react';
import {Redirect} from 'react-router-dom';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/overview"/>
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('src/views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('src/views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('src/views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404"/>
      }
    ]
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/overview',
        exact: true,
        component: lazy(() => import('src/views/Overview'))
      },
    ]
  }
];
