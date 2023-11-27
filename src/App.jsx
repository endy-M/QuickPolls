import { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Question from './components/Question';
import { toast } from 'react-toastify';
import copy from "copy-to-clipboard";
import img from './img/quick-polls-blue-logo.png';

function App() {
  // Inputs validation
  const isQuestionContentValid = (content) => content.trim() !== '';

  const areOptionsValid = (options) => {
    return options.length >= 2 && options.length <= 6 && options.every(option => option.trim() !== '');
  };

  // Error state
  const [errorMessages, setErrorMessages] = useState([]);

  const errorStyle = {
    border: '1px solid red',
  };

  const [invalidQuestions, setInvalidQuestions] = useState([]);

  const hasValidationErrors = () => {
    return invalidQuestions.length > 0;
  };

  // States for active state of adding and removing questions and options buttons
  const [btnAddQuestionDisabled, setBtnAddQuestionDisabled] = useState(false);
  const [btnRemoveQuestionDisabled, setBtnRemoveQuestionDisabled] = useState(false);

  const [btnAddOptionDisabled, setBtnAddOptionDisabled] = useState([false]);
  const [btnRemoveOptionDisabled, setBtnRemoveOptionDisabled] = useState([false]);

  // State for managing option add and remove button active state
  let optionOperations = 0;

  // States containing questions and options content
  const [questions, setQuestions] = useState([{ id: uuidv4(), content: '' }]);
  const [options, setOptions] = useState(Array.from({ length: 1 }, () => ['', '']));

  // States for final values to be sent to DataBase
  const [dbId, setDbId] = useState(uuidv4()); 
  const [dbQuestions, setDbQuestions] = useState([]);
  const [dbOptions, setDbOptions] = useState([[]]);

  // State for showing copy link
  const [finished, setFinished] = useState(false);
  
  const link = `https://quickpolls-mkzv.onrender.com/poll/${dbId}`;

  // Functions for handling adding and removing questions and options actions
  const handleRemoveQuestion = (idQ) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((question) => question.id !== idQ);
      setQuestions(newQuestions);
    }
  };

  const handleRemoveOption = (optionIndex, questionIndex) => {
    if(options[questionIndex].length > 2){
        const newOptions = options[questionIndex].filter((_, index) => index !== optionIndex);
        const newArr = [...options];
        newArr[questionIndex] = newOptions;
        setOptions(newArr);
    }

    optionOperations++;
  }
  
  const handleAddQuestion = () => {
    if (questions.length < 10) {
      const newQuestion = { id: uuidv4(), content: '' };
      setQuestions([...questions, newQuestion]);
      setOptions((prevOptions) => [...prevOptions, ['', '']]);
    }
  };

  const handleAddOption = (questionIndex) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      if (newOptions[questionIndex].length < 6) {
        newOptions[questionIndex] = [
          ...newOptions[questionIndex],
          '',
        ];
      }
      return newOptions;
    });
  
    optionOperations++;
  };

  const handleQuestionUpdate = (value, questionIndex) => {
    setErrorMessages([]);
    const newQuestions = [...questions];
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], content: value };
    setQuestions(newQuestions);
  };

  const handleOptionUpdate = (optionId, updatedContent, questionIndex) => {
    setErrorMessages([]);
    setOptions((prevOptions) => {
        const newOptions = [...prevOptions];
        newOptions[questionIndex] = newOptions[questionIndex].map((content, index) =>
            index === optionId ? updatedContent : content
        );
        return newOptions;
    });
  };

  // Setting button active state based on questions and options count
  useEffect(() => {
    setBtnAddQuestionDisabled(questions.length >= 10);
    setBtnRemoveQuestionDisabled(questions.length <= 1);

    setBtnAddOptionDisabled(() =>
        questions.map((_, i) => options[i].length >= 6)
    );

    setBtnRemoveOptionDisabled(() =>
        questions.map((_, i) => options[i].length <= 2)
    );
  }, [questions.length, options]);

  const copyToClipboard = () => {
    let isCopy = copy(link);
    if (isCopy) {
      toast.success("Copied to Clipboard");
    }
  };

  const finishPoll = () => {
    // Validate questions
    const invalidQuestions = questions.filter(question => !isQuestionContentValid(question.content));
  
    // Validate options
    const invalidOptions = options.filter(optionSet => !areOptionsValid(optionSet));
  
    const hasValidationErrors = invalidQuestions.length > 0 || invalidOptions.length > 0;
  
    if (hasValidationErrors) {
      toast.error("Please correct the highlighted errors before finishing the poll.");
      return;
    }
  
    setFinished(true);

    // Create questions array in the required format
    const formattedQuestions = questions.map((question, i) => ({
      content: question.content,
      options: options[i].map((option) => ({ content: option, votes: 0 })),
    }));
  
    axios.post("https://quickpolls-api.onrender.com/createPoll", {
      pollid: dbId.toString(),
      questions: formattedQuestions,
    }).then((response) => {
      toast.success("Poll finished and saved!");
    });
  };  

  return (
    <div className='App bg-dark' style={{ display: 'grid', minHeight: "100vh", height: "100vh", minWidth: "100vw", width: "100vw", margin: "0px", backgroundAttachment: "fixed", backgroundSize: "cover" }}>
      {/* Logo */}
      <img
        src={img}
        style={{width: "15rem", margin: "auto", marginTop: "3rem"}}
        alt='Quick Polls logo'
      />

      {/* Display error messages */}
      {errorMessages.length > 0 && (
        <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
          <ul>
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main part */}
      <div
        className='card bg-primary'
        style={{width: "45rem", margin: "auto", marginTop: "4.1rem", marginBottom: "6rem"}}
      >

        {/* Loading questions from state array */}
        {questions.map((question, i) => (
          <Question 
            key={`question_${question.id}`}
            id={question.id}
            questionContent={question.content}
            displayNumber={i + 1}
            removeQuestionFunction={handleRemoveQuestion}
            removeQuestionDisabled={btnRemoveQuestionDisabled}
            changeQuestions={handleQuestionUpdate}
            removeOptionFunction={handleRemoveOption}
            removeOptionDisabled={btnRemoveOptionDisabled[i]}
            addOptionFunction={handleAddOption}
            btnAddOptionDisabled={btnAddOptionDisabled[i]}
            optionsContent={options[i]}
            updateOptionsFunction={(optionId, updatedContent) => handleOptionUpdate(optionId, updatedContent, i)}
            invalidQuestions={invalidQuestions}
          />
        ))}

        { /* Button to add more questions (active if the max of 10 questions is not reached) */}
        {btnAddQuestionDisabled ?
          <button
            disabled
            onClick={handleAddQuestion}
            type='button'
            className='btn btn-dark'
            style={{width: '80%', margin: 'auto', marginTop: '1rem', marginBottom: '2rem'}}
          >
            Add Question
          </button>
          :
          <button
            onClick={handleAddQuestion}
            type='button'
            className='btn btn-dark'
            style={{width: '80%', margin: 'auto', marginTop: '1rem', marginBottom: '2rem'}}
          >
            Add Question
          </button>
        }
        
        {/*
        <input
          className='form-control bg-secondary text-black'
          placeholder='Poll password'
          style={{margin: "auto", marginTop: "2rem", marginBottom: "0.5rem", width: "30%", textAlign: "center"}}
        />
        */}

        {/* Button to finish poll (active only once to preserve data from being sent multiple times) */}
        {finished ?
          <button
            disabled
            onClick={() => {
              finishPoll();
            }}
            type='button'
            className='btn btn-dark'
            style={{
              width: '90%',
              margin: 'auto',
              marginTop: '1rem',
              marginBottom: '2rem',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            Finish Poll
          </button>
        :
          <button
            onClick={() => {
              finishPoll();
            }}
            type='button'
            className='btn btn-dark'
            style={{
              width: '90%',
              margin: 'auto',
              marginTop: '1rem',
              marginBottom: '2rem',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            Finish Poll
          </button>
        }
        

        {/* Container with link active when poll is finished */}
        {finished ?
          <div className='card bg-secondary' style={{ width: "85%", margin: "auto", marginTop: "1rem", marginBottom: "2rem", padding: '1rem', fontSize: '1.1rem' }}>
          <a className='link-dark' href={link} style={{ margin: 'auto' }}>{link}</a>
          <button onClick={() => copyToClipboard()} style={{ width: '6rem', margin: 'auto', marginTop: '1rem' }} type='button' className='btn btn-dark'>Copy</button>
        </div>
        :
          <></>
        }
        
      </div>

      {/* Footer */}
      <div className='bg-primary' style={{textAlign: 'center', fontSize: '1.05rem',
        padding: '0.3rem', display: 'flex', flexDirection: 'column-reverse'}}
      >© 2023 Copyright: QuickPolls. All rights reserved</div>
    </div>
  );
}

export default App;
