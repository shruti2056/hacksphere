import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import HackathonFormModal from "../components/HackathonFormModal.jsx";
import SubmissionEditModal from "../components/SubmissionEditModal.jsx";

const registrationStatuses = ["Approved", "Rejected"];
const hackathonStatuses = ["Draft", "Upcoming", "Registration Open", "Registration Closed", "Ongoing", "Completed"];

const tabs = ["registrations", "judges", "submissions", "settings"];

const ManageHackathon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [judges, setJudges] = useState([]);
  const [tab, setTab] = useState("registrations");
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [hRes, regRes, subRes, judgeRes] = await Promise.all([
        api.get(`/hackathons/${id}`),
        api.get(`/registrations/hackathon/${id}`),
        api.get(`/submissions/hackathon/${id}`),
        api.get(`/users/judges/all`),
      ]);
      setHackathon(hRes.data.hackathon);
      setRegistrations(regRes.data.registrations);
      setSubmissions(subRes.data.submissions);
      setJudges(judgeRes.data.judges);
    } catch {
      toast.error("Could not load hackathon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { data } = await api.put(`/hackathons/${id}/registration`, { status: newStatus });
      setHackathon(data.hackathon);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  };

  const handleRegistrationDecision = async (regId, status) => {
    try {
      await api.put(`/registrations/${regId}/status`, { status });
      toast.success(`Registration ${status.toLowerCase()}`);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update registration");
    }
  };

  const toggleJudge = async (judgeId) => {
    const current = hackathon.judges.map((j) => j._id || j);
    const next = current.includes(judgeId) ? current.filter((j) => j !== judgeId) : [...current, judgeId];
    try {
      const { data } = await api.put(`/hackathons/${id}/judges`, { judgeIds: next });
      setHackathon(data.hackathon);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update judges");
    }
  };

  const handleSubmissionStatus = async (subId, status) => {
    try {
      await api.put(`/submissions/${subId}/status`, { status });
      toast.success("Submission status updated");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update submission");
    }
  };

  const handlePublishResults = async () => {
    if (!confirm("Publish results and mark hackathon as completed?")) return;
    try {
      const { data } = await api.put(`/hackathons/${id}/publish-results`);
      setHackathon(data.hackathon);
      toast.success("Results published!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not publish results");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this hackathon permanently? This cannot be undone.")) return;
    try {
      await api.delete(`/hackathons/${id}`);
      toast.success("Hackathon deleted");
      navigate("/dashboard/organizer");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete hackathon");
    }
  };

  if (loading) return <Loader />;
  if (!hackathon) return null;

  const assignedJudgeIds = (hackathon.judges || []).map((j) => j._id || j);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/dashboard/organizer" className="text-sm text-ink-muted hover:text-accent">
        ← Back to dashboard
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-8">
        <div>
          <p className="eyebrow">{hackathon.theme}</p>
          <h1 className="font-display font-bold text-3xl mt-1">{hackathon.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="input w-auto"
            value={hackathon.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
          >
            {hackathonStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={() => setShowEdit(true)} className="btn-outline">
            Edit
          </button>
          <button onClick={handlePublishResults} disabled={hackathon.resultsPublished} className="btn-accent">
            {hackathon.resultsPublished ? "Results Published" : "Publish Results"}
          </button>
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="flex gap-6 border-b border-border mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-accent text-accent" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t} {t === "registrations" && `(${registrations.length})`}
            {t === "submissions" && `(${submissions.length})`}
          </button>
        ))}
      </div>

      {tab === "registrations" &&
        (registrations.length === 0 ? (
          <EmptyState title="No registrations yet" />
        ) : (
          <div className="space-y-3">
            {registrations.map((r) => (
              <div key={r._id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{r.team?.name}</p>
                  <p className="text-xs text-ink-muted">
                    Leader: {r.team?.leader?.name} · {r.team?.members?.length} member(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`badge ${
                      r.status === "Approved"
                        ? "bg-success/15 text-success"
                        : r.status === "Rejected"
                        ? "bg-danger/15 text-danger"
                        : "bg-warning/15 text-warning"
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.status === "Pending" && (
                    <>
                      <button onClick={() => handleRegistrationDecision(r._id, "Approved")} className="btn-outline text-xs px-3 py-1.5">
                        Approve
                      </button>
                      <button onClick={() => handleRegistrationDecision(r._id, "Rejected")} className="btn-danger text-xs px-3 py-1.5">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

      {tab === "judges" &&
        (judges.length === 0 ? (
          <EmptyState title="No judge accounts exist yet" description="Ask an administrator to create judge accounts." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {judges.map((j) => (
              <label key={j._id} className="card p-4 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignedJudgeIds.includes(j._id)}
                  onChange={() => toggleJudge(j._id)}
                  className="accent-accent h-4 w-4"
                />
                <div>
                  <p className="font-medium text-sm">{j.name}</p>
                  <p className="text-xs text-ink-muted">{j.email}</p>
                </div>
              </label>
            ))}
          </div>
        ))}

      {tab === "submissions" &&
        (submissions.length === 0 ? (
          <EmptyState title="No submissions yet" />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {submissions.map((s) => (
              <div key={s._id} className="card p-4">
                <p className="font-display font-semibold">{s.projectName}</p>
                <p className="text-xs text-ink-muted mt-1">Team: {s.team?.name}</p>
                <div className="flex gap-2 mt-3">
                  <select
                    className="input flex-1"
                    value={s.status}
                    onChange={(e) => handleSubmissionStatus(s._id, e.target.value)}
                  >
                    {["Pending", "Under Review", "Approved", "Rejected"].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => setEditingSubmission(s)} className="btn-outline text-xs px-3">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {tab === "settings" && (
        <div className="card p-6 max-w-md">
          <p className="text-sm text-ink-muted mb-4">
            Use the buttons above to edit hackathon details, publish results, or permanently delete this
            hackathon.
          </p>
          <p className="text-xs text-ink-faint">Slug: {hackathon.slug}</p>
        </div>
      )}

      {showEdit && (
        <HackathonFormModal
          hackathon={hackathon}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            toast.success("Hackathon updated");
            loadAll();
          }}
        />
      )}

      {editingSubmission && (
        <SubmissionEditModal
          submission={editingSubmission}
          onClose={() => setEditingSubmission(null)}
          onSaved={() => {
            setEditingSubmission(null);
            loadAll();
          }}
        />
      )}
    </div>
  );
};

export default ManageHackathon;
