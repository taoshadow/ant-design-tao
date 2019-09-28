import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from 'F:/java/ant-design-tao/src/pages/.umi-production/LocaleWrapper.jsx';
import { routerRedux } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/login',
    component: require('../../layout/LoginLayout').default,
    routes: [
      {
        path: '/login',
        component: require('../propro/login').default,
        exact: true,
      },
    ],
  },
  {
    path: '/',
    component: require('../../layout/BasicLayout').default,
    routes: [
      {
        path: '/',
        component: require('../propro/dashboard/console').default,
        exact: true,
      },
      {
        path: '/console',
        component: require('../propro/dashboard/console').default,
        exact: true,
      },
      {
        path: '/home',
        component: require('../propro/dashboard/home').default,
        exact: true,
      },
      {
        path: '/login',
        component: require('../propro/login').default,
        exact: true,
      },
      {
        path: '/user/setting',
        component: require('../propro/user/setting').default,
        exact: true,
      },
      {
        path: '/error/login',
        component: require('../propro/error/login').default,
        exact: true,
      },
      {
        path: '/public_standard_library/list',
        component: require('../propro/public_standard_library/list').default,
        exact: true,
      },
      {
        path: '/public_standard_library/detail/*',
        component: require('../propro/public_standard_library/detail').default,
        exact: true,
      },
      {
        path: '/standard_library/detail/*',
        component: require('../propro/standard_library/detail').default,
        exact: true,
      },
      {
        path: '/irt_standard_library/update/*',
        component: require('../propro/irt_standard_library/update').default,
        exact: true,
      },
      {
        path: '/public_irt_standard_library/list',
        component: require('../propro/public_irt_standard_library/list')
          .default,
        exact: true,
      },
      {
        path: '/public_irt_standard_library/detail/*',
        component: require('../propro/public_irt_standard_library/detail')
          .default,
        exact: true,
      },
      {
        path: '/public_irt_standard_library/update/*',
        component: require('../propro/public_irt_standard_library/update')
          .default,
        exact: true,
      },
      {
        path: '/public_standard_library/update/*',
        component: require('../propro/public_standard_library/update').default,
        exact: true,
      },
      {
        path: '/standard_library/update/*',
        component: require('../propro/standard_library/update').default,
        exact: true,
      },
      {
        path: '/standard_library_create',
        component: require('../propro/library/standard_library_create').default,
        exact: true,
      },
      {
        path: '/peptide/list/*',
        component: require('../propro/peptide/list').default,
        exact: true,
      },
      {
        path: '/peptide/list_ref/*/ref/*',
        component: require('../propro/peptide/list').default,
        exact: true,
      },
      {
        path: '/peptide/detail/*/*',
        component: require('../propro/peptide/detail').default,
        exact: true,
      },
      {
        path: '/protein/list/*',
        component: require('../propro/protein/list').default,
        exact: true,
      },
      {
        path: '/protein/detail/*/*',
        component: require('../propro/protein/detail').default,
        exact: true,
      },
      {
        path: '/irt_standard_library/list',
        component: require('../propro/irt_standard_library/list').default,
        exact: true,
      },
      {
        path: '/irt_standard_library/detail/*',
        component: require('../propro/irt_standard_library/detail').default,
        exact: true,
      },
      {
        path: '/standard_library/list',
        component: require('../propro/standard_library/list').default,
        exact: true,
      },
      {
        path: '/task/list',
        component: require('../propro/task/list').default,
        exact: true,
      },
      {
        path: '/analysis/list',
        component: require('../propro/analysis/list').default,
        exact: true,
      },
      {
        path: '/analysis/detail/*',
        component: require('../propro/analysis/detail').default,
        exact: true,
      },
      {
        path: '/analysis/xic/*',
        component: require('../propro/analysis/xic').default,
        exact: true,
      },
      {
        path: '/analysis/score/*',
        component: require('../propro/analysis/score').default,
        exact: true,
      },
      {
        path: '/test',
        component: require('../propro/test').default,
        exact: true,
      },
      {
        path: '/test1',
        component: require('../propro/test1').default,
        exact: true,
      },
      {
        path: '/puzzlecards',
        component: require('../propro/puzzlecards').default,
        exact: true,
      },
    ],
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen = () => {};

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
