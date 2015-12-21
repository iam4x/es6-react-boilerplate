/* eslint react/display-name: 0 */

import Iso from 'iso';
import React from 'react';
import debug from 'debug';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
import Router, { RoutingContext, match } from 'react-router';
import AltContainer from 'alt-container';

import intlLoader from 'utils/intl-loader';
import ErrorPage from 'pages/server-error';

const { BROWSER, NODE_ENV } = process.env;

const runRouter = (location, routes) => {
  debug('dev')(routes);
  return new Promise((resolve) =>
    match({ routes, location }, (...args) => resolve(args)));
};

const bootstrap = () =>
  new Promise((resolve) =>
    Iso.bootstrap((initialState, container) =>
      resolve({ initialState, container })));

/* eslint space-before-function-paren:0 */
// https://github.com/eslint/eslint/issues/4442
export default async function({ flux, history, location }) {
  if (BROWSER) {
    if (NODE_ENV === 'development') require('alt-utils/lib/chromeDebug')(flux);

    const { container, initialState } = await bootstrap();
    flux.bootstrap(initialState);

    // load the intl-polyfill if needed
    // load the correct data/{lang}.json into app
    const { locales: [ locale ] } = flux.getStore('locale').getState();
    const { messages } = await intlLoader(locale);
    flux.getActions('locale').switchLocale({ locale, messages });

    const routes = require('routes');

    const element = (
      <AltContainer flux={ flux }>
        <Router
          history={ history }
          routes={ routes(flux) } />
      </AltContainer>
    );

    // Render element in the same container as the SSR
    render(element, container);

    // Tell `alt-resolver` we have done the first render
    // next promises will be resolved
    flux.resolver.firstRender = false;
  } else {
    const routes = require('routes')(flux);
    const [ error, redirect, renderProps ] = await runRouter(location, routes);

    if (error || redirect) throw ({ error, redirect });

    const element = (
      <AltContainer flux={ flux }>
        <RoutingContext { ...renderProps } />
      </AltContainer>
    );

    let app;
    let fluxSnapshot;
    try {
      // Collect promises with a first render
      debug('dev')('first server render');
      renderToString(element);

      // Resolve them
      await flux.resolver.dispatchPendingActions();

      debug('dev')('second server render');

      fluxSnapshot = flux.takeSnapshot();
      app = renderToString(element);
    } catch (renderErr) {
      // Catch rendering error, render a 500 page
      debug('koa')('rendering error');
      debug('koa')(renderErr);

      fluxSnapshot = flux.takeSnapshot();
      app = renderToString(<ErrorPage />);
    }

    // Get status code, page title and page description for rendering
    const { titleBase, title, ...helmet } = flux.getStore('helmet').getState();

    return {
      ...helmet,
      body: Iso.render(app, fluxSnapshot),
      title: titleBase + title
    };
  }
}
