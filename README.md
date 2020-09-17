
### Getting started

if you don't have **node.js** you can get it [here](https://nodejs.org).

`cd path/to/your/directory`  
`npm i`  
`gulp s`

### Environments

**Options:**  
`--development` (default, not needed)  
`--production` (will use uglify etc.)  

**Example:**  
`gulp build --production`

### What it does

`gulp watch`, `gulp s` or `gulp serve` will build the project and then start a local server which refreshes the page if you change files. CSS will be injected without a refresh so you can keep your page state.

Using the `--production` flag will:
- uglify js, sass and css
- remove logging from js
- output to `/dist`

### Dependencies

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
- gulp-cli
- gulp-concat
- gulp-mode
- gulp-plumber
- gulp-pug
- gulp-sass
- gulp-uglify
- gulp-uglifycss
- npm-check-updates