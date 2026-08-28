import mongoose from "mongoose";
import Lead from "../../models/Lead.js";

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);


export const findCompanyLead = async (id, companyId) => {
  if (!isValidId(id)) {
    return { status: 400, message: "Invalid lead ID." };
  }

  const lead = await Lead.findOne({ _id: id, companyId });

  if (!lead) {
    return { status: 404, message: "Lead not found." };
  }

  return { lead };
};
