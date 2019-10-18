const { Keystone, PasswordAuthStrategy } = require("@keystone-alpha/keystone");
const { GraphQLApp } = require("@keystone-alpha/app-graphql");
const { AdminUIApp } = require("@keystone-alpha/app-admin-ui");
const { StaticApp } = require("@keystone-alpha/app-static");

const {
  MongooseAdapter: Adapter
} = require("@keystone-alpha/adapter-mongoose");

const keystone = new Keystone({
  name: "Role based access demo",
  adapter: new Adapter(),
  onConnect: async keystone => {
    const users = await keystone.lists.User.adapter.findAll();
    if (!users.length) {
      await keystone.createItems({
        User: [
          {
            name: "Admin",
            email: "admin@keystonejs.com",
            isAdmin: true,
            password: "12345678"
          }
        ]
      });
    }
  }
});

const { User } = require("./user");
const { Role } = require("./role");
const { Post } = require("./post");

keystone.createList("User", User);
keystone.createList("Role", Role);
keystone.createList("Post", Post);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User"
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: "/", src: "public" }),
    // Setup the optional Admin UI
    new AdminUIApp({ enableDefaultRoute: true, authStrategy })
  ]
};
