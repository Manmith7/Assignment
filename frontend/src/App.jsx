import React, { useEffect, useState } from "react";
import Questions from "./component/question";
import "./App.css";
const App = () => {
  const [question, setQuestion] = useState(""); 
  const [filteredQuestions, setFilteredQuestions] = useState([]); 
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const endpoint = question.trim()
          ? `http://localhost:3000/api/data/title/${question}`
          : `http://localhost:3000/api/data/page/${page}`;
  
        const response = await fetch(endpoint);
        const data = await response.json();
  
        if (question.trim()) {
          setFilteredQuestions(data); 
        } else {
          setFilteredQuestions(data.pageResults); 
          setTotalPages(data.totalPages); 
        }
      } catch (error) {
        console.error("Unable to fetch error:", error);
      }
    };
  
    fetchQuestions();
  }, [question, page]);
  

  const handleOnChange = (e) => {
    setQuestion(e.target.value); 
    setPage(1); 
  };

  const handlePageChange = (direction) => {
    setPage((prevPage) => prevPage + direction); 
  };

  return (
    <div className="app">
      <div className="searchPlace">
        <input
          
          type="search"
          onChange={handleOnChange}
          value={question}
          placeholder="Type your question . . . "
          id="searchBar"
        />
        <button type="submit">Search</button>
      </div>

      <Questions questions={filteredQuestions} />

      {!question.trim() && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(-1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
