import React, { useState } from 'react';
import { MenuItem, Paper } from '@material-ui/core';
import Autosuggest from 'react-autosuggest';
import ChipInput from 'material-ui-chip-input';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

const suggestions = ['西川', '大田', '近藤', '中田'];

const getSuggestionValue = suggestion => suggestion;

const getSuggestions = ({ value, selected }) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          !selected.includes(suggestion) &&
          suggestion.toLowerCase().slice(0, inputLength) === inputValue;
        if (keep) count += 1;
        return keep;
      });
};

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);
  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      onMouseDown={e => e.preventDefault()}
    >
      {parts.map((part, index) =>
        part.highlight ? (
          <span key={index} style={{ fontWeight: 300 }}>
            {part.text}
          </span>
        ) : (
          <strong key={index} style={{ fontWeight: 500 }}>
            {part.text}
          </strong>
        ),
      )}
    </MenuItem>
  );
};

const renderSuggestionsContainer = ({ containerProps, children }) => (
  <Paper {...containerProps} square>
    {children}
  </Paper>
);

const renderInputComponent = ({
  onChange,
  onAdd,
  onDelete,
  onFocus,
  onBlur,
  onKeyDown,
  chips,
  ref,
}) => (
  <ChipInput
    color="primary"
    onUpdateInput={onChange}
    onAdd={onAdd}
    onDelete={onDelete}
    onFocus={onFocus}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    value={chips}
    inputRef={ref}
    fullWidth
    clearInputValueOnChange
  />
);

function App() {
  const [val, setVal] = useState('');
  const [values, setValues] = useState([]);
  const onAdd = chip => setValues([...values, chip]);
  const onDelete = (chip, index) =>
    setValues(values.filter((val, i) => index !== i));

  const handleSuggestionsFetchRequested = ({ value }) => {
    setValues(getSuggestions({ value, selected: val }));
  };

  const handleSuggestionsClearRequested = () => setValues([]);

  const handletextFieldInputChange = (e, { newValue }) => setVal(newValue);

  return (
    <Autosuggest
      renderInputComponent={renderInputComponent}
      suggestions={values}
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={(e, { suggestionValue }) => {
        onAdd(suggestionValue);
        e.preventDefault();
      }}
      inputProps={{
        chips: values,
        value: val,
        onAdd,
        onDelete,
        onChange: handletextFieldInputChange,
      }}
    />
  );
}

export default App;
