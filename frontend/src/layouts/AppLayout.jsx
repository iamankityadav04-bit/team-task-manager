import { BarChart3, ClipboardCheck, FolderKanban, LogOut, Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ClipboardCheck }
];

const AppLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-line bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-brand text-white">
          <ClipboardCheck size={21} />
        </span>
        <div>
          <p className="font-bold text-ink">Task Manager</p>
          <p className="text-xs text-muted">Team workspace</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? 'bg-brand text-white' : 'text-muted hover:bg-slate-100 hover:text-ink'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
            <p className="text-xs font-semibold text-muted">{user?.role}</p>
          </div>
        </div>
        <Button variant="secondary" className="w-full" onClick={logout}>
          <LogOut size={17} />
          Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <div className="hidden lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[280px]">{sidebar}</div>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="h-10 w-10 p-0 lg:hidden" onClick={() => setOpen((value) => !value)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </Button>
            <div className="hidden text-sm font-semibold text-muted md:block">
              Plan, assign, and track team delivery
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button onClick={() => navigate('/tasks/new')}>
                <Plus size={17} />
                New Task
              </Button>
            )}
            <Link to="/dashboard" className="hidden sm:block">
              <Avatar user={user} />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
