const { Text } = require("@keystone-alpha/fields");

const Role = {
  fields: {
    name: { type: Text }
  },
  labelField: "name"
};

module.exports = { Role };
