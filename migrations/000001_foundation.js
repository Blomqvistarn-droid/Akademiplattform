/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createExtension("pgcrypto", { ifNotExists: true });

  pgm.createTable(
    { schema: "public", name: "organization" },
    {
      id: {
        type: "uuid",
        primaryKey: true,
      },
      name: {
        type: "text",
        notNull: true,
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
      },
      updated_at: {
        type: "timestamptz",
        notNull: true,
      },
    },
    {
      ifNotExists: true,
    },
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ schema: "public", name: "organization" }, { ifExists: true });
};
