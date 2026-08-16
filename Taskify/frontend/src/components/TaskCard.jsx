export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <p className="task-title">{task.title}</p>
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-card-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
