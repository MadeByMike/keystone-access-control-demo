const { or } = require("./combineAccessRules");
const { Checkbox, Relationship } = require("@keystone-alpha/fields");

const fieldAccessRules = {
  userIsAdmin: ({ authentication: { item: user } }) => {
    if (!user) {
      return false;
    }
    return user.isAdmin;
  }
};

const listAccessRules = {
  ...fieldAccessRules,
  userOwnsItem: ({ authentication: { item: user } }) => {
    if (!user) {
      return false;
    }
    return { id: user.id };
  },
  userHasRole: role => ({ authentication: { item: user } }) => {
    if (!user) {
      return false;
    }
    return { [`${role}_some`]: { id_in: user.roles } };
  }
};

const hasRoles = ({ ref }) => config => {
  return {
    ...config,
    fields: {
      ...config.fields,
      roles: {
        type: Relationship,
        many: true,
        ref,
        access: fieldAccessRules.userIsAdmin
      }
    }
  };
};

const requiresRoles = ({ ref }) => config => {
  return {
    ...config,
    fields: {
      ...config.fields,
      isAdmin: { type: Checkbox, access: fieldAccessRules.userIsAdmin },
      readAccess: {
        type: Relationship,
        many: true,
        ref,
        access: fieldAccessRules.userIsAdmin
      },
      createAccess: {
        type: Relationship,
        many: true,
        ref,
        access: fieldAccessRules.userIsAdmin
      },
      updateAccess: {
        type: Relationship,
        many: true,
        ref,
        access: fieldAccessRules.userIsAdmin
      },
      deleteAccess: {
        type: Relationship,
        many: true,
        ref,
        access: fieldAccessRules.userIsAdmin
      }
    },
    access: {
      read: or(
        listAccessRules.userHasRole("readAccess"),
        listAccessRules.userIsAdmin,
        listAccessRules.userOwnsItem
      ),
      create: or(
        listAccessRules.userHasRole("createAccess"),
        listAccessRules.userIsAdmin,
        listAccessRules.userOwnsItem
      ),
      update: or(
        listAccessRules.userHasRole("updateAccess"),
        listAccessRules.userIsAdmin,
        listAccessRules.userOwnsItem
      ),
      delete: or(
        listAccessRules.userHasRole("deleteAccess"),
        listAccessRules.userIsAdmin,
        listAccessRules.userOwnsItem
      )
    }
  };
};

module.exports = { hasRoles, requiresRoles, listAccessRules };
