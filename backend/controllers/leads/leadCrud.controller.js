import mongoose from "mongoose";

import Lead from "../../models/Lead.js";
import User from "../../models/User.js";
import { findCompanyLead } from "./helpers.js";

// GET /api/leads
export const getLeads = async (req, res) => {
  try {
    const { search, status, source, sort = "newest" } = req.query;

    const query = { companyId: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") query.status = status;
    if (source && source !== "all") query.source = source;

    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const leads = await Lead.find(query).sort(sortOption);

    res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error("GET LEADS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leads/:id
export const getLeadById = async (req, res) => {
  try {
    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    res.json({ success: true, lead: result.lead });
  } catch (error) {
    console.error("GET LEAD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/leads — admin creates a lead manually
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, message, source, status, followUpDate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required." });
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
      companyId: req.user._id,
    });

    res.status(201).json({ success: true, message: "Lead created successfully.", lead });
  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/leads/public — public contact form, no auth
export const createPublicLead = async (req, res) => {
  try {
    const { name, email, phone, message, company, companyId, source } = req.body;

    if (!name || !email || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Name, email and company are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: "Invalid companyId" });
    }

    // companyId here refers to the owning User._id
    const owner = await User.findById(companyId);

    if (!owner) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      message,
      company,
      companyId: owner._id,
      source,
      status: "new",
    });

    res.status(201).json({ success: true, message: "Message sent successfully", lead });
  } catch (error) {
    console.error("CREATE PUBLIC LEAD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const { lead } = result;
    const { name, email, phone, company, message, source } = req.body;

    lead.name = name ?? lead.name;
    lead.email = email ?? lead.email;
    lead.phone = phone ?? lead.phone;
    lead.company = company ?? lead.company;
    lead.message = message ?? lead.message;
    lead.source = source ?? lead.source;

    const updatedLead = await lead.save();

    res.json({ success: true, message: "Lead updated successfully.", lead: updatedLead });
  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (req, res) => {
  try {
    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    await result.lead.deleteOne();

    res.json({ success: true, message: "Lead deleted successfully." });
  } catch (error) {
    console.error("DELETE LEAD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
