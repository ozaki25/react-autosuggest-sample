import React, { useState } from 'react';
import { MenuItem, Paper } from '@material-ui/core';
import Autosuggest from 'react-autosuggest';
import ChipInput from 'material-ui-chip-input';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

const suggestions = ['中田', '中島', '中村'];

const getSuggestionValue = suggestion => suggestion;

const getSuggestions = ({ value, selected }) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        console.log(suggestion);
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
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [selectedChips, setSelectedChips] = useState([]);

  const onAdd = chip => {
    setSelectedChips([...selectedChips, chip]);
  };

  const onDelete = (chip, index) => {
    setSelectedChips(selectedChips.filter((val, i) => index !== i));
  };

  const onChange = (e, { newValue }) => {
    setInputValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setChips(getSuggestions({ value, selected: inputValue }));
  };

  const onSuggestionsClearRequested = () => {
    setChips([]);
  };

  const onSuggestionSelected = (e, { suggestionValue }) => {
    e.preventDefault();
    onAdd(suggestionValue);
  };

  return (
    <Autosuggest
      suggestions={chips}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      renderSuggestion={renderSuggestion}
      renderSuggestionsContainer={renderSuggestionsContainer}
      renderInputComponent={renderInputComponent}
      getSuggestionValue={getSuggestionValue}
      inputProps={{
        chips: selectedChips,
        value: inputValue,
        onAdd,
        onDelete,
        onChange,
      }}
    />
  );
}

export default App;
