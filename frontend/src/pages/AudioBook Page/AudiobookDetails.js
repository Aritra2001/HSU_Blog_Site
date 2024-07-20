import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { useParams } from 'react-router-dom';
import heroBg from '../../assets/HeroBg.svg';
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
      if (liked) {
        await axios.post(`https://hsu-blog-site.onrender.com/api/audiobooklikes/${id}`);
        setLikes(likes - 1);
      } else {
        await axios.post(`https://hsu-blog-site.onrender.com/api/audiobooklikes/${id}`);
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking/unliking the audio book:', error);
    }
  };

  useEffect(() => {
    // Update audio element when audioBook changes
    if (audioBook) {
      const audioPlayer = document.getElementById('audio');
      if (audioPlayer) {
        audioPlayer.src = audioBook.audio;
        audioPlayer.load();
        audioPlayer.muted=false
        // Check if user has interacted with the page
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Autoplay started successfully
          }).catch((error) => {
            console.error('Autoplay could not start:', error);
            // Handle autoplay restriction: show a play button or instructions to user
          });
        }
      }
    }
  }, [audioBook]);

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
      <div className="hero-section">
        <div className="hero-bg">
          <img src={heroBg} alt="Background" className="hero-bg-img" />
        </div>
        <img src={audioBook.audioBookPoster} alt={`${audioBook.AudioBookName} Poster`} className="banner-img" />
        <div className="hero-text">
          <h1 className='AudioName'>{audioBook.AudioBookName}</h1>
          <p className='AudioText' ><strong>Written By   </strong>{audioBook.AuthorName}</p>
          <p className='AudioText'  ><strong>Duration   </strong>{Math.round(audioBook.duration)} Minutes</p>
          <p className='AudioText' style={{display:'flex'}} ><strong style={{top:"0.2rem",position:"relative"}}>Share</strong>
          <RiShareForwardLine style={{fontSize:"1.6rem",marginTop:"0.2rem"}} /></p>
          <div className="like-section">
            <button 
              className={`like-button ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              style={{display:"flex",gap:"0.3rem"}}
            >{liked?<BiSolidLike/>:
             <BiLike/>}{likes}likes
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
          <ul style={{ width: "100%", textAlign: "left" ,fontSize:"17px",color:"#2E2E2E"}}>
          {skillsArray.map((skill, index) => (
              <li key={index}>
                <FaCheckCircle style={{left:"-1rem",position:"relative"}}/> {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="audio-control-section">
        <img src={audioBook.audioBookPoster} alt={`${audioBook.AudioBookName} Poster`} className="banner-img-small" />
        {/* Audio element for visible controls */}
        <audio controls autoPlay className="audio-player" id="audio" muted >
          <source src={audioBook.audio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className="popular">
        <p>Popular</p>
        <PopularAudio />
      </div>
    </div>
  );
}

export default AudioBookDetail;
