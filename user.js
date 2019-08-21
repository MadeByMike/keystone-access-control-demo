const { Text, Password } = require("@keystone-alpha/fields");
const { requiresRoles, hasRoles } = require("./plugin-access-control");

const User = {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true
    },
    password: {
      type: Password
    }
  },
  plugins: [hasRoles({ ref: "Role" }), requiresRoles({ ref: "Role" })]
};

module.exports = { User };
