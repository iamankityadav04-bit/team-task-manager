const PageHeader = ({ title, eyebrow, actions, children }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-brand">{eyebrow}</p>}
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
      {children && <p className="mt-2 max-w-2xl text-sm text-muted">{children}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
