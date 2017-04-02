// @flow
import React, { Component } from 'react';
import { Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import store, { browserHistory } from './configureStore';
import Container from './MainContainer';
import allRoutes from './routes';

const routes = (<Route path="/" component={Container}>
  {allRoutes}
</Route>);

const history = syncHistoryWithStore(browserHistory, store);

export class Application extends Component {
  render() {
    return (<Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>);
  }
}

const DnDApp = DragDropContext(HTML5Backend)(Application);

export class App extends Component {
  render() {
    return (
      <DnDApp />
    );
  }
}

