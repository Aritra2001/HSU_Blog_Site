import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import heroBg from '../../assets/heroBg.png'; // Import the background image
import PopularAudio from '../../components/PopularAudio/PopularAudio';
import './AudioBookDetail.css';

function AudioBookDetail() {
  const { id } = useParams();
  const [audioBook, setAudioBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchAudioBook = async () => {
      try {
        const response = await axios.get(`https://hsu-blog-site.onrender.com/api/getAudioBook/${id}`);
        setAudioBook(response.data.audiobook);
        setLikes(response.data.audiobook.likes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching audio book details:', error);
        setError('Failed to load audiobook details. Please try again later.');
        setLoading(false);
      }
    };

    fetchAudioBook();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.post(`https://hsu-blog-site.onrender.com/api/audiobooklikes/${id}`);
      setLikes(likes + 1);
      setLiked(true);
    } catch (error) {
      console.error('Error liking the audio book:', error);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!audioBook) {
    return <div>Audio book not found.</div>;
  }

  const skillsArray = Array.isArray(audioBook.skills)
    ? audioBook.skills
    : audioBook.skills.split(',').map(skill => skill.trim());

  return (
    <div className="audio-book-detail">
      <div className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <img src={audioBook.audioBookPoster} alt={`${audioBook.AudioBookName} Poster`} className="banner-img" />
        <div className="hero-text">
          <h1>{audioBook.AudioBookName}</h1>
          <p style={{color:"white",textAlign:"left"}}><strong>Written By :</strong>{audioBook.AuthorName}</p>
          <div className="like-section">
            <button 
              className={`like-button ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={liked}
            >
              <i className={`fa${liked ? 's' : 'r'} fa-thumbs-up`}></i> {likes}
            </button>
          </div>
        </div>
      </div>
      <div className="details-section">
        <div className="summary">
          <h2>Summary</h2>
          <p>{audioBook.description}</p>
        </div>
        <div className="skills">
          <h2>What You Will Learn</h2>
          <ul style={{ width: "6rem",textAlign:"left"}}>
            {skillsArray.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
      <audio controls className="audio-player">
        <source src={audioBook.audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="popular">
        <p >Popular</p>
      <PopularAudio/>
      </div>
    </div>
  );
}

export default AudioBookDetail;
