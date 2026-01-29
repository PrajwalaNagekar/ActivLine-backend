import * as Repo from "../../repositories/ActivityLog/activityLog.repository.js";

export const createActivityLog = async ({
  req,
  user,
  action,
  module,
  description,
  targetId = null,
  metadata = {},
}) => {
  // Prioritize explicitly passed user object (for login), fallback to req.user
  const actor = user || req?.user;
  if (!actor) {
    console.warn("Activity log skipped: No actor (user) found.");
    return;
  }

  await Repo.createLog({
    actorId: actor.id || actor._id, // Handle both user.id and user._id
    actorRole: actor.role,
    actorName: actor.name,
    action,
    module,
    description,
    targetId,
    metadata,
    ipAddress: req?.ip,
    userAgent: req?.headers["user-agent"],
  });
};
