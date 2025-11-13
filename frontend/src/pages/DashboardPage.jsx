import TaskComposer from '../components/TaskComposer.jsx';
import TaskList from '../components/TaskList.jsx';
import PlanProgress from '../components/PlanProgress.jsx';
import UpgradeCallout from '../components/UpgradeCallout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../hooks/useTasks.js';

function DashboardPage() {
  const { user, session, plan } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask, limit, remaining, pendingAction } = useTasks({
    plan,
    session,
    user
  });

  const handleCreateTask = async (payload) => {
    try {
      await createTask({ ...payload, status: 'todo' });
    } catch (err) {
      console.warn('[Dashboard] failed to create task', err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      await updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
    } catch (err) {
      console.warn('[Dashboard] failed to update task', err);
    }
  };

  return (
    <main className="container dashboard-grid" style={{ padding: '3rem 0' }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <TaskComposer
          onSubmit={handleCreateTask}
          disabled={remaining === 0 || pendingAction}
          remaining={remaining}
          pending={pendingAction}
        />
        {error && (
          <div className="card" style={{ border: '1px solid #fecaca', background: '#fef2f2', color: '#b91c1c' }}>
            {error}
          </div>
        )}
        {loading ? (
          <div className="card" style={{ textAlign: 'center' }}>Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onDelete={async (taskId) => {
              try {
                await deleteTask(taskId);
              } catch (err) {
                console.warn('[Dashboard] failed to delete task', err);
              }
            }}
          />
        )}
      </section>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <PlanProgress used={tasks.length} limit={limit} plan={plan} />
        {plan === 'free' && <UpgradeCallout />}
        <div className="card">
          <h3>Supabase session</h3>
          <p style={{ wordBreak: 'break-all', color: 'var(--color-muted)' }}>{user?.email}</p>
        </div>
      </aside>
    </main>
  );
}

export default DashboardPage;
