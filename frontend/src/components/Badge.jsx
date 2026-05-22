import clsx from 'clsx';

const variants = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  LOW: 'bg-teal-100 text-teal-700',
  MEDIUM: 'bg-amber-100 text-amber-800',
  HIGH: 'bg-rose-100 text-rose-700',
  ADMIN: 'bg-ink text-white',
  MEMBER: 'bg-slate-100 text-slate-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PLANNING: 'bg-blue-100 text-blue-700',
  ON_HOLD: 'bg-amber-100 text-amber-800'
};

const Badge = ({ children, tone }) => (
  <span className={clsx('inline-flex rounded-full px-2.5 py-1 text-xs font-bold', variants[tone] || 'bg-slate-100 text-slate-700')}>
    {children}
  </span>
);

export default Badge;
