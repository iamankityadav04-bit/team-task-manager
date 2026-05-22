import { ClipboardCheck } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-white/10">
            <ClipboardCheck size={22} />
          </span>
          Team Task Manager
        </div>
        <div>
          <p className="max-w-lg text-4xl font-bold leading-tight">Plan projects, assign work, and keep delivery visible.</p>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
            A focused workspace for admins and members with project boards, task ownership, and practical progress tracking.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {['Projects', 'Kanban', 'Analytics'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4 font-semibold">
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center p-5">
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
