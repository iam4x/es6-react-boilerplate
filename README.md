[![Build Status](https://semaphoreci.com/api/v1/projects/78ca7991-8a6f-4523-88e7-4e05a5579254/397136/shields_badge.svg)](https://semaphoreci.com/iam4x/react-frontend)

# ES6 Isomorphic Flux/ReactJS Boilerplate

> A wonderfull boilerplate for **Flux/ReactJS** [isomorphic](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/) applications, running on **Koa**.

**Demo:** http://isomorphic.iam4x.fr

## Libraries Included

* [react](https://facebook.github.io/react/)
* [react-router](https://github.com/rackt/react-router)
* [react-hot-loader](https://github.com/gaearon/react-hot-loader)
* [alt](https://github.com/goatslacker/alt)
* [iso](https://github.com/goatslacker/iso)
* [koa](http://koajs.com/)
* [webpack](http://webpack.github.io/)
* [babeljs](https://babeljs.io/)

## Concepts

**Koa** will be our server for the server side rendering, we use **alt** for our Flux architecture and **react-router** for routing in our app.

With **iso** as helper we can populate **alt** flux stores before the first rendering and have a complete async isomorphic React application.

Run this boilerplate, you will see the server is fetching some fake users and will populate the `UserStore` with this data. **Koa** will render the first markup, serve the JavaScript and then it will entirely run on the client.

## Alt-resolver

Alt-resolver is the magic thing about the boilerplate, it will be our tool for resolving promises (data-fetching) before server side rendering.

Wrap data-fetching requests from actions into promises and send them to `altResolver` like:

```
fetch() {
  const promise = (resolve) => {
    request
      .get('http://example.com/api/users')
      .end((response) => {
        // fire new action to send data to store
        this.actions.fetchSuccess(response.body);
        return resolve()
      });
  };
  // Send the `promise` to altResolver
  altResolver.resolve(promise);
}
```

Call the fetch action from component in the `componentWillMount` method:

```
componentWillMount() {
  UsersActions.fetch()
}
```

On browser side, the rendering won't be stopped and will resolve the promise instantly.

On server side, `altResolver.render` will fire a first render to collect all the promises needed for a complete rendering. It will then resolve them, and try to re-render the application for a complete markup.

Open `app/actions/users.js`, `app/utils/alt-resolver.js`, `app/stores/users.js` for more information about data-fetching.

## Installation / How-to

I recommend to use [io.js](https://iojs.org/) to take advantages of `ES6` without `--harmony` flag on `NodeJS`.

It's super easy to do with [nvm](https://github.com/creationix/nvm):

* `$ nvm install iojs`
* `$ nvm use iojs`
* `$ nvm alias default iojs` (to make `node` default to `iojs`)

After that, you will just need to clone the repo and install dependancies:

* `$ git clone -o upstream https://github.com/iam4x/isomorphic-flux-boilerplate.git app`
* `$ cd app && npm install`

(Don't forget to add your remote origin: `$ git remote origin git@github.com:xxx/xxx.git`)

### Run the project in development:

* `$ npm run dev`

Open your browser to `http://localhost:8080` and you will see the magic happens! Try to disable JavaScript in your browser, you will still be able to navigate between pages of the application. Enjoy the power of isomorphic applications!

### Run tests

* `$ npm test` will run the tests once
* `$ ./node_modules/.bin/karma start` will watch for changes and run the tests on change

### Build project:

Just run `$ npm run build`, it will produce these tasks:

* Run tests from `test/spec/**/*.jsx`
* Concat & minify styles to `/dist/app-[hash].css`
* Concat & minify scripts to `/dist/js/app-[hash].js`

### Update the boilerplate

You can fetch the upstream branch and merge it into your master:

* `$ git checkout master`
* `$ git fetch upstream`
* `$ git merge upstream/master`
* `$ npm install`

### Learn more

* [Official ReactJS website](http://facebook.github.io/react/)
* [Official ReactJS wiki](https://github.com/facebook/react/wiki)
* [Official Flux website](http://facebook.github.io/flux/)
* [ReactJS Conf 2015 links](https://gist.github.com/yannickcr/148110d3ca658ad96c2b)
* [Learn ES6](https://babeljs.io/docs/learn-es6/)
* [ES6 Features](https://github.com/lukehoban/es6features#readme)

### Common errors

```
Error: `libsass` bindings not found. Try reinstalling `node-sass`
```

* Be sure you are running with iojs > 1.6.0 (check node version `node -v`)
* Delete node_modules `mv node_modules /tmp` (`mv` is much faster than `rm -rf`)
* Clear npm cache `npm cache clear`
* Re-install modules `npm install`

This is an issue with `node-sass` it is reported almost everywhere on the internet.
