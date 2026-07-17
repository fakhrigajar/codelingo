function ThemedButton({ className = "btn btn-primary", children, ...rest }) {
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}

export default ThemedButton;
