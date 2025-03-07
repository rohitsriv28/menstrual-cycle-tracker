const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
}) => {
  const baseStyles = "px-4 py-2 rounded-lg transition focus:outline-none";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled ? disabledStyles : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
