const Filter = ({ value, onChange }) => {
  return (
    <div>
      <p>find countries</p>
      <input value={value} onChange={onChange}></input>
    </div>
  );
};

export default Filter;
