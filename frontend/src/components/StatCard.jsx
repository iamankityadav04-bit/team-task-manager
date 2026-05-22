const StatCard = ({ icon: Icon, label, value, accent = 'bg-brand/10 text-brand' }) => (
  <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-muted">{label}</p>
        <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      </div>
      <div className={`grid h-11 w-11 place-items-center rounded-md ${accent}`}>{Icon && <Icon size={22} />}</div>
    </div>
  </div>
);

export default StatCard;
