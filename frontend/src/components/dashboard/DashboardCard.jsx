const DashboardCard = ({ icon, label, value, accent = 'primary' }) => {
  const accentClasses = {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary-light text-secondary',
    accent: 'bg-accent-light text-accent',
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="text-xl font-bold text-ink">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
