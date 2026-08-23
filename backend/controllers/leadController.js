import Lead from "../models/Lead.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const getLeads = async (req, res) => {
  try {
    const {
      search,
      status,
      source,
      sort = "newest",
    } = req.query;

 
    const query = {
      companyId: req.user._id,
    };

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (source && source !== "all") {
      query.source = source;
    }

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const leads = await Lead.find(query)
      .sort(sortOption);

    res.json({
      success: true,
      count: leads.length,
      leads,
    });

  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
GET /api/leads/:id
*/
const getLeadById = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const lead = await Lead.findOne({
      _id: req.params.id,

      // IMPORTANT
      companyId: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    res.json({
      success: true,
      lead,
    });

  } catch (error) {
    console.error(
      "GET LEAD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
POST /api/leads
Admin creates lead manually
*/
const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      message,
      source,
      status,
      followUpDate,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Name and email are required.",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      message,

      source: source || "Website",

      status: status || "new",

      followUpDate,

      // VERY IMPORTANT
      companyId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message:
        "Lead created successfully.",
      lead,
    });

  } catch (error) {
    console.error(
      "CREATE LEAD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
POST /api/leads/public
Public contact form
*/
const createPublicLead = async ( req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      company,
      companyId,
    } = req.body;

    console.log(
      "PUBLIC LEAD BODY:",
      req.body
    );

    if (
      !name ||
      !email ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and company are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        companyId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid companyId",
      });
    }

    // companyId currently refers to User._id
    const mycompany =
      await User.findById(companyId);

    if (!mycompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      message,
      company,

      companyId: mycompany._id,

      source: "Website",

      status: "new",
    });

    return res.status(201).json({
      success: true,
      message:
        "Message sent successfully",
      lead,
    });

  } catch (error) {
    console.error(
      "CREATE PUBLIC LEAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
PUT /api/leads/:id
*/
const updateLead = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    // IMPORTANT:
    // Find only inside current admin's company
    const lead =
      await Lead.findOne({
        _id: req.params.id,
        companyId: req.user._id,
      });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    const {
      name,
      email,
      phone,
      company,
      message,
      source,
      status,
      followUpDate,
    } = req.body;

    lead.name =
      name ?? lead.name;

    lead.email =
      email ?? lead.email;

    lead.phone =
      phone ?? lead.phone;

    lead.company =
      company ?? lead.company;

    lead.message =
      message ?? lead.message;

    lead.source =
      source ?? lead.source;

    if (status) {
      lead.status = status;

      if (
        status === "contacted"
      ) {
        lead.lastContactedAt =
          new Date();
      }
    }

    lead.followUpDate =
      followUpDate ??
      lead.followUpDate;

    const updatedLead =
      await lead.save();

    res.json({
      success: true,
      message:
        "Lead updated successfully.",
      lead: updatedLead,
    });

  } catch (error) {
    console.error(
      "UPDATE LEAD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "contacted",
      "replied",
      "interested",
      "meeting_scheduled",
      "proposal_sent",
      "negotiation",
      "won",
      "lost",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead status.",
      });
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      companyId: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    lead.status = status;

    if (status === "contacted") {
      lead.lastContactedAt = new Date();
    }

    if (status === "won") {
      lead.wonAt = new Date();
    }

    if (status === "lost") {
      lead.lostAt = new Date();
    }

    const updatedLead = await lead.save();

    res.json({
      success: true,
      message: "Lead status updated.",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("UPDATE LEAD STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
DELETE /api/leads/:id
*/
const deleteLead = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const lead =
      await Lead.findOneAndDelete({
        _id: req.params.id,

        // IMPORTANT
        companyId: req.user._id,
      });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Lead deleted successfully.",
    });

  } catch (error) {
    console.error(
      "DELETE LEAD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
POST /api/leads/:id/notes
*/
const addNote = async (
  req,
  res
) => {
  try {
    const { text } =
      req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Note cannot be empty.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    // IMPORTANT
    const lead =
      await Lead.findOne({
        _id: req.params.id,
        companyId: req.user._id,
      });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    lead.notes.push({
      text: text.trim(),
      createdBy: req.user._id,
    });

    const updatedLead =
      await lead.save();

    res.status(201).json({
      success: true,
      message:
        "Note added successfully.",
      lead: updatedLead,
    });

  } catch (error) {
    console.error(
      "ADD NOTE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};








const updateFollowUp = async (req, res) => {
  try {
    const hasFollowUpDate = Object.prototype.hasOwnProperty.call(
      req.body,
      "followUpDate"
    );

    if (!hasFollowUpDate) {
      return res.status(400).json({
        success: false,
        message: "followUpDate is required.",
      });
    }

    const { followUpDate } = req.body;

    let parsedDate = null;

    if (followUpDate !== null && followUpDate !== "") {
      parsedDate = new Date(followUpDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid follow-up date.",
        });
      }
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      companyId: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    lead.followUpDate = parsedDate;

    const updatedLead = await lead.save();

    return res.status(200).json({
      success: true,
      message: parsedDate
        ? "Follow-up saved successfully."
        : "Follow-up deleted successfully.",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("UPDATE FOLLOW-UP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const getLeadStats = async (req, res) => {
  try {
    const companyId = req.user._id;

    // All statuses used by your CRM
    const statuses = [
      "new",
      "contacted",
      "replied",
      "interested",
      "meeting_scheduled",
      "proposal_sent",
      "negotiation",
      "won",
      "lost",
    ];

    // Get total leads belonging to this admin/company
    const total = await Lead.countDocuments({
      companyId,
    });

    // Count leads by status
    const statusCounts = await Lead.aggregate([
      {
        $match: {
          companyId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // Create stats object
    const stats = {};

    statuses.forEach((status) => {
      const found = statusCounts.find(
        (item) => item._id === status
      );

      stats[status] = found
        ? found.count
        : 0;
    });

    // Conversion rate
    const converted =
      stats.won || 0;

    const conversionRate =
      total > 0
        ? Number(
            ((converted / total) * 100).toFixed(1)
          )
        : 0;

    // Source statistics
    const sources = await Lead.aggregate([
      {
        $match: {
          companyId,
        },
      },
      {
        $group: {
          _id: "$source",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        total,
        ...stats,
        converted,
        conversionRate,
      },

      sources,
    });

  } catch (error) {
    console.error(
      "GET LEAD STATS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch lead statistics",
    });
  }
};


const getFollowUps = async (req, res) => {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const baseQuery = {
      companyId: req.user._id,
      followUpDate: { $ne: null },
      // status: { $nin: ["won", "lost"] },
    };


    const test = await Lead.find({ companyId: req.user._id, followUpDate: { $ne: null } });
    console.log(test.length);

    const all = await Lead.find(baseQuery)
      .sort({ followUpDate: 1 })
      .select(
        "name email company status followUpDate createdAt"
      );

    const overdue = all.filter(
      (lead) => lead.followUpDate < startOfToday
    );

    const today = all.filter(
      (lead) =>
        lead.followUpDate >= startOfToday &&
        lead.followUpDate <= endOfToday
    );

    const upcoming = all.filter(
      (lead) => lead.followUpDate > endOfToday
    );

    return res.status(200).json({
      success: true,
      all,
      overdue,
      today,
      upcoming,
    });
  } catch (error) {
    console.error("GET FOLLOW-UPS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const deleteFollowUp = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      companyId: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    if (!lead.followUpDate) {
      return res.status(400).json({
        success: false,
        message: "No follow-up is scheduled for this lead.",
      });
    }

    lead.followUpDate = null;

    const updatedLead = await lead.save();

    return res.status(200).json({
      success: true,
      message: "Follow-up deleted successfully.",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("DELETE FOLLOW-UP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // Start of today
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Seven days including today
    const sevenDaysAgo = new Date(
      startOfToday
    );

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 6
    );

    // End of today
    const endOfToday = new Date(
      startOfToday
    );

    endOfToday.setDate(
      endOfToday.getDate() + 1
    );

    /*
     * -----------------------------------------
     * DASHBOARD COUNTS
     * -----------------------------------------
     */

    const newLeads = await Lead.countDocuments({
      companyId: req.user._id,
      status: "new",
      createdAt: {
        $gte: sevenDaysAgo,
        $lt: endOfToday,
      },
    });

    const wonLeads = await Lead.countDocuments({
      companyId: req.user._id,
      status: "won",
      wonAt: {
        $gte: sevenDaysAgo,
        $lt: endOfToday,
      },
    });

    const lostLeads = await Lead.countDocuments({
      companyId: req.user._id,
      status: "lost",
      lostAt: {
        $gte: sevenDaysAgo,
        $lt: endOfToday,
      },
    });

    /*
     * -----------------------------------------
     * 7 DAY WON CONVERSION TREND
     * -----------------------------------------
     */

    const wonData = await Lead.aggregate([
      {
        $match: {
          companyId: req.user._id,
          status: "won",
          wonAt: {
            $gte: sevenDaysAgo,
            $lt: endOfToday,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$wonAt",
            },
          },

          won: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    /*
     * -----------------------------------------
     * CREATE ALL 7 DAYS
     *
     * Even if there are zero wins on a day,
     * that day must appear in the graph.
     * -----------------------------------------
     */

  

    const formatDate = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


//!won-lost both
const conversionTrend = [];

const today = new Date();
today.setHours(0, 0, 0, 0);

for (let i = 6; i >= 0; i--) {
  const date = new Date(today);
  date.setDate(today.getDate() - i);

  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);

  const won = await Lead.countDocuments({
    companyId: req.user._id,
    status: "won",
    wonAt: {
      $gte: date,
      $lt: nextDate,
    },
  });

  const lost = await Lead.countDocuments({
    companyId: req.user._id,
    status: "lost",
    lostAt: {
      $gte: date,
      $lt: nextDate,
    },
  });

  conversionTrend.push({
    date: formatDate(date),
    won,
    lost,
  });
}

    /*
     * -----------------------------------------
     * RESPONSE
     * -----------------------------------------
     */

    res.status(200).json({
      success: true,

      stats: {
        new: newLeads,
        won: wonLeads,
        lost: lostLeads,
      },

      conversionTrend,
    });
  } catch (error) {
    console.error(
      "GET DASHBOARD STATS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard statistics",
    });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;

    const lead = await Lead.findOne({
      _id: id,
      companyId: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    const note = lead.notes.id(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    note.deleteOne();

    await lead.save();

    return res.json({
      success: true,
      message: "Note deleted successfully.",
      lead,
    });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getAdvancedAnalytics = async (req, res) => {
  try {
    const companyId = req.user._id;

    const sourceConversion = await Lead.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $group: {
          _id: "$source",

          won: {
            $sum: {
              $cond: [
                { $eq: ["$status", "won"] },
                1,
                0,
              ],
            },
          },

          lost: {
            $sum: {
              $cond: [
                { $eq: ["$status", "lost"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          source: "$_id",
          won: 1,
          lost: 1,
        },
      },
      {
        $sort: {
          won: -1,
        },
      },
    ]);

    const lostReasons = await Lead.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          status: "lost",
        },
      },
      {
        $group: {
          _id: "$lostReason",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          reason: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.json({
      success: true,
      sourceConversion,
      lostReasons,
    });
  } catch (error) {
    console.error(
      "ADVANCED ANALYTICS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

export {
  getLeads,
  getLeadById,
  createLead,
  createPublicLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  addNote,
  deleteNote ,
  updateFollowUp,
  deleteFollowUp,
  getLeadStats,
  getFollowUps,
  getDashboardStats,
  getAdvancedAnalytics
  
};