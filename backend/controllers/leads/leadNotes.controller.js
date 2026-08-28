import { findCompanyLead } from "./helpers.js";

// POST /api/leads/:id/notes
export const addNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Note cannot be empty." });
    }

    const result = await findCompanyLead(req.params.id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const { lead } = result;
    lead.notes.push({ text: text.trim(), createdBy: req.user._id });

    const updatedLead = await lead.save();

    res.status(201).json({ success: true, message: "Note added successfully.", lead: updatedLead });
  } catch (error) {
    console.error("ADD NOTE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/leads/:id/notes/:noteId
export const deleteNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;

    const result = await findCompanyLead(id, req.user._id);

    if (result.status) {
      return res.status(result.status).json({ success: false, message: result.message });
    }

    const { lead } = result;
    const note = lead.notes.id(noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found." });
    }

    note.deleteOne();
    await lead.save();

    res.json({ success: true, message: "Note deleted successfully.", lead });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
