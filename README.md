# Customers, Products and Orders

Tutorial [http://loopback.io/doc/en/lb3/Introducing-the-Coffee-Shop-Reviews-app.html](http://loopback.io/doc/en/lb3/Introducing-the-Coffee-Shop-Reviews-app.html) with some fixes

## Installation

* `git clone https://github.com/shokmaster/loopback-3-getting-started.git` this repository
* `git checkout products` this branch
* `cd loopback-3-getting-started && npm install` Install LoopBack app dependencies
* `cd client/coffee && npm install` Install Ember app dependencies

## Building client app:

* `cd client/coffee && ember build`

## Running loopback app:

* `node .`
* Visit the app at [http://localhost:3000](http://localhost:3000).

## CHANGELOG:

- Replace User model with Customer model
- Create models for Product and Order
- New settings for EditorConfig and ESLint
- Show user avatar
- Fixed admin role
- Improve migrations script
