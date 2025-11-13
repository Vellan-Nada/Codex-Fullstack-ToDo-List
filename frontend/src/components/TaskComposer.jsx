import { useState } from 'react';

function TaskComposer({ onSubmit, disabled, remaining, pending = false }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled || !title.trim()) return;
    try {
      await Promise.resolve(onSubmit({ title: title.trim(), notes: notes.trim() }));
      setTitle('');
      setNotes('');
    } catch (error) {
      console.warn('[TaskComposer] failed to create task', error);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>New task</h3>
        <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Remaining: {remaining}</span>
      </div>
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          placeholder="Ship MVP landing page"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="task-notes">Notes</label>
        <textarea
          id="task-notes"
          placeholder="Break work into sub tasks, define timelines"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
      <button className="btn btn-primary" disabled={disabled}>
        {disabled ? 'Task limit reached' : pending ? 'Saving...' : 'Add task'}
      </button>
    </form>
  );
}

export default TaskComposer;
