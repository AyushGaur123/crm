// import { useState } from "react";
// import {
//   Mail,
//   Phone,
//   Building2,
//   Calendar,
//   Plus,
// } from "lucide-react";
// import toast from "react-hot-toast";

// import leadService from "../../services/leadService";
// import Modal from "../common/Modal";

// function LeadDetails({ lead, onClose, onUpdated }) {
//   const [note, setNote] = useState("");
//   const [followUpDate, setFollowUpDate] = useState(
//     lead.followUpDate
//       ? lead.followUpDate.substring(0, 10)
//       : ""
//   );

//   const updateStatus = async (status) => {
//     try {
//       await leadService.updateStatus(
//         lead._id,
//         status
//       );

//       toast.success("Status updated");

//       onUpdated();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update status"
//       );
//     }
//   };

//   const addNote = async () => {
//     if (!note.trim()) return;

//     try {
//       await leadService.addNote(
//         lead._id,
//         note
//       );

//       setNote("");

//       toast.success("Note added");

//       onUpdated();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to add note"
//       );
//     }
//   };

//   const saveFollowUp = async () => {
//     try {
//       await leadService.updateFollowUp(
//         lead._id,
//         followUpDate
//       );

//       toast.success(
//         "Follow-up date updated"
//       );

//       onUpdated();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update follow-up"
//       );
//     }
//   };

//   return (
//     <Modal
//       isOpen={true}
//       onClose={onClose}
//       title="Lead Details"
//       size="lg"
//     >
//       <div className="space-y-6">

//         {/* Header */}
//         <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div className="flex items-center gap-4">
//             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-lg font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
//               {lead.name
//                 ?.charAt(0)
//                 ?.toUpperCase()}
//             </div>

//             <div>
//               <h3 className="text-xl font-bold">
//                 {lead.name}
//               </h3>

//               <p className="text-sm text-slate-500 dark:text-slate-400">
//                 {lead.company || "No company"}
//               </p>
//             </div>
//           </div>

//           <select
//             value={lead.status || "new"}
//             onChange={(e) =>
//               updateStatus(e.target.value)
//             }
//             className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
//           >
//             <option value="new">New</option>
//             <option value="contacted">Contacted</option>
//             <option value="replied">Replied</option>
//             <option value="interested">Interested</option>
//             <option value="meeting_scheduled">Meeting Sheduled</option>
//             <option value="proposal_sent">Praposal Sent</option>
//             <option value="negociation">Negotiation</option>
//             <option value="won">Won</option>
//             <option value="lost">Lost</option>
//           </select>
//         </div>

//         {/* Contact information */}
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//           <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
//             <div className="flex items-center gap-3">
//               <Mail
//                 size={18}
//                 className="text-indigo-500"
//               />

//               <div>
//                 <p className="text-xs text-slate-500">
//                   Email
//                 </p>

//                 <p className="text-sm font-medium">
//                   {lead.email}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
//             <div className="flex items-center gap-3">
//               <Phone
//                 size={18}
//                 className="text-indigo-500"
//               />

//               <div>
//                 <p className="text-xs text-slate-500">
//                   Phone
//                 </p>

//                 <p className="text-sm font-medium">
//                   {lead.phone || "Not provided"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
//             <div className="flex items-center gap-3">
//               <Building2
//                 size={18}
//                 className="text-indigo-500"
//               />

//               <div>
//                 <p className="text-xs text-slate-500">
//                   Company
//                 </p>

//                 <p className="text-sm font-medium">
//                   {lead.company || "Not provided"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
//             <div className="flex items-center gap-3">
//               <Calendar
//                 size={18}
//                 className="text-indigo-500"
//               />

//               <div>
//                 <p className="text-xs text-slate-500">
//                   Source
//                 </p>

//                 <p className="text-sm font-medium">
//                   {lead.source || "Unknown"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Message */}
//         {lead.message && (
//           <div>
//             <h4 className="mb-2 text-sm font-semibold">
//               Original Message
//             </h4>

//             <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
//               {lead.message}
//             </div>
//           </div>
//         )}

//         {/* Follow up */}
//         <div>
//           <h4 className="mb-3 text-sm font-semibold">
//             Follow-up
//           </h4>

//           <div className="flex flex-col gap-3 sm:flex-row">
//             <input
//               type="date"
//               value={followUpDate}
//               onChange={(e) =>
//                 setFollowUpDate(e.target.value)
//               }
//               className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
//             />

//             <button
//               onClick={saveFollowUp}
//               className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
//             >
//               Save Follow-up
//             </button>
//           </div>
//         </div>

//         {/* Notes */}
//         <div>
//           <h4 className="mb-3 text-sm font-semibold">
//             Add Follow-up Note
//           </h4>

//           <div className="flex flex-col gap-3 sm:flex-row">
//             <textarea
//               value={note}
//               onChange={(e) =>
//                 setNote(e.target.value)
//               }
//               rows={2}
//               placeholder="Example: Client will call tomorrow..."
//               className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
//             />

//             <button
//               onClick={addNote}
//               className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
//             >
//               <Plus size={17} />
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Existing notes */}
//         {lead.notes?.length > 0 && (
//           <div>
//             <h4 className="mb-3 text-sm font-semibold">
//               Previous Notes
//             </h4>

//             <div className="space-y-3">
//               {[...lead.notes]
//                 .reverse()
//                 .map((item, index) => (
//                   <div
//                     key={item._id || index}
//                     className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
//                   >
//                     <p className="text-sm">
//                       {item.text}
//                     </p>

//                     {item.createdAt && (
//                       <p className="mt-2 text-xs text-slate-400">
//                         {new Date(
//                           item.createdAt
//                         ).toLocaleString()}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//       </div>
//     </Modal>
//   );
// }

// export default LeadDetails;