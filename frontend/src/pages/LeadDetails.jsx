import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Edit3,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Save,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import leadService from "../services/leadService";

const STATUSES = [
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

const STATUS_LABELS = {
  new: "NEW",
  contacted: "CONTACTED",
  replied: "REPLIED",
  interested: "INTERESTED",
  meeting_scheduled: "MEETING SCHEDULED",
  proposal_sent: "PROPOSAL SENT",
  negotiation: "NEGOTIATION",
  won: "WON",
  lost: "LOST",
};

const STATUS_STYLES = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  contacted: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  replied: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
  interested: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  meeting_scheduled: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  proposal_sent: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  negotiation: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
  won: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  lost: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function getApiError(error, fallback) {
  return error.response?.data?.message || fallback;
}

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [followUpDate, setFollowUpDate] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [showFollowUpEditor, setShowFollowUpEditor] = useState(false);
  const [deletingFollowUp, setDeletingFollowUp] = useState(false);

  const applyLead = (nextLead) => {
    if (!nextLead) return;
    setLead(nextLead);
    setFollowUpDate(toDateTimeLocal(nextLead.followUpDate));
  };

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id);
      applyLead(response.lead);
    } catch (error) {
      console.error("GET LEAD ERROR:", error);
      toast.error(getApiError(error, "Failed to load lead"));
      setLead(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleStatusChange = async (status) => {
    if (status === lead.status) return;

    try {
      setUpdatingStatus(true);
      const response = await leadService.updateLeadStatus(id, status);
      applyLead(response.lead);
      toast.success("Lead status updated");
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      toast.error(getApiError(error, "Failed to update status"));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    const text = note.trim();
    if (!text) return;

    try {
      setSavingNote(true);
      const response = await leadService.addNote(id, text);
      applyLead(response.lead);
      setNote("");
      toast.success("Note added");
    } catch (error) {
      console.error("ADD NOTE ERROR:", error);
      toast.error(getApiError(error, "Failed to add note"));
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    toast(
      (toastItem) => (
        <div className="w-[280px] text-slate-900 dark:text-white">
          <p className="font-semibold">Delete this note?</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(toastItem.id)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(toastItem.id);
                const loadingToast = toast.loading("Deleting note...");
                try {
                  setDeletingNote(noteId);
                  const response = await leadService.deleteNote(id, noteId);
                  applyLead(response.lead);
                  toast.success("Note deleted", { id: loadingToast });
                } catch (error) {
                  toast.error(getApiError(error, "Failed to delete note"), { id: loadingToast });
                } finally {
                  setDeletingNote(null);
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleSaveFollowUp = async () => {
    if (!followUpDate) {
      toast.error("Please choose a follow-up date and time");
      return;
    }

    try {
      setSavingFollowUp(true);
      // Send an ISO value, not a locale-formatted string, so MongoDB receives
      // an unambiguous date regardless of the browser locale.
      const response = await leadService.updateFollowUp(id, new Date(followUpDate).toISOString());
      applyLead(response.lead);
      setShowFollowUpEditor(false);
      toast.success("Follow-up saved");
    } catch (error) {
      console.error("SAVE FOLLOW-UP ERROR:", error);
      toast.error(getApiError(error, "Failed to save follow-up"));
    } finally {
      setSavingFollowUp(false);
    }
  };

  const handleDeleteFollowUp = () => {
    toast(
      (toastItem) => (
        <div className="w-[280px] text-slate-900 dark:text-white">
          <p className="font-semibold">Delete this follow-up?</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The lead will no longer appear in follow-up lists.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(toastItem.id)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(toastItem.id);
                const loadingToast = toast.loading("Deleting follow-up...");
                try {
                  setDeletingFollowUp(true);
                  const response = await leadService.deleteFollowUp(id);
                  applyLead(response.lead);
                  setFollowUpDate("");
                  setShowFollowUpEditor(false);
                  toast.success("Follow-up deleted", { id: loadingToast });
                } catch (error) {
                  toast.error(getApiError(error, "Failed to delete follow-up"), { id: loadingToast });
                } finally {
                  setDeletingFollowUp(false);
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  if (loading) return <LoadingState />;
  if (!lead) return <NotFound onBack={() => navigate("/admin/leads")} />;

  const currentStageIndex = Math.max(0, STATUSES.indexOf(lead.status));
  const daysSinceCreated = Math.max(
    0,
    Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 86400000)
  );
  const followUp = getFollowUpStatus(lead.followUpDate);

  return (
    <div className="space-y-6">
      <Link
        to="/admin/leads"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Leads
      </Link>

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-base font-bold text-white">
              {getInitials(lead.name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lead.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Created {formatDate(lead.createdAt)}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} />
                  {daysSinceCreated === 0
                    ? "Added today"
                    : `${daysSinceCreated} day${daysSinceCreated === 1 ? "" : "s"} in pipeline`}
                </span>
              </p>
            </div>
          </div>

          <StatusBadge status={lead.status} />
        </div>

        <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-3">
          <ContactChip icon={<Mail size={17} />} label="Email" value={lead.email} tone="blue" />
          <ContactChip
            icon={<Phone size={17} />}
            label="Phone"
            value={lead.phone || "Not provided"}
            tone="green"
          />
          <ContactChip
            icon={<Building2 size={17} />}
            label="Company"
            value={lead.company || "Not provided"}
            tone="purple"
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Pipeline Stage"
          value={`${currentStageIndex + 1} / ${STATUSES.length}`}
          caption={STATUS_LABELS[lead.status] || lead.status}
          tone="blue"
        />
        <StatCard
          icon={<Clock3 size={18} />}
          label="Days Open"
          value={daysSinceCreated}
          caption="since created"
          tone="indigo"
        />
        <StatCard
          icon={<FileText size={18} />}
          label="Activity Logged"
          value={lead.notes?.length || 0}
          caption="notes recorded"
          tone="purple"
        />
        <StatCard
          icon={<Bell size={18} />}
          label="Next Follow-up"
          value={
            lead.followUpDate
              ? formatDate(lead.followUpDate, { day: "numeric", month: "short" })
              : "—"
          }
          caption={followUp.label}
          tone={followUp.tone}
        />
      </section>

      <Pipeline
        lead={lead}
        currentStageIndex={currentStageIndex}
        updatingStatus={updatingStatus}
        onChange={handleStatusChange}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-slate-900 dark:text-white">Original Message</h2>
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-300">
              {lead.message || "No message provided."}
            </p>
          </div>
        </section>

        <FollowUpCard
          lead={lead}
          followUp={followUp}
          editing={showFollowUpEditor}
          date={followUpDate}
          saving={savingFollowUp}
          deleting={deletingFollowUp}
          setDate={setFollowUpDate}
          onEdit={() => setShowFollowUpEditor((value) => !value)}
          onSave={handleSaveFollowUp}
          onDelete={handleDeleteFollowUp}
        />
      </div>

      <NotesSection
        notes={lead.notes || []}
        note={note}
        setNote={setNote}
        saving={savingNote}
        deletingNote={deletingNote}
        onAdd={handleAddNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}

function Pipeline({ lead, currentStageIndex, updatingStatus, onChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lead Pipeline</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track the progress of this lead.
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[900px] items-start">
          {STATUSES.map((status, index) => {
            const isCurrent = lead.status === status;
            const isCompleted = index < currentStageIndex && lead.status !== "lost";

            return (
              <div key={status} className="flex flex-1 items-start">
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => onChange(status)}
                  className="group flex flex-col items-center disabled:cursor-not-allowed"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      isCurrent
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900"
                    }`}
                  >
                    {isCurrent || isCompleted ? <CheckCircle2 size={18} /> : <Circle size={17} />}
                  </div>
                  <span
                    className={`mt-3 max-w-24 text-center text-xs font-semibold ${
                      isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-500"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                </button>

                {index < STATUSES.length - 1 && (
                  <div
                    className={`mt-5 h-0.5 flex-1 ${
                      index < currentStageIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FollowUpCard({ lead, followUp, editing, date, saving, deleting, setDate, onEdit, onSave, onDelete }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Follow-up</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Plan the next interaction.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Edit follow-up"
        >
          <Edit3 size={16} />
        </button>
      </div>

      {lead.followUpDate && !editing && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {formatDate(lead.followUpDate, { dateStyle: "medium", timeStyle: "short" })}
          </p>
          <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${followUp.className}`}>
            {followUp.label}
          </span>
          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400"
          >
            <Trash2 size={15} />
            {deleting ? "Deleting..." : "Delete follow-up"}
          </button>
        </div>
      )}

      {(!lead.followUpDate || editing) && (
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Date and time
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Follow-up"}
          </button>

          {lead.followUpDate && (
            <button
              type="button"
              onClick={onEdit}
              className="mt-2 w-full text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function NotesSection({ notes, note, setNote, saving, deletingNote, onAdd, onDelete }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="font-bold text-slate-900 dark:text-white">Notes & Follow-ups</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep track of conversations and actions.
        </p>
      </div>

      <div className="mt-5">
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add a note about this lead..."
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={saving || !note.trim()}
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={17} />
          {saving ? "Adding..." : "Add Note"}
        </button>
      </div>

      <div className="mt-8">
        {notes.length ? (
          <div className="relative space-y-5">
            {[...notes].reverse().map((item, index) => (
              <div key={item._id} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <Clock3 size={16} />
                  </div>
                  {index !== notes.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  )}
                </div>

                <div className="mb-1 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                      Activity
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock3 size={13} />
                        {formatDate(item.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                      <button
                        type="button"
                        disabled={deletingNote === item._id}
                        onClick={() => onDelete(item._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        title="Delete note"
                      >
                        {deletingNote === item._id ? (
                          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <MessageSquare size={26} />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">No activity yet</p>
            <p className="mt-1 text-xs text-slate-500">Add your first note to start tracking this lead.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_STYLES[status] || STATUS_STYLES.new}`}>
      {STATUS_LABELS[status] || String(status || "new").replaceAll("_", " ").toUpperCase()}
    </span>
  );
}

function ContactChip({ icon, label, value, tone }) {
  const tones = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, caption, tone }) {
  const tones = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    red: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span>
      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

function getFollowUpStatus(value) {
  if (!value) {
    return {
      label: "No follow-up scheduled",
      tone: "slate",
      className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    };
  }

  const today = new Date();
  const date = new Date(value);
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const days = Math.round((date - today) / 86400000);

  if (days < 0) {
    return { label: "Overdue", tone: "red", className: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" };
  }
  if (days === 0) {
    return { label: "Today", tone: "orange", className: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400" };
  }
  if (days === 1) {
    return { label: "Tomorrow", tone: "blue", className: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" };
  }
  return { label: `In ${days} days`, tone: "green", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" };
}

function formatDate(value, options = {}) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return options.timeStyle ? date.toLocaleString("en-IN", options) : date.toLocaleDateString("en-IN", options);
}

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

function NotFound({ onBack }) {
  return (
    <div className="py-20 text-center">
      <User className="mx-auto text-slate-400" size={34} />
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Lead not found</h2>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        Back to Leads
      </button>
    </div>
  );
}

export default LeadDetails;

