import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, Filter, Torus, } from "lucide-react";
import toast from "react-hot-toast";

import leadService from "../services/leadService";
import Modal from "../components/common/Modal";
import LeadForm from "../components/leads/LeadForm";
// import LeadDetails from "../components/leads/LeadDetails";
import { Link } from "react-router-dom";




function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] =
    useState(null);

  const [selectedLead, setSelectedLead] =
    useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response =
        await leadService.getLeads();

      setLeads(
        response.leads ||
        response.data ||
        []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load leads"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        lead.name
          ?.toLowerCase()
          .includes(searchValue) ||
        lead.email
          ?.toLowerCase()
          .includes(searchValue) ||
        lead.company
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "all" ||
        lead.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [leads, search, status]);

  const deleteLead = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    try {
      await leadService.deleteLead(id);

      toast.success(
        "Lead deleted successfully"
      );

      fetchLeads();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete lead"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLead(null);
    fetchLeads();
  };

  const handleDetailsUpdated = async () => {
    await fetchLeads();

    if (selectedLead) {
      try {
        const response =
          await leadService.getLead(
            selectedLead._id
          );

        setSelectedLead(
          response.lead ||
          response.data
        );
      } catch {
        setSelectedLead(null);
      }
    }
  };

  const statusStyles = {
     new:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    contacted:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

    replied:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",

    interested:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

    meeting_scheduled:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

    proposal_sent:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

    negotiation:
      "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",

    won:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

    lost:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Leads
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and track all your potential clients.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingLead(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email or company..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 lg:w-48"
            >
              <option value="all">  All Statuses </option>
              <option value="new">  New</option>
              <option value="contacted"> Contacted</option>
              <option value="replied">Replied</option>
              <option value="converted"> Interested</option>
              <option value="meeting_scheduled"> Meeting Sheduled</option>
              <option value="proposal_sent"> Praposal Sent</option>
              <option value="negotiation"> Negotiation</option>
              <option value="won"> Won</option>
              <option value="lost"> Lost</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Client
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Company
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Source
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Created
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto max-w-sm">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <Search
                          size={20}
                          className="text-slate-400"
                        />
                      </div>

                      <p className="font-medium">
                        No leads found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {lead.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium">
                            {lead.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {lead.company ||
                        "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium dark:bg-slate-800">
                        {lead.source ||
                          "Unknown"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                          statusStyles[lead.status] 
                          ||
                          statusStyles.new
                          }`}
                      >
                        {lead.status ||
                          "new"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {lead.createdAt
                        ? new Date(
                          lead.createdAt
                        ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">

                        <button
                          
                          title="View"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Link to={`/admin/leads/${lead._id}`}>  <Eye size={17} /></Link>
                         
                        </button>

                        {/* <Link
                          to={`/admin/leads/${lead._id}`}
                        >
                          <Torus size={17} />
                         
                        </Link> */}

                        <button
                          onClick={() => {
                            setEditingLead(
                              lead
                            );
                            setShowForm(true);
                          }}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() =>
                            deleteLead(
                              lead._id
                            )
                          }
                          title="Delete"
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* Footer */}
        {!loading && (
          <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500 dark:border-slate-800">
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredLeads.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {leads.length}
            </span>{" "}
            leads
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingLead(null);
        }}
        title={
          editingLead
            ? "Edit Lead"
            : "Add New Lead"
        }
        size="lg"
      >
        <LeadForm
          lead={editingLead}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      </Modal>

      {/* Details */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() =>
            setSelectedLead(null)
          }
          onUpdated={
            handleDetailsUpdated
          }
        />
      )}
    </div>
  );
}




export default Leads;