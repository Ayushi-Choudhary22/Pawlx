const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`card p-5 ${hoverable ? 'transition-shadow hover:shadow-cardHover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
