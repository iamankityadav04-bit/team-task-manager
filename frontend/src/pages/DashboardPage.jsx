import { AlertTriangle, CheckCircle2, ClipboardList, FolderKanban, Timer } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dashboardApi } from '../api/services';
import PageHeader from '../components/PageHeader';
import Skeleton from '../components/Skeleton';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { useApi } from '../hooks/useApi';

const DashboardPage = () => {
  const { data, loading } = useApi(() => dashboardApi.stats(), [], { toastErrors: false });
  const stats = data?.stats;

  if (loading) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      </>
    );
  }

  const statusData = Object.entries(stats.tasksByStatus).map(([name, value]) => ({ name, value }));
  const priorityData = Object.entries(stats.tasksByPriority).map(([name, value]) => ({ name, value }));

  return (
    <>
      <PageHeader title="Dashboard" eyebrow="Overview">
        Track workload, status, overdue risk, and the latest activity across your accessible projects.
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={FolderKanban} label="Projects" value={stats.totalProjects} accent="bg-blue-100 text-blue-700" />
        <StatCard icon={ClipboardList} label="Tasks" value={stats.totalTasks} accent="bg-slate-100 text-slate-700" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completedTasks} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Timer} label="Pending" value={stats.pendingTasks} accent="bg-amber-100 text-amber-800" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdueTasks} accent="bg-rose-100 text-rose-700" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="mb-4 font-bold text-ink">Tasks by status</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="mb-4 font-bold text-ink">Tasks by priority</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" outerRadius={95} label>
                  {['#14B8A6', '#F59E0B', '#F97373'].map((color) => (
                    <Cell key={color} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="mt-6">
        <h2 className="mb-3 font-bold text-ink">Recent activity</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {stats.recentTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
