const FormField = ({ label, error, children }) => (
  <label className="block">
    <span className="label">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
  </label>
);

export default FormField;
