import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

// Used by organizers/admins to edit the full details of a team's project submission
const SubmissionEditModal = ({ submission, onClose, onSaved }) => {
  const [form, setForm] = useState({
    projectName: submission.projectName || "",
    problemStatement: submission.problemStatement || "",
    solution: submission.solution || "",
    description: submission.description || "",
    githubRepo: submission.githubRepo || "",
    liveDemoUrl: submission.liveDemoUrl || "",
    techStack: (submission.techStack || []).join(", "),
    demoVideoLink: submission.demoVideoLink || "",
    status: submission.status || "Pending",
  });
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const { data } = await api.put(`/submissions/${submission._id}`, payload);
      toast.success("Project updated");
      onSaved(data.submission);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="card w-full max-w-2xl my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display font-bold text-xl mb-1">Edit Project</h2>
        <p className="text-xs text-ink-muted mb-5">Team: {submission.team?.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Project Name</label>
              <input required className="input" value={form.projectName} onChange={update("projectName")} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Problem Statement</label>
              <textarea required rows={2} className="input" value={form.problemStatement} onChange={update("problemStatement")} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Solution</label>
              <textarea required rows={2} className="input" value={form.solution} onChange={update("solution")} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea required rows={3} className="input" value={form.description} onChange={update("description")} />
            </div>
            <div>
              <label className="label">GitHub Repo</label>
              <input required className="input" value={form.githubRepo} onChange={update("githubRepo")} />
            </div>
            <div>
              <label className="label">Live Demo URL</label>
              <input className="input" value={form.liveDemoUrl} onChange={update("liveDemoUrl")} />
            </div>
            <div>
              <label className="label">Demo Video Link</label>
              <input className="input" value={form.demoVideoLink} onChange={update("demoVideoLink")} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={update("status")}>
                {["Pending", "Under Review", "Approved", "Rejected"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Tech Stack (comma separated)</label>
              <input className="input" value={form.techStack} onChange={update("techStack")} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionEditModal;
