import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import { useParams } from 'react-router-dom';
import heroBg from '../../assets/HeroBg.svg';

import PopularAudio from '../../components/PopularAudio/PopularAudio';
import PopularResources from '../../components/PopularResources/PopularResources';
import './ResourceDetails.css';

function ResourceDetails() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axios.get(`https://hsu-blog-site.onrender.com/api/getResource/${id}`);
        setResource(response.data.resource);
        setLikes(response.data.resource.likes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resource details:', error);
        setError('Failed to load resource details. Please try again later.');
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.post(`https://hsu-blog-site.onrender.com/api/resourcelikes/${id}`);
        setLikes(likes - 1);
      } else {
        await axios.post(`https://hsu-blog-site.onrender.com/api/resourcelikes/${id}`);
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking/unliking the resource:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.resourceName,
        text: `Check out this resource: ${resource.resourceName}`,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share feature is not supported in this browser.');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('URL copied to clipboard');
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!resource) {
    return <div>Resource not found.</div>;
  }

  const skillsArray = Array.isArray(resource.skills)
    ? resource.skills
    : resource.skills.split(',').map(skill => skill.trim());

  return (
    <div className="resource-details">
      <div className="hero-section">
        <div className="hero-bg">
          <img src={heroBg} alt="Background" className="hero-bg-img" />
        </div>
        
        <div className="hero-textResource">
          <h1 className='ResourceName'>{resource.resourceName}</h1>
          <div style={{display:"flex",gap:"2rem"}}>
            <p className='ResourceText'><strong>created by</strong>{resource.uploaderName}</p>
            <p className='ResourceText'><strong>created on</strong>{new Date(resource.createdAt).toLocaleDateString()}</p>
          </div>
          <p className='ResourceText' style={{ display: 'flex' }}>
            <strong style={{ top: "0.2rem", position: "relative" }}>Share</strong>
            <RiShareForwardLine style={{ marginTop: "0.2rem", cursor: "pointer" }} onClick={handleShare} className='share' />
          </p>
          <div className="like-section">
            <button
              className={`like-button ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              style={{ display: "flex", gap: "0.3rem" }}
            >
              {liked ? <BiSolidLike /> : <BiLike />}
              {likes} likes
            </button>
          </div>
        </div>
      </div>
      
      <div className="details-section">
        <div className="pdf-section">
          <h4>Preview</h4>
          <embed src={resource.pdf} width="100%" height="400px" type="application/pdf" />
        </div>
        <div className="side-boxes">
          <div className="box discover">
            <h4>Discover Related Books From Amazon</h4>
            <p>Explore similar resources that might interest you.</p>
          </div>
          <div className="box download">
            <h4>Download</h4>
            <p>Download this resource for offline use.</p>
          </div>
        </div>
      </div>
    
        <h2 style={{textAlign:"left",width:"100%",marginLeft:"4rem",marginBottom:'4rem'}}>Discover more</h2>
      <PopularResources/>

      <div className="popular" style={{width:"100%"}}>
        <p>Popular</p>
        <PopularAudio />
      </div>
      
    </div>
  );
}

export default ResourceDetails;
