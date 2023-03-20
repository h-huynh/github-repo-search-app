import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [language, setLanguage] = useState('');
  const [topRepos, setTopRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!language) return;
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/${encodeURIComponent(language)}`);
        setTopRepos(response.data);
      } catch (error) {
        console.error(error);
        setTopRepos(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLanguage(event.target.elements.language.value);
    //console.log(process.env.REACT_APP_API_URL);
  };

  return (
    <div>
      <header>
        <h1>Top 5 Repositories by Language</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label htmlFor="language">Enter a programming language:</label>
          <input
            type="text"
            id="language"
            defaultValue={language}
          />
          <button type="submit">Search</button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : !topRepos ? (
          <p>No results found.</p>
        ) : (
          <div className="grid-container">
            {topRepos.map((repo) => (
              <div key={repo.id} className="grid-item">
                <h2>{repo.name}</h2>
                <p>{repo.description}</p>
                <div className="tags">
                  {repo.topics.map((topic, index) => (
                    <div key={index}>
                      <b className="tag" href='#'>
                        {topic}
                      </b>
                    </div>
                  ))}
                </div>
                <div className="grid-bottom">
                  <p className='count'>★ {repo.stargazers_count}</p>
                  <a href={repo.html_url}>View on GitHub</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
