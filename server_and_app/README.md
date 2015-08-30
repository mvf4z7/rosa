react-starter
=====================

The minimal dev environment to enable live-editing React components.

### Usage

```
npm install
npm start
open http://localhost:3000
```
This will build the project and output a bundle into the build directory. The index file references this bundle

### Dev environment

```
    npm run start-hot
    open http://localhost:3001
```
NOTE: It is assumed that the dependencies in package.json have already been installed via npm install.

This will start the webpack-dev-server, with hot reloading. Open App.jsx in the src directory, add something to the render function and save.
The changes will appear in the browser without requiring a refresh. This allows changes to be made to the application without changing state!

If you define API routes or any other server routes outside of your React application, you will also want to run the Express server in conjunction with
the webpack-dev-server in order to make these endpoints available. Run the following commands in a second terminal window.

```
    npm install -g nodemon
    npm run start-dev
    open http://localhost:3000
```

NOTE: I have setup the npm start-dev script to use nodemon in order to auto-reload the server whenever server-side files are changed. If you would
      like to launch the server with regular NodeJS, then open package.json and change "nodemon" to "node" in the definition of the npm start-dev script.

If you are running this setup, you no longer need to navigate to the webpack-dev-server directly through port 3001. All requests attempting to access
build files have been setup to be proxied through the webpack-dev-server. Therefore, just navigate to localhost:3000, as normal.


### Linting

This starter-kit includes React-friendly ESLint configuration. Modify the rules in the .eslintrc file located on the root.

```
npm run lint
```
