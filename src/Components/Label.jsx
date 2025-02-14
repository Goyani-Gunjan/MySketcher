import PropTypes from "prop-types";

const Label = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold">{label}</span>
    <input
      type="number"
      value={value}
      className="bg-gray-100 p-2 rounded-md border"
      readOnly
    />
  </div>
);

Label.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default Label;
