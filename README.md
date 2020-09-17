
## Getting started

if you don't have **node.js** you can get it [here](https://nodejs.org).

Execute:<br />
`npm install --global gulp-cli`<br />
`npm i`<br />
`gulp watch` / `gulp s` / `gulp serve`

## Environments

options: <br />
`--development` (default, not needed) <br />
`--production` (will use uglify etc.) <br />  

example: <br />
`gulp build --production`

## What it does

`gulp watch`, `gulp s` or `gulp serve` will build the project and then start a local server which refreshes the page if you change files. CSS will be injected without a refresh so you can keep your page state.

Using the `--production` flag will:
- uglify js, sass and css
- remove logging from js
- output to `/dist`

## Deployment

Pushing to master will deploy via gitlab-cli.

## Packages

- @babel/core
- @babel/preset-env
- babel-core
- babel-polyfill
- babel-preset-env
- browser-sync
- del
- gulp
- gulp-autoprefixer
- gulp-babel
- gulp-clean-css
- gulp-concat
- gulp-mode
- gulp-plumber
- gulp-pug
- gulp-sass
- gulp-shell
- gulp-uglify

## Dependencies

- gulp-cli
- gulp-uglifycss