import mongoose from "mongoose";

import Lead from "../../models/Lead.js";
import { LEAD_STATUSES } from "./constants.js";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// GET /api/leads/stats
export const getLeadStats = async (req, res) => {
  try {
    const companyId = req.user._id;

    const total = await Lead.countDocuments({ companyId });

    const statusCounts = await Lead.aggregate([
      { $match: { companyId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {};
    LEAD_STATUSES.forEach((status) => {
      const found = statusCounts.find((item) => item._id === status);
      stats[status] = found ? found.count : 0;
    });

    const converted = stats.won || 0;
    const conversionRate = total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0;

    const sources = await Lead.aggregate([
      { $match: { companyId } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: { total, ...stats, converted, conversionRate },
      sources,
    });
  } catch (error) {
    console.error("GET LEAD STATS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lead statistics" });
  }
};

// GET /api/leads/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const companyId = req.user._id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const [newLeads, wonLeads, lostLeads] = await Promise.all([
      Lead.countDocuments({
        companyId,
        status: "new",
        createdAt: { $gte: sevenDaysAgo, $lt: endOfToday },
      }),
      Lead.countDocuments({
        companyId,
        status: "won",
        wonAt: { $gte: sevenDaysAgo, $lt: endOfToday },
      }),
      Lead.countDocuments({
        companyId,
        status: "lost",
        lostAt: { $gte: sevenDaysAgo, $lt: endOfToday },
      }),
    ]);

 
    const conversionTrend = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(startOfToday);
      date.setDate(startOfToday.getDate() - i);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const [won, lost] = await Promise.all([
        Lead.countDocuments({ companyId, status: "won", wonAt: { $gte: date, $lt: nextDate } }),
        Lead.countDocuments({ companyId, status: "lost", lostAt: { $gte: date, $lt: nextDate } }),
      ]);

      conversionTrend.push({ date: formatDate(date), won, lost });
    }

    res.status(200).json({
      success: true,
      stats: { new: newLeads, won: wonLeads, lost: lostLeads },
      conversionTrend,
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics" });
  }
};

// GET /api/leads/advanced
export const getAdvancedAnalytics = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user._id);

    const sourceConversion = await Lead.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: "$source",
          won: { $sum: { $cond: [{ $eq: ["$status", "won"] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ["$status", "lost"] }, 1, 0] } },
        },
      },
      { $project: { _id: 0, source: "$_id", won: 1, lost: 1 } },
      { $sort: { won: -1 } },
    ]);

    const lostReasons = await Lead.aggregate([
      { $match: { companyId, status: "lost" } },
      { $group: { _id: "$lostReason", count: { $sum: 1 } } },
      { $project: { _id: 0, reason: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, sourceConversion, lostReasons });
  } catch (error) {
    console.error("ADVANCED ANALYTICS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};
