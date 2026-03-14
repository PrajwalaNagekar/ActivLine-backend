import ChatRoom from "../../../models/chat/chatRoom.model.js";
import PaymentHistory from "../../../models/payment/paymentHistory.model.js";
import Customer from "../../../models/Customer/customer.model.js";
import Admin from "../../../models/auth/auth.model.js";
import FranchiseAdmin from "../../../models/Franchise/franchiseAdmin.model.js";

/* OPEN TICKETS */
export const countOpenTickets = () =>
  ChatRoom.countDocuments({ status: "OPEN" });

/* IN PROGRESS */
export const countInProgressTickets = () =>
  ChatRoom.countDocuments({
    status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
  });

/* TODAY RESOLVED */
export const countTodayResolvedTickets = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return ChatRoom.countDocuments({
    status: "RESOLVED",
    updatedAt: { $gte: start, $lte: end },
  });
};

/* DISTINCT CHAT CUSTOMERS */
export const countDistinctCustomers = async () => {
  const ids = await ChatRoom.distinct("customer", {
    customer: { $ne: null },
  });
  return ids.length;
};

/* RECENT TICKETS */
export const getRecentTickets = (limit = 5) =>
  ChatRoom.find()
    .populate("customer", "fullName email")
    .sort({ updatedAt: -1 })
    .limit(limit);

/* RECENT PAYMENTS */
export const getRecentPayments = (limit = 5) =>
  PaymentHistory.find(
    {},
    {
      groupId: 1,
      accountId: 1,
      profileId: 1,
      planName: 1,
      planAmount: 1,
      currency: 1,
      status: 1,
      razorpayOrderId: 1,
      razorpayPaymentId: 1,
      paidAt: 1,
      planDetails: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();


export const countRoomsAssignedToStaff = () =>
  ChatRoom.countDocuments({
    customer: { $ne: null },       // created by customer
    assignedStaff: { $ne: null },  // assigned by admin
  });

const buildRevenueMatch = ({
  groupId,
  accountId,
  groupIds = [],
  profileIds = [],
  startDate,
}) => {
  const match = { status: "SUCCESS" };

  if (groupId) {
    match.groupId = String(groupId);
    if (accountId) {
      match.accountId = String(accountId);
    }
  } else if (accountId) {
    const profileCandidates = Array.isArray(profileIds)
      ? profileIds.map((id) => String(id)).filter(Boolean)
      : [];
    const groupCandidates = Array.isArray(groupIds)
      ? groupIds.map((id) => String(id)).filter(Boolean)
      : [];

    const groupOrProfileCandidates = Array.from(
      new Set([...profileCandidates, ...groupCandidates])
    );

    if (groupOrProfileCandidates.length > 0) {
      match.$or = [
        { accountId: String(accountId) },
        { groupId: { $in: groupOrProfileCandidates } },
        ...(profileCandidates.length > 0
          ? [{ profileId: { $in: profileCandidates } }]
          : []),
      ];
    } else {
      match.accountId = String(accountId);
    }
  }

  if (startDate) {
    match.createdAt = { $gte: startDate };
  }

  return match;
};

export const getMonthlyRevenueByGroup = ({
  groupId,
  accountId,
  groupIds = [],
  profileIds = [],
  startDate,
}) => {
  const match = buildRevenueMatch({
    groupId,
    accountId,
    groupIds,
    profileIds,
    startDate,
  });

  return PaymentHistory.aggregate([
    { $match: match },
    {
      $addFields: {
        month: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
      },
    },
    {
      $group: {
        _id: "$month",
        totalAmount: { $sum: "$planAmount" },
        paymentCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const countCustomersCreated = ({ accountId, startDate, endDate }) => {
  const query = {};

  if (accountId) {
    query.accountId = String(accountId);
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  return Customer.countDocuments(query);
};

export const getCustomersCreatedByMonth = ({ accountId, startDate }) => {
  const match = {};

  if (accountId) {
    match.accountId = String(accountId);
  }

  if (startDate) {
    match.createdAt = { $gte: startDate };
  }

  return Customer.aggregate([
    { $match: match },
    {
      $addFields: {
        month: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
      },
    },
    {
      $group: {
        _id: "$month",
        totalCustomers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getResolvedTicketsByStaff = ({ accountId, startDate, endDate }) => {
  const match = { status: "RESOLVED" };

  if (startDate || endDate) {
    match.updatedAt = {};
    if (startDate) match.updatedAt.$gte = startDate;
    if (endDate) match.updatedAt.$lte = endDate;
  }

  const pipeline = [{ $match: match }];

  if (accountId) {
    const customersCollection = Customer.collection.name;
    pipeline.push(
      {
        $lookup: {
          from: customersCollection,
          localField: "customer",
          foreignField: "_id",
          as: "customerDoc",
        },
      },
      { $unwind: "$customerDoc" },
      { $match: { "customerDoc.accountId": String(accountId) } }
    );
  }

  pipeline.push(
    {
      $group: {
        _id: "$assignedStaff",
        resolvedCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: Admin.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "staffDoc",
      },
    },
    {
      $unwind: {
        path: "$staffDoc",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        staffName: { $ifNull: ["$staffDoc.name", null] },
        staffEmail: { $ifNull: ["$staffDoc.email", null] },
      },
    },
    {
      $project: {
        staffDoc: 0,
      },
    },
    { $sort: { resolvedCount: -1 } }
  );

  return ChatRoom.aggregate(pipeline);
};

export const countResolvedTickets = async ({ accountId, startDate, endDate }) => {
  const match = { status: "RESOLVED" };

  if (startDate || endDate) {
    match.updatedAt = {};
    if (startDate) match.updatedAt.$gte = startDate;
    if (endDate) match.updatedAt.$lte = endDate;
  }

  if (!accountId) {
    return ChatRoom.countDocuments(match);
  }

  const customersCollection = Customer.collection.name;
  const rows = await ChatRoom.aggregate([
    { $match: match },
    {
      $lookup: {
        from: customersCollection,
        localField: "customer",
        foreignField: "_id",
        as: "customerDoc",
      },
    },
    { $unwind: "$customerDoc" },
    { $match: { "customerDoc.accountId": String(accountId) } },
    { $count: "count" },
  ]);

  return rows[0]?.count || 0;
};

export const countOpenTicketCustomers = async ({ accountId }) => {
  const match = { status: "OPEN" };

  if (!accountId) {
    const ids = await ChatRoom.distinct("customer", {
      status: "OPEN",
      customer: { $ne: null },
    });
    return ids.length;
  }

  const customersCollection = Customer.collection.name;
  const rows = await ChatRoom.aggregate([
    { $match: match },
    {
      $lookup: {
        from: customersCollection,
        localField: "customer",
        foreignField: "_id",
        as: "customerDoc",
      },
    },
    { $unwind: "$customerDoc" },
    { $match: { "customerDoc.accountId": String(accountId) } },
    { $group: { _id: "$customer" } },
    { $count: "count" },
  ]);

  return rows[0]?.count || 0;
};

export const getResolvedTicketsList = async ({
  accountId,
  startDate,
  endDate,
  limit = 25,
} = {}) => {
  const match = { status: "RESOLVED" };

  if (startDate || endDate) {
    match.updatedAt = {};
    if (startDate) match.updatedAt.$gte = startDate;
    if (endDate) match.updatedAt.$lte = endDate;
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const pipeline = [{ $match: match }];

  if (accountId) {
    const customersCollection = Customer.collection.name;
    pipeline.push(
      {
        $lookup: {
          from: customersCollection,
          localField: "customer",
          foreignField: "_id",
          as: "customerDoc",
        },
      },
      { $unwind: "$customerDoc" },
      { $match: { "customerDoc.accountId": String(accountId) } }
    );
  }

  pipeline.push(
    {
      $lookup: {
        from: Admin.collection.name,
        localField: "assignedStaff",
        foreignField: "_id",
        as: "assignedStaffDoc",
      },
    },
    {
      $unwind: {
        path: "$assignedStaffDoc",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: FranchiseAdmin.collection.name,
        localField: "assignedFranchiseAdmin",
        foreignField: "_id",
        as: "assignedFranchiseAdminDoc",
      },
    },
    {
      $unwind: {
        path: "$assignedFranchiseAdminDoc",
        preserveNullAndEmptyArrays: true,
      },
    }
  );

  pipeline.push(
    { $sort: { updatedAt: -1 } },
    { $limit: safeLimit },
    {
      $project: {
        ticketId: "$_id",
        ticketName: {
          $cond: [
            { $and: [{ $ne: ["$lastMessage", null] }, { $ne: ["$lastMessage", ""] }] },
            "$lastMessage",
            "Customer Support Chat",
          ],
        },
        resolvedAt: "$updatedAt",
        status: 1,
        assignedStaff: 1,
        assignedFranchiseAdmin: 1,
        assignedStaffName: { $ifNull: ["$assignedStaffDoc.name", null] },
        assignedStaffEmail: { $ifNull: ["$assignedStaffDoc.email", null] },
        assignedFranchiseAdminName: {
          $ifNull: ["$assignedFranchiseAdminDoc.name", null],
        },
        assignedFranchiseAdminEmail: {
          $ifNull: ["$assignedFranchiseAdminDoc.email", null],
        },
        customer: {
          _id: "$customerDoc._id",
          name: {
            $ifNull: [
              "$customerDoc.fullName",
              {
                $ifNull: [
                  "$customerDoc.userName",
                  {
                    $trim: {
                      input: {
                        $concat: [
                          { $ifNull: ["$customerDoc.firstName", ""] },
                          " ",
                          { $ifNull: ["$customerDoc.lastName", ""] },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          },
          phoneNumber: { $ifNull: ["$customerDoc.phoneNumber", "$customerDoc.mobile"] },
          email: { $ifNull: ["$customerDoc.emailId", "$customerDoc.email"] },
        },
      },
    }
  );

  return ChatRoom.aggregate(pipeline);
};

export const getMonthlyRevenueAll = ({ startDate }) => {
  const match = { status: "SUCCESS" };

  if (startDate) {
    match.createdAt = { $gte: startDate };
  }

  return PaymentHistory.aggregate([
    { $match: match },
    {
      $addFields: {
        month: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
      },
    },
    {
      $group: {
        _id: "$month",
        totalAmount: { $sum: "$planAmount" },
        paymentCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getTotalCollectedRevenue = ({
  groupId,
  accountId,
  groupIds = [],
  profileIds = [],
  startDate,
}) => {
  const match = buildRevenueMatch({
    groupId,
    accountId,
    groupIds,
    profileIds,
    startDate,
  });

  return PaymentHistory.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$planAmount" },
        paymentCount: { $sum: 1 },
      },
    },
  ]);
};

export const getCustomersCreatedByMonthAll = ({ startDate }) => {
  const match = {};

  if (startDate) {
    match.createdAt = { $gte: startDate };
  }

  return Customer.aggregate([
    { $match: match },
    {
      $addFields: {
        month: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
      },
    },
    {
      $group: {
        _id: "$month",
        totalCustomers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getResolvedTicketsByMonthAll = ({ startDate, endDate }) => {
  const match = { status: "RESOLVED" };

  if (startDate || endDate) {
    match.updatedAt = {};
    if (startDate) match.updatedAt.$gte = startDate;
    if (endDate) match.updatedAt.$lte = endDate;
  }

  return ChatRoom.aggregate([
    { $match: match },
    {
      $addFields: {
        month: {
          $dateToString: { format: "%Y-%m", date: "$updatedAt" },
        },
      },
    },
    {
      $group: {
        _id: "$month",
        resolvedCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};
