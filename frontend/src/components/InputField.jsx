const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
  error = "",
  required = false,
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
