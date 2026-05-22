import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ title, message, actionLabel, onAction }) => (
  <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-muted">
      <Inbox size={22} />
    </div>
    <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
    <p className="mx-auto mt-1 max-w-md text-sm text-muted">{message}</p>
    {actionLabel && (
      <Button className="mt-5" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
