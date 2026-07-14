import assert from "node:assert/strict";
import test from "node:test";
import { getCoachExperienceData } from "../../src/application/services/coachExperienceService";

test("coach experience service returns the next session, active plan and recommendation", async () => {
  const data = await getCoachExperienceData();

  assert.ok(data.nextSession);
  assert.equal(data.nextSession?.sessionDetail.session.id, "session-winger-1");
  assert.ok(data.activePlan);
  assert.ok(data.activeBlock);
  assert.equal(data.activeBlock?.title, "Hitta yttern genom 2 mot 1");
  assert.ok(data.latestRecommendation);
  assert.equal(data.latestRecommendation?.isFallback, false);
});