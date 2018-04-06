'use strict';

// DOC: https://loopback.io/doc/en/lb3/Creating-a-default-admin-user.html

module.exports = function(app) {
  const models = app.models;
  const modelsNames = Object.keys(models);

  console.log(`Found ${modelsNames.length} models:`);
  modelsNames.forEach((name) => console.log(`  - ${name}`));

  const User = models.User;
  const Role = models.Role;
  const RoleMapping = models.RoleMapping;

  User.create([
    {username: 'Juanan', email: 'shokmaster@gmail.com', password: '12345678'},
    {username: 'Jane', email: 'jane@doe.com', password: '12345678'},
    {username: 'Bob', email: 'bob@projects.com', password: '12345678'},
  ], function(err, users) {
    if (err) throw err;

    console.log('Created users:', users);

    // Create projects, assign project owners and project team members

    // Create the admin role
    Role.create({name: 'admin'}, function(err, role) {
      if (err) throw err;

      console.log('Created role:', role);

      // Make Juanan an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id,
      }, function(err, principal) {
        if (err) throw err;

        console.log('Created principal:', principal);
      });
    });
  });
};
