'use strict';

// DOC: https://loopback.io/doc/en/lb3/Creating-a-default-admin-user.html

const {log} = console;
const async = require('async');

module.exports = function(app) {
  const models = app.models;

  logModels(models);

  // data sources
  const mysqlDs = app.dataSources.mysqlDs; // 'name' of your mysql connector, you can find it in datasources.json

  // https://github.com/strongloop/loopback/issues/2073
  mysqlDs.automigrate(['RoleMapping', 'AccessToken'], function(err) {
    if (err) throw err;
  });

  // create all models
  async.parallel({
    coffeeShops: async.apply(createCoffeeShops),
    products: async.apply(createProducts),
    reviewers: async.apply(createReviewers),
    users: async.apply(createUsers),
  }, function(err, results) {
    if (err) throw err;

    log(`Created ${results.coffeeShops.length} coffeeShops`);
    log(`Created ${results.products.length} products`);
    log(`Created ${results.reviewers.length} reviewers`);

    log(`Created ${results.users.length} users:`, results.users.map((user) => user.email).join(', '));

    createReviews(results.reviewers, results.coffeeShops, function(err, reviews) {
      if (err) throw err;

      log(`Created ${reviews.length} reviews`);
    });

    // Create products, assign product owners (orders)
    createOrders(results.users, results.products, function(err, orders) {
      if (err) throw err;

      log(`Created ${orders.length} orders:`, orders.map((order) => order.code).join(', '));
    });

    // Create the admin role
    createRoleAdmin(results.users, function(err, role) {
      if (err) throw err;

      log('Created 1 role:', role.name);

      const RoleMapping = models.RoleMapping;

      // Make Juanan an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: results.users[0].id,
      }, function(err, principal) {
        if (err) throw err;

        log('Created 1 principal:', principal);

        log('> models created sucessfully');
      });
    });
  });

  function createOrders(users, products, cb) {
    mysqlDs.automigrate('Order', function(err) {
      if (err) return cb(err);

      const Order = models.Order;

      Order.create([{
        userId: users[0].id,
        productId: products[2].id,
        code: '123abc',
        purchaseDate: daysAgo(4),
      }, {
        userId: users[1].id,
        productId: products[1].id,
        code: '234bcd',
        purchaseDate: daysAgo(3),
      }, {
        userId: users[2].id,
        productId: products[0].id,
        code: '345cde',
        purchaseDate: daysAgo(2),
      }], cb);
    });
  }

  function createProducts(cb) {
    mysqlDs.automigrate('Product', function(err) {
      if (err) return cb(err);

      const Product = models.Product;

      Product.create([{
        name: 'Panda Painter Kit',
        reference: '0000',
      }, {
        name: 'Panda Robot Kit',
        reference: '0001',
      }, {
        name: 'Little Explorer Kit',
        reference: '0003',
      }, {
        name: 'Little Engineer Kit',
        reference: '0004',
      }], cb);
    });
  };

  function createRoleAdmin(users, cb) {
    mysqlDs.automigrate('Role', function(err) {
      if (err) return cb(err);

      const Role = models.Role;

      Role.create({
        name: 'admin',
        description: 'admin of the world',
      }, cb);
    });
  }

  function createUsers(cb) {
    mysqlDs.automigrate('User', function(err) {
      if (err) return cb(err);

      const User = models.User;

      User.create([{
        username: 'Juanan',
        email: 'shokmaster@gmail.com',
        password: '12345678',
      }, {
        username: 'Jane',
        email: 'jane@doe.com',
        password: '12345678',
      }, {
        username: 'Bob',
        email: 'bob@projects.com',
        password: '12345678',
      }], cb);
    });
  }

  // Creates the Reviewer data structure in MongoDB using auto-migration and adds data to it.
  function createReviewers(cb) {
    mysqlDs.automigrate('Reviewer', function(err) {
      if (err) return cb(err);

      var Reviewer = models.Reviewer;

      Reviewer.create([{
        email: 'foo@bar.com',
        password: 'foobar',
      }, {
        email: 'john@doe.com',
        password: 'johndoe',
      }, {
        email: 'jane@doe.com',
        password: 'janedoe',
      }], cb);
    });
  }

  // Creates a MySQL table for the CoffeeShop model and adds data to the table.
  function createCoffeeShops(cb) {
    mysqlDs.automigrate('CoffeeShop', function(err) {
      if (err) return cb(err);

      var CoffeeShop = models.CoffeeShop;

      CoffeeShop.create([{
        name: 'Bel Cafe',
        city: 'Vancouver',
      }, {
        name: 'Three Bees Coffee House',
        city: 'San Mateo',
      }, {
        name: 'Caffe Artigiano',
        city: 'Vancouver',
      }], cb);
    });
  }

  // Creates the Reviews data structure in MongoDB using auto-migration and adds data to it.
  function createReviews(reviewers, coffeeShops, cb) {
    mysqlDs.automigrate('Review', function(err) {
      if (err) return cb(err);

      var Review = models.Review;

      Review.create([{
        date: daysAgo(4),
        rating: 5,
        comments: 'A very good coffee shop.',
        publisherId: reviewers[0].id,
        coffeeShopId: coffeeShops[0].id,
      }, {
        date: daysAgo(3),
        rating: 5,
        comments: 'Quite pleasant.',
        publisherId: reviewers[1].id,
        coffeeShopId: coffeeShops[0].id,
      }, {
        date: daysAgo(2),
        rating: 4,
        comments: 'It was ok.',
        publisherId: reviewers[1].id,
        coffeeShopId: coffeeShops[1].id,
      }, {
        date: daysAgo(1),
        rating: 4,
        comments: 'I go here everyday.',
        publisherId: reviewers[2].id,
        coffeeShopId: coffeeShops[2].id,
      }], cb);
    });
  }
};

const logModels = (models) => {
  const modelsNames = Object.keys(models);

  log(`Found ${modelsNames.length} models:`);

  modelsNames.forEach((name) => log(`  - ${name}`));
};

const daysAgo = (days) => {
  const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

  return Date.now() - DAY_IN_MILLISECONDS * days;
};
