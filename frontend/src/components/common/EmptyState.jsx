const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {icon && <div className="mb-4 text-ink-muted">{icon}</div>}
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
