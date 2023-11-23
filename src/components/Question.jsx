import React from 'react';
import Option from './Option';
import { v4 as uuidv4 } from 'uuid';

const Question = ({
  id,
  displayNumber,
  questionContent,
  removeQuestionFunction,
  removeQuestionDisabled,
  changeQuestions,
  removeOptionFunction,
  removeOptionDisabled,
  addOptionFunction,
  btnAddOptionDisabled,
  optionsContent,
  updateOptionsFunction,
  invalidQuestions
}) => {
  const optionKeys = optionsContent.map((_, i) => `option_${id}_${i}`);

  const handleRemoveOption = (optionIndex) => {
    removeOptionFunction(optionIndex, displayNumber - 1);
  };

  const addOption = () => {
    addOptionFunction(displayNumber - 1);
  };

  const handleOptionUpdate = (optionId, updatedContent) => {
    updateOptionsFunction(optionId, updatedContent, id);
  };

  const handleQuestionChange = (event) => {
    changeQuestions(event.target.value, displayNumber - 1);
  };
  
  return (
    <div>
      {/* Question header and input */}
      <h2 style={{ marginTop: '2rem', textAlign: 'center' }}>Question {displayNumber}</h2>
      <input
        id={id}
        value={questionContent}
        className={`form-control bg-secondary text-black ${invalidQuestions.includes(id) ? 'error' : ''}`}
        placeholder={`Question ${displayNumber}`}
        style={{ margin: 'auto', marginTop: '2rem', marginBottom: '2rem', width: '90%', fontWeight: 'bold', ...(invalidQuestions.includes(id) ? errorStyle : {}) }}
        onChange={handleQuestionChange}
      />

      {/* Loading options from state array */}
      {Array.isArray(optionsContent) &&
        optionsContent.map((option, i) => (
          <Option
            key={optionKeys[i]}
            id={i}
            displayNumber={displayNumber}
            content={option}
            deleteOptionFunction={handleRemoveOption}
            deleteOptionDisabled={removeOptionDisabled}
            updateOptionFunction={(optionId, updatedContent) =>
              handleOptionUpdate(optionId, updatedContent, i)
            }
          />
        ))}

      {/* Button to add more options (active if max of 6 options is not reached) */}
      {btnAddOptionDisabled ? (
        <button
          disabled
          onClick={() => addOption(displayNumber - 1)}
          type='button'
          className='btn btn-dark'
          style={{ marginLeft: '3rem', marginBottom: '6rem', width: '7rem' }}
        >
          Add option
        </button>
      ) : (
        <button
          onClick={() => addOption(displayNumber - 1)}
          type='button'
          className='btn btn-dark'
          style={{ marginLeft: '3rem', marginBottom: '6rem', width: '7rem' }}
        >
          Add option
        </button>
      )}

      {/* Button to remove current question */}
      {removeQuestionDisabled ? (
        <button
          disabled
          type='button'
          className='btn btn-danger text-white'
          onClick={() => removeQuestionFunction(id)}
          style={{
            width: '60%',
          }}
        >
          Remove Question
        </button>
      ) : (
        <button
          type='button'
          className='btn btn-danger text-white'
          onClick={() => removeQuestionFunction(id)}
          style={{
            width: '60%',
          }}
        >
          Remove Question
        </button>
      )}
    </div>
  );
};

export default Question;
