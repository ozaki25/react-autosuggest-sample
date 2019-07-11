import React, { useState } from 'react';
import ChipInput from 'material-ui-chip-input';

function App() {
  const [values, setValues] = useState([]);
  const onAdd = chip => setValues([...values, chip]);
  const onDelete = (chip, index) =>
    setValues(values.filter((val, i) => index !== i));
  return (
    <div className="App">
      <ChipInput value={values} onAdd={onAdd} onDelete={onDelete} />
    </div>
  );
}

export default App;
