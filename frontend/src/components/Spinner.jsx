const Spinner = ({ fullScreen = false }) => (
  <div className={fullScreen ? 'grid min-h-screen place-items-center bg-slate-50' : 'grid min-h-48 place-items-center'}>
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
  </div>
);

export default Spinner;
