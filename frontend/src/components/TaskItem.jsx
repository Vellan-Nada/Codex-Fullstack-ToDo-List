function TaskItem({ task, onToggleStatus, onDelete }) {
  const isDone = task.status === 'done';
  const createdAt = task.createdAt || task.created_at || new Date().toISOString();

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        borderLeft: `4px solid ${isDone ? 'var(--color-success)' : 'var(--color-primary)'}`
      }}
    >
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, textDecoration: isDone ? 'line-through' : 'none' }}>{task.title}</h4>
        {task.notes && (
          <p style={{ marginTop: '0.5rem', color: 'var(--color-muted)' }}>{task.notes}</p>
        )}
        <small style={{ color: 'var(--color-muted)' }}>{new Date(createdAt).toLocaleString()}</small>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="btn btn-outline" type="button" onClick={() => onToggleStatus(task)}>
          {isDone ? 'Mark todo' : 'Mark done'}
        </button>
        <button className="btn btn-outline" type="button" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
