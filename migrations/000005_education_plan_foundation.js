/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    "education_plan",
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
      status: {
        type: "text",
        notNull: true,
      },
      active_block_id: {
        type: "uuid",
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
    "education_plan",
    "education_plan_team_fk",
    "FOREIGN KEY (team_id, organization_id) REFERENCES team(id, organization_id) ON DELETE RESTRICT",
  );

  pgm.addConstraint(
    "education_plan",
    "education_plan_status_check",
    "CHECK (status IN ('planned', 'active', 'completed', 'cancelled'))",
  );

  pgm.createTable(
    "education_plan_block",
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
      education_plan_id: {
        type: "uuid",
        notNull: true,
        references: "education_plan",
        onDelete: "CASCADE",
      },
      education_block_id: {
        type: "text",
        notNull: true,
      },
      session_template_id: {
        type: "text",
        notNull: true,
      },
      block_order: {
        type: "integer",
        notNull: true,
      },
      status: {
        type: "text",
        notNull: true,
      },
    },
    { ifNotExists: true },
  );

  pgm.addConstraint(
    "education_plan_block",
    "education_plan_block_status_check",
    "CHECK (status IN ('planned', 'active', 'completed', 'skipped'))",
  );

  pgm.addConstraint(
    "education_plan_block",
    "education_plan_block_order_check",
    "CHECK (block_order >= 1)",
  );

  pgm.createTable(
    "education_plan_progress_event",
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
      education_plan_id: {
        type: "uuid",
        notNull: true,
        references: "education_plan",
        onDelete: "CASCADE",
      },
      education_plan_block_id: {
        type: "uuid",
      },
      team_id: {
        type: "uuid",
        notNull: true,
      },
      event_type: {
        type: "text",
        notNull: true,
      },
      completed_session_count: {
        type: "integer",
        notNull: true,
      },
      scheduled_session_id: {
        type: "uuid",
      },
      recommendation_type: {
        type: "text",
      },
      decision_type: {
        type: "text",
      },
      rationale: {
        type: "text",
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
      },
    },
    { ifNotExists: true },
  );

  pgm.addConstraint(
    "education_plan_progress_event",
    "education_plan_progress_event_type_check",
    "CHECK (event_type IN ('sessionCompleted', 'reflectionRecorded', 'recommendationRecorded', 'coachDecisionRecorded'))",
  );

  pgm.addConstraint(
    "education_plan_progress_event",
    "education_plan_progress_event_completed_count_check",
    "CHECK (completed_session_count >= 0)",
  );

  pgm.addConstraint(
    "education_plan_progress_event",
    "education_plan_progress_event_team_fk",
    "FOREIGN KEY (team_id, organization_id) REFERENCES team(id, organization_id) ON DELETE RESTRICT",
  );

  pgm.createIndex("education_plan", ["organization_id", "team_id"]);
  pgm.createIndex("education_plan_block", ["organization_id", "education_plan_id", "block_order"]);
  pgm.createIndex("education_plan_progress_event", ["organization_id", "education_plan_id", "created_at"]);
};

exports.down = (pgm) => {
  pgm.dropTable("education_plan_progress_event", { ifExists: true });
  pgm.dropTable("education_plan_block", { ifExists: true });
  pgm.dropTable("education_plan", { ifExists: true });
};