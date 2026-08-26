const Loader = ({ size = 32, fullScreen = false }) => {
  const spinner = (
    <div
      className="border-4 border-primary-light border-t-primary rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );

  if (fullScreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{spinner}</div>;
  }

  return spinner;
};

export default Loader;
