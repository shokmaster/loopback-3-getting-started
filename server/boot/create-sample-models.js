'use strict';

// DOC: https://loopback.io/doc/en/lb3/Creating-a-default-admin-user.html

var async = require('async');

module.exports = function(app) {
  const models = app.models;

  logModels(models);

  // data sources
  var mysqlDs = app.dataSources.mysqlDs; // 'name' of your mysql connector, you can find it in datasources.json

  mysqlDs.automigrate(['RoleMapping', 'AccessToken'], function(err) {
    if (err) throw err;
  });

  // create all models
  async.parallel({
    reviewers: async.apply(createReviewers),
    coffeeShops: async.apply(createCoffeeShops),
    users: async.apply(createUsers),
  }, function(err, results) {
    if (err) throw err;

    createReviews(results.reviewers, results.coffeeShops, function(err) {
      if (err) throw err;

      console.log('> models created sucessfully');
    });

    // [WIP] Create products, assign product owners
    /*createProducts(results.users, function(err, products) {
      if (err) throw err;

      console.log('Created products:', products);
      console.log('Pendiente crear UserProducts');

      mysqlDs.automigrate('UserProduct', function(err) {
        if (err) throw err;

        const UserProduct = models.UserProduct;

        UserProduct.create({
          userId: 0,
          productId: products[0].id,
          code: '123abc',
        });
        //results.users[0].userProducts.create({
        //  productId: products[0].id,
        //  code: '123abc',
        //});
      });
    });*/

    // Create the admin role
    createRoleAdmin(results.users, function(err, role) {
      if (err) throw err;

      console.log('Created role:', role);

      const RoleMapping = models.RoleMapping;

      // Make Juanan an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: results.users[0].id,
      }, function(err, principal) {
        if (err) throw err;

        console.log('Created principal:', principal);
      });
    });
  });

  function createProducts(users, cb) {
    mysqlDs.automigrate('Product', function(err) {
      if (err) return cb(err);

      const Product = models.Product;

      Product.create([{
        name: 'Panda Starter Kit',
        reference: '0000',
      }, {
        name: 'Papagallo Starter Kit',
        reference: '0001',
      }, {
        name: 'Urraca Starter Kit',
        reference: '0002',
      }], cb);
    });
  };

  function createRoleAdmin(users, cb) {
    console.log('Created users:', users);

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
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

      Review.create([{
        date: Date.now() - (DAY_IN_MILLISECONDS * 4),
        rating: 5,
        comments: 'A very good coffee shop.',
        publisherId: reviewers[0].id,
        coffeeShopId: coffeeShops[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 3),
        rating: 5,
        comments: 'Quite pleasant.',
        publisherId: reviewers[1].id,
        coffeeShopId: coffeeShops[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 2),
        rating: 4,
        comments: 'It was ok.',
        publisherId: reviewers[1].id,
        coffeeShopId: coffeeShops[1].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS),
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

  console.log(`Found ${modelsNames.length} models:`);
  modelsNames.forEach((name) => console.log(`  - ${name}`));
};
