import TaskItem from './TaskItem.jsx';

function TaskList({ tasks, onToggleStatus, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
        Nothing here yet. Add your first task to kick things off.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggleStatus={onToggleStatus} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default TaskList;
