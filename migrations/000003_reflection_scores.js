/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn(
    "session_reflection",
    {
      understanding_score: {
        type: "integer",
        notNull: false,
      },
      independence_score: {
        type: "integer",
        notNull: false,
      },
    },
    { ifNotExists: true },
  );

  pgm.addConstraint(
    "session_reflection",
    "session_reflection_understanding_score_check",
    "CHECK (understanding_score IS NULL OR understanding_score BETWEEN 1 AND 5)",
  );

  pgm.addConstraint(
    "session_reflection",
    "session_reflection_independence_score_check",
    "CHECK (independence_score IS NULL OR independence_score BETWEEN 1 AND 5)",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    "session_reflection",
    "session_reflection_independence_score_check",
    { ifExists: true },
  );

  pgm.dropConstraint(
    "session_reflection",
    "session_reflection_understanding_score_check",
    { ifExists: true },
  );

  pgm.dropColumns(
    "session_reflection",
    ["understanding_score", "independence_score"],
    { ifExists: true },
  );
};
