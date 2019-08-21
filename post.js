const { Text } = require("@keystone-alpha/fields");
const { requiresRoles } = require("./plugin-access-control");

const Post = {
  fields: {
    name: { type: Text }
  },
  plugins: [requiresRoles({ ref: "Role" })]
};

module.exports = { Post };
