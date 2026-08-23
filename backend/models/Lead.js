import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      default: "Website",
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "replied", "interested", "meeting_scheduled", "proposal_sent", "negotiation", "won", "lost"],
      default: "new",
    },

    notes: [noteSchema],

    followUpDate: {
      type: Date,
    },

    lastContactedAt: {
      type: Date,
    },
    wonAt: {
      type: Date,
    },

    lostAt: {
      type: Date,
    },
    lostReason: {
      type: String,
      enum: [
        "price",
        "competitor",
        "not_interested",
        "no_response",
        "other",
      ],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", leadSchema);



export default Lead;