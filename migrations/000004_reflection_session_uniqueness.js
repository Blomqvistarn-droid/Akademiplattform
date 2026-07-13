/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "session_reflection",
    "session_reflection_org_session_unique",
    "UNIQUE (organization_id, scheduled_session_id)",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    "session_reflection",
    "session_reflection_org_session_unique",
    { ifExists: true },
  );
};
