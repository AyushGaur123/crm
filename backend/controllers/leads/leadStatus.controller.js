import { findCompanyLead } from "./helpers.js";
import { LEAD_STATUSES } from "./constants.js";

// PATCH /api/leads/:id/status
export const updateLeadStatus = async (req, res) => {
  try {
    const { status, lostReason } = req.body;

    if (!LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid lead status." });
    }

    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const { lead } = result;
    lead.status = status;

    if (status === "contacted") lead.lastContactedAt = new Date();
    if (status === "won") lead.wonAt = new Date();

    if (status === "lost") {
      if (!lostReason) {
        return res.status(400).json({ success: false, message: "Lost reason is required." });
      }

      lead.lostReason = lostReason;
      lead.lostAt = new Date();
    } else {
      lead.lostReason = null;
    }

    const updatedLead = await lead.save();

    res.json({ success: true, message: "Lead status updated.", lead: updatedLead });
  } catch (error) {
    console.error("UPDATE LEAD STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
