import { useState } from "react";

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = [
  { value: "yet_to_start", label: "Yet To Start" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function TaskModal({ initialTask, onSave, onClose }) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [priority, setPriority] = useState(initialTask?.priority || "low");
  const [status, setStatus] = useState(initialTask?.status || "yet_to_start");
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initialTask);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ title, description, priority, status });
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="form-row">
            <div>
              <label className="form-label">Select Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Select Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Task" : "Add Task"}
            </button>
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
