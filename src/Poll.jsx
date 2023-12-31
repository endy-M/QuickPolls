import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';
import img from './img/quick-polls-blue-logo.png';

const Result = ({ question, totalVotes, selectedOptions }) => {
  const maxVotes = Math.max(...question.options.map((option) => option.votes));

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '2rem',
        }}
      >
        {question.content}
      </h2>
      <ul className='list-group' style={{ margin: '2rem', marginLeft: "10%", marginRight: "10%" }}>
        {question.options.map((option, index) => (
          <li
            key={index}
            className='list-group-item'
            style={{
              backgroundColor: '#76aece',
              fontSize: '1.1rem',
              fontWeight: option.votes === maxVotes ? 'bold' : 'normal',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{option.content}</span>
              <span>
                Votes: {option.votes} ({((option.votes / totalVotes) * 100).toFixed(2)}%)
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function Poll() {
  const { id } = useParams();
  const [pollres, setPollres] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [viewResults, setViewResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await Axios.get(`http://localhost:443/getPolls/${id}`);
      console.log('Fetched data:', response.data);
      setPollres(response.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching poll:', error);
      setLoading(false); // Set loading to false on error as well
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initial poll data
  }, [id]);

  useEffect(() => {
    // Fetch updated poll data after submitting votes
    if (submitted) {
      fetchData();
    }
  }, [id, submitted]);

  if (!pollres) {
    // Handle loading state if needed
    return <div>Loading...</div>;
  }

  const totalVotesForQuestion = (questionIndex) => {
    return pollres.questions[questionIndex].options.reduce(
      (sum, option) => sum + option.votes,
      0
    );
  };

  const handleSubmit = () => {
    if (selectedOptions.length < pollres.questions.length) {
      toast.error('Please select an option for each question.');
      return;
    }

    // Make a request to update votes for selected options
    const updatedPoll = {
      pollid: id,
      selectedOptions: selectedOptions,
    };

    Axios.post(`http://localhost:443/submitPoll`, updatedPoll)
      .then((response) => {
        toast.success('Poll submitted successfully!');
        setSubmitted(true);
      })
      .catch((error) => {
        console.error('Error submitting poll:', error);
      });
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = [...prevSelectedOptions];
      newSelectedOptions[questionIndex] = optionIndex;
      return newSelectedOptions;
    });
  };

  const handleViewResults = () => {
    setViewResults(true);
  };

  const handleBackToVoting = () => {
    setViewResults(false);
  };

  return (
    <div className='App'>
      {/* Logo */}
      <img
        className='logo'
        src={img}
        alt='Quick Polls logo'
      />

      <div className='home-button-div'>
        <button
          type='button'
          className='btn-home btn btn-primary'
        >
          <a
            href="http://localhost:5173"
            className='link-light link-underline-opacity-0'
          >
            Home/Create Poll
          </a>
        </button>
      </div>

      {/* Main part */}
      <div className='main-card-poll card bg-primary'>
        {loading ? (
          <div>Loading...</div>
        ) : viewResults ? (
          <>
            {pollres?.questions?.map((question, i) => (
              <div key={pollres._id + i}>
                <Result
                  key={pollres._id + i}
                  question={question}
                  totalVotes={totalVotesForQuestion(i)}
                  selectedOptions={selectedOptions}
                />
              </div>
            ))}
            <div style={{ width: "20%", marginLeft: '44%', marginTop: '2.5rem', marginBottom: '2rem' }}>
              <button
                onClick={handleBackToVoting}
                className='btn-back-to-voting btn btn-dark'
                style={{ fontSize: "1.4rem", fontWeight: "bold" }}
              >
                Back to Voting
              </button>
            </div>
          </>
        ) : (
          <>
            {pollres?.questions?.map((question, i) => (
              <div key={pollres._id + i}>
                <h2
                  className='question-header'
                >
                  {question.content}
                </h2>
                <ul className='list-group' style={{ margin: '2rem', marginLeft: "10%", marginRight: "10%" }}>
                  {question.options.map((option, index) => (
                    <li
                      key={index + i}
                      className='option-item list-group-item'
                      onClick={() => handleOptionSelect(i, index)}
                      style={{ backgroundColor: "#76aece" }}
                    >
                      <input
                        className='form-check-input list-group-item-dark me-2'
                        name={`listGroupRadio${i}`}
                        id={`${i}-${index}`}
                        type='radio'
                      />
                      <label
                        className='form-check-label stretched-link'
                        htmlFor={`${i}-${index}`}
                      >
                        {option.content}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div
              className='div-submit'
            >
              {submitted ? (
                <button
                  disabled
                  className='btn-submit btn btn-dark'
                  onClick={handleSubmit}
                  type='button'
                  style={{ fontSize: "1.4rem", fontWeight: "bold" }}
                >
                  Submit
                </button>
              ) : (
                <button
                  className='btn-submit btn btn-dark'
                  onClick={handleSubmit}
                  type='button'
                  style={{ fontSize: "1.4rem", fontWeight: "bold" }}
                >
                  Submit
                </button>
              )}

              <button
                onClick={handleViewResults}
                className='btn-view-results btn btn-dark'
                style={{ fontSize: "1.4rem", fontWeight: "bold" }}
              >
                View Results
              </button>
            </div>
          </>
        )}
      </div>

      <div
        className='footer bg-primary'
      >
        © 2023 Copyright: QuickPolls. All rights reserved
      </div>
    </div>
  );
}

export default Poll;
