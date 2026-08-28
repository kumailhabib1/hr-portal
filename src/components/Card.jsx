function Card({
  children,
  className = "",
  as: Component = "div",
  interactive = false,
}) {
  return (
    <Component
      className={`portal-card ${interactive ? "portal-card-interactive" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}

export default Card;
