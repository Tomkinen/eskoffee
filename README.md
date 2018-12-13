## Eskoffee

- Caffeine decision support -

Eskoffee tells you if you still have caffeine in your system to keep you coding (or some other activity that requires caffeine).

To you to keep you safe: Dangerous levels cannot be reached and you will receive a warning and recommendation to drink water.

Eskoffee measures your personal caffeine level and combined office caffeine level. Caffeine half-life in your body is approximately 5 hours.

Caffeine level measurement is based on that rough estimate. Caffeine level per drink is based on average caffeine amounts researched from the depths of the Internet.

You can add/remove users and get graphs that display caffeine level for the last 12 hours or last 30 days.

Current caffeine level is displayed as well as highest peak levels. "Office" caffeine levels are a combination of all users.

## Why does this repository exist?

Just for fun and self-learning. And to optimize caffeine levels.

## Installation

You must have Node.js installed. Install required modules. By default the UI can be accessed from port 8080. You can define port with process.env._SERVER_PORT. I have tested UI to work fine with latest versions of Firefox, Chrome, Safari, Edge and Opera.

## API Reference

### GET /api/state

Get office caffeine state in one json.

### POST /api/user/add

Add new user. Checks that username is not already taken and that the name is not too long.

Parameters:

userName=User name for the new user.

### POST /api/user/remove

Removes user and all related data.

Parameters:

userName=User name for the to-be-removed user.

### POST /api/drink/add

Adds more caffeine to user.

Parameters:

userName=User name for the user who gets more caffeine. If username does not appear in state, then no caffeine is added. Cannot add caffeine to masterUser ("office" -user).

caffeine=Amount of caffeine in mg. Parameter must be number between 0 and maxLimit. Users current caffeine level should not go over maxLimit.

## Application Structure

#### app.js

The main application file that starts Eskoffee. All of the backend is in this one file.

#### frontend/

Folder that contains all frontend files. Just two files, index.html and frontend.js. All custom javascript is in frontend.js. Frontend gets Vue.js and Axios from cdnjs.cloudflare.com. Vue.js is javascript frontend framework. Axios is promise based http client for the browser. Furtive is small css micro-framework that handles css styling in Eskoffee UI.

## License

MIT license. This source code is completely free. Have fun!