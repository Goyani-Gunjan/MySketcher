// eslint-disable-next-line react/prop-types
function GeometryList({ type : Type, title , classes ,onClick }) {
  return (
    <button className={`${classes} cursor-pointer hover:bg-gray-300 `} onClick={onClick}>
      <div className="text-2xl mr-1 flex items-center justify-center">
        <Type />
      </div>
       <div className="text-lg mr-1 flex items-center justify-center">{title}</div> {/* Show name */}
      </button>
  );
}

// ✅ Update PropTypes to include 'type'

export default GeometryList;
