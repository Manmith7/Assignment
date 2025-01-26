import React, { useState } from "react";
import "./question.css";

const Questions = ({ questions }) => {
  const [answeredIndex, setAnsweredIndex] = useState(null);
  const [anagramAnswer, setAnagramAnswer] = useState(null);
  const [expandIndex, setExpandIndex] = useState(null);

  function handleAnswer(index) {
    setAnsweredIndex(index); 
  }

  const handleAnagram = (index, solution) => {
    setAnsweredIndex(index); 
    setAnagramAnswer(solution); 
  };

  const expand = (index) => {
    setExpandIndex(expandIndex === index ? null : index);
  };

  return (
    <div className="question-list">
      {questions.length > 0 ? (
        questions.map((q, index) => (
          <div key={index} className="innerBox">
            <p id="question">{q.title}</p>
            <div className={`q-content ${q.type === 'readalong' || q.type === 'contextonly' ? q.type : ''}`}>
              <span id="type">{q.type}</span>
              {q.type === "ANAGRAM" && (
                <>
                  <span id="typeOf">{q.anagramType}</span>
                  <div className={q.anagramType === "WORD" ? "word" : "anagram"}>
                    {q.anagramType === "WORD" ? (
                      <p>{q.blocks.map(block => block.text).join(' ')}</p> // Display full word for "WORD" anagram type
                    ) : (
                      q.blocks.slice(0, expandIndex === index ? q.blocks.length : 2).map((block, blockIndex) => (
                        <p key={blockIndex}>{block.text}</p>
                      ))
                    )}
                  </div>
                  {expandIndex === index && (
                    <>
                      {answeredIndex === index && anagramAnswer && (
                        <p>Answer: {anagramAnswer}</p>
                      )}
                      <button id="submit" onClick={() => handleAnagram(index, q.solution)}>
                        Show Answer
                      </button>
                    </>
                  )}
                  <div className="gap"></div> 
                  <button id="more" onClick={() => expand(index)}>
                    {expandIndex === index ? "Show Less" : "Show More"}
                  </button>
                </>
              )}
              {q.type === "MCQ" && (
                <>
                  {q.options.slice(0, expandIndex === index ? q.options.length : 2).map((option, optionIndex) => (
                    <p
                      key={optionIndex}
                      style={{
                        color:
                          answeredIndex === index && option.isCorrectAnswer
                            ? "green"
                            : "black",
                        fontWeight:
                          answeredIndex === index && option.isCorrectAnswer
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {optionIndex + 1}. {option.text}
                    </p>
                  ))}
                  {expandIndex === index && (
                    <>
                      <button id="submit" onClick={() => handleAnswer(index)}>
                        Show Answer
                      </button>
                    </>
                  )}
                  <div className="gap"></div> 
                  <button id="more" onClick={() => expand(index)}>
                    {expandIndex === index ? "Show Less" : "Show More"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p id="Noques">No questions found.</p>
      )}
    </div>
  );
};

export default Questions;
