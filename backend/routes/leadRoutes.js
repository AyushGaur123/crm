// import express from "express";

// import {getLeads,getLeadById,createLead,createPublicLead,updateLead,updateLeadStatus,deleteLead,addNote,updateFollowUp,getLeadStats,getFollowUps, getDashboardStats, deleteNote, getAdvancedAnalytics,} from "../controllers/leadController.js";

// import protect from "../middleware/authMiddleware.js";
// import { getCompanies } from "../controllers/authController.js";

// const router = express.Router();


// router.post("/public", createPublicLead);




// /*
//   Protected routes
// */
// router.use(protect);

// router.post("/public", createPublicLead);//update

// router.get("/follow-ups",getFollowUps);


// router.get("/stats", getLeadStats);

// router.get( "/dashboard", getDashboardStats);

// router.get("/", getLeads);

// router.post("/", createLead);

// router.get( "/advanced",  getAdvancedAnalytics);


// router.get("/:id", getLeadById);

// router.put("/:id", updateLead);

// router.patch("/:id/status", updateLeadStatus);

// router.delete("/:id", deleteLead);

// router.post("/:id/notes", addNote);

// router.delete("/:id/notes/:noteId", deleteNote);

// // router.patch("/:id/follow-up", updateFollowUp);


// router.patch(
//   "/:id/follow-up",
//   updateFollowUp
// );



// router.get("/:id",getLeadById);

// export default router;


import express from "express";

import {
  getLeads,
  getLeadById,
  createLead,
  createPublicLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  addNote,
  deleteNote,
  updateFollowUp,
  deleteFollowUp,
  getLeadStats,
  getFollowUps,
  getDashboardStats,
  getAdvancedAnalytics,
} from "../controllers/leadController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/public", createPublicLead);

router.use(protect);

router.get("/follow-ups", getFollowUps);
router.get("/stats", getLeadStats);
router.get("/dashboard", getDashboardStats);
router.get("/advanced", getAdvancedAnalytics);

router.get("/", getLeads);
router.post("/", createLead);

router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.patch("/:id/status", updateLeadStatus);
router.patch("/:id/follow-up", updateFollowUp);
router.delete("/:id/follow-up",deleteFollowUp);
router.delete("/:id", deleteLead);

router.post("/:id/notes", addNote);
router.delete("/:id/notes/:noteId", deleteNote);

export default router;