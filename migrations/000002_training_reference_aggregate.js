/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    "team",
    {
      id: {
        type: "uuid",
        primaryKey: true,
      },
      organization_id: {
        type: "uuid",
        notNull: true,
        references: "organization",
        onDelete: "RESTRICT",
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
    { ifNotExists: true },
  );

  pgm.addConstraint(
    "team",
    "team_id_organization_id_unique",
    "UNIQUE (id, organization_id)",
  );

  pgm.addConstraint(
    "team",
    "team_organization_name_unique",
    "UNIQUE (organization_id, name)",
  );

  pgm.createTable(
    "scheduled_session",
    {
      id: {
        type: "uuid",
        primaryKey: true,
      },
      organization_id: {
        type: "uuid",
        notNull: true,
        references: "organization",
        onDelete: "RESTRICT",
      },
      team_id: {
        type: "uuid",
        notNull: true,
      },
      session_template_id: {
        type: "text",
        notNull: true,
      },
      scheduled_at: {
        type: "timestamptz",
        notNull: true,
      },
      status: {
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
    { ifNotExists: true },
  );

  pgm.addConstraint(
    "scheduled_session",
    "scheduled_session_id_organization_id_unique",
    "UNIQUE (id, organization_id)",
  );

  pgm.addConstraint(
    "scheduled_session",
    "scheduled_session_team_fk",
    "FOREIGN KEY (team_id, organization_id) REFERENCES team(id, organization_id) ON DELETE RESTRICT",
  );

  pgm.addConstraint(
    "scheduled_session",
    "scheduled_session_status_check",
    "CHECK (status IN ('planned', 'completed', 'cancelled'))",
  );

  pgm.createTable(
    "session_reflection",
    {
      id: {
        type: "uuid",
        primaryKey: true,
      },
      organization_id: {
        type: "uuid",
        notNull: true,
        references: "organization",
        onDelete: "RESTRICT",
      },
      scheduled_session_id: {
        type: "uuid",
        notNull: true,
      },
      author_id: {
        type: "uuid",
        notNull: true,
      },
      notes: {
        type: "text",
        notNull: true,
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
      },
    },
    { ifNotExists: true },
  );

  pgm.addConstraint(
    "session_reflection",
    "session_reflection_scheduled_session_fk",
    "FOREIGN KEY (scheduled_session_id, organization_id) REFERENCES scheduled_session(id, organization_id) ON DELETE RESTRICT",
  );

  pgm.createTable(
    "team_progress",
    {
      id: {
        type: "uuid",
        primaryKey: true,
      },
      organization_id: {
        type: "uuid",
        notNull: true,
        references: "organization",
        onDelete: "RESTRICT",
      },
      team_id: {
        type: "uuid",
        notNull: true,
      },
      education_block_id: {
        type: "text",
        notNull: true,
      },
      completed_session_count: {
        type: "integer",
        notNull: true,
      },
      updated_at: {
        type: "timestamptz",
        notNull: true,
      },
    },
    { ifNotExists: true },
  );

  pgm.addConstraint(
    "team_progress",
    "team_progress_team_fk",
    "FOREIGN KEY (team_id, organization_id) REFERENCES team(id, organization_id) ON DELETE RESTRICT",
  );

  pgm.addConstraint(
    "team_progress",
    "team_progress_completed_session_count_check",
    "CHECK (completed_session_count >= 0)",
  );

  pgm.addConstraint(
    "team_progress",
    "team_progress_team_block_unique",
    "UNIQUE (organization_id, team_id, education_block_id)",
  );

  pgm.createIndex("scheduled_session", ["organization_id", "scheduled_at"]);
  pgm.createIndex("session_reflection", ["organization_id", "scheduled_session_id"]);
  pgm.createIndex("team_progress", ["organization_id", "team_id"]);
};

exports.down = (pgm) => {
  pgm.dropTable("team_progress", { ifExists: true });
  pgm.dropTable("session_reflection", { ifExists: true });
  pgm.dropTable("scheduled_session", { ifExists: true });
  pgm.dropTable("team", { ifExists: true });
};
