import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";

const COLUMNS = [
  { key: "yet_to_start", label: "Yet To Start" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openAddModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSave = async (payload) => {
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask.id}`, payload);
        setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      } else {
        const { data } = await api.post("/tasks", payload);
        setTasks((prev) => [data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1>Taskify</h1>
        <div className="topbar-actions">
          <button className="btn-outline" onClick={openAddModal}>
            Add Task
          </button>
          <button className="btn-icon" title={user?.name} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading tasks...</p>
      ) : (
        <div className="board">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div className="column" key={col.key}>
                <div className="column-header">{col.label}</div>
                {colTasks.length === 0 && (
                  <p className="empty-column">No tasks</p>
                )}
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <TaskModal
          initialTask={editingTask}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
