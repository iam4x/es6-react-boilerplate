'use strict';

import fs from 'fs';
import path from 'path';
import debug from 'debug';

import Router from 'react-router';

// Paths are relative to `app` directory
import routes from 'routes';
import altResolver from 'utils/alt-resolver';
import promisify from 'utils/promisify';

export default function *() {
  const isCashed = this.isCashed ? this.isCashed() : false;
  if (!isCashed) {
    const router = Router.create({
      routes: routes,
      location: this.request.url,
      onAbort(redirect) {
        // TODO: Try to render the good page with re-creating a Router,
        // and with modifying req with `redirect.to`
        this.status = 303;
        this.redirect(redirect.to);
      },
      onError(err) {
        debug('koa')('Routing Error');
        debug('koa')(err);
      }
    });

    // Get request locale for rendering
    const locale = this.acceptsLanguages(require('./config/init').locales);

    const handler = yield promisify(router.run);
    const content = yield altResolver.render(handler, locale);

    // Reload './webpack-stats.json' on dev
    // cache it on production
    let assets;
    if (process.env.NODE_ENV === 'development') {
      assets = fs.readFileSync(path.resolve(__dirname, './webpack-stats.json'));
      assets = JSON.parse(assets);
    }
    else {
      assets = require('./webpack-stats.json');
    }

    yield this.render('main', {content, assets});
  }
}
