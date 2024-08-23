import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import yt1 from '../.././assets/Yt1.png';
import yt2 from '../.././assets/yt2.png';
import yt3 from '../.././assets/yt3.png';
import yt4 from '../.././assets/yt4.png';
import yt5 from '../.././assets/yt5.png';
import yt6 from '../.././assets/yt6.png';
import yt7 from '../.././assets/yt7.png';
import yt8 from '../.././assets/yt8.png';
import './AllResource.css';

function AllResource() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedResource, setSearchedResource] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [audiobooks, setAudiobooks] = useState([]);
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);
  const navigate = useNavigate();

  const fetchResources = async () => {
    try {
      const response = await axios.get('https://hsu-blog-site.onrender.com/api/getAcceptedResources');
      setResources(response.data);
      setFilteredResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };
  const fetchAudiobooks = async () => {
    try {
      const response = await axios.get('https://hsu-blog-site.onrender.com/api/getAudioBooks');
      setAudiobooks(response.data);
      setFilteredAudiobooks(response.data);
    } catch (error) {
      console.error('Error fetching audiobooks:', error);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchAudiobooks();
  }, []);

  const handleCategoryChange = async (selectedCategory) => {
    setCategory(selectedCategory);
    setIsSearching(false); // Reset search state on category change

    if (selectedCategory === 'All') {
      setFilteredResources(resources);
      return;
    }

    try {
      const response = await axios.post('https://hsu-blog-site.onrender.com/api/categoryFilter', { category: selectedCategory });

      if (response.data.message) {
        setFilteredResources([]);
      } else {
        setFilteredResources(response.data);
      }
    } catch (error) {
      console.error('Error filtering resources:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true); // Set search state to true

    try {
      const response = await axios.post('https://hsu-blog-site.onrender.com/api/searchResource', { AudioBookName: searchTerm });

      setSearchedResource(response.data);
    } catch (error) {
      console.error('Error searching audiobooks:', error);
    }
  };

  return (
    <div className="all-resources-container">
      <div style={{ display: "flex", justifyContent: "space-between" }} className='container'>
        <h2 style={{ marginLeft: "4rem" }}>Resources</h2>
        <div className="search-bar-container">
          <form onSubmit={handleSearch} style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button"><FaSearch /></button>
          </form>
        </div>
      </div>

      {/* Category Filter Swiper */}
      <Swiper
        spaceBetween={10}
        slidesPerView={6}
        modules={[Navigation, Pagination, Keyboard]}
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1020: {
            slidesPerView: 6,
            spaceBetween: 20,
          }
        }}
        className="filter-container"
      >
        {['All', 'Space Technology', 'Self Help', 'Marketing', 'Entrepreneurship', 'Astronomy', 'AI & ML'].map((cat) => (
          <SwiperSlide key={cat}>
            <button
              className={`category-button ${category === cat ? 'selected' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Resources Swiper */}
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        modules={[Navigation, Pagination, Autoplay, Keyboard]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
        className="swiper-container"
      >
        {(isSearching ? searchedResource : filteredResources).map((resource) => (
          <SwiperSlide key={resource._id} onClick={() => navigate(`/resource/${resource._id}`)} style={{cursor:"pointer"}}>
            <div className="resource-box">
              <img
                src={resource.pdfPoster || 'default-poster.jpg'}
                alt={resource.name}
                className="resource-banner"
              />
              <div className="Resource-name">
                <p>{resource.resourceName}</p>
              </div>

              <div className="resource-details">
                <h3>Published On {new Date(resource.createdAt).toLocaleDateString()}</h3>
                <button className="view-button" onClick={() => navigate(`/resource/${resource._id}`)}>View</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      

      <div className="popular">
        <h5 style={{marginLeft:"4rem"}}>Listen to AudioBook Summaries</h5>
        <Swiper style={{marginTop:"8rem"}}
          spaceBetween={30}
          slidesPerView={3}
          modules={[Navigation, Pagination, Autoplay, Keyboard]}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false
          }}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          className="swiper-container"
        >
          {filteredAudiobooks.map((audio) => (
            <SwiperSlide key={audio._id} onClick={() => navigate(`/audio/${audio._id}`)}>
              <div className="audio-boxF" style={{
                backgroundColor: audio.color,
                position: 'relative',
                width: '250px',
                
                paddingTop:"3.2rem",
                paddingLeft:"1rem",
                paddingRight:"1rem"
                
              }}>
                <img
                  
                  src={audio.audioBookPoster}
                  alt={audio.AudioBookName}
                  className="audio-bannerFilter"
                />
                <div className="audio-duration">{Math.round(audio.duration)} mins</div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="youtube">
        <h2>Watch YouTube Videos</h2>
       
        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          modules={[Navigation, Pagination, Autoplay, Keyboard]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false
          }}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1200: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
          }}
          className="swiper-containerYT"
        >
          {[
             { id: 1, thumbnail: yt1, link: 'https://www.youtube.com/embed/NCrA8CjO_tU' },
             { id: 2, thumbnail: yt2, link: 'https://www.youtube.com/embed/r_3zZ0E6Y1M' },
             { id: 3, thumbnail: yt3, link: 'https://www.youtube.com/embed/l32u0AoHVwU' },
             { id: 4, thumbnail: yt4, link: 'https://www.youtube.com/embed/ol1ePrLprrE' },
             { id: 5, thumbnail: yt5, link: 'https://www.youtube.com/embed/crmCq0LVkhk' },
             { id: 6, thumbnail: yt6, link: 'https://www.youtube.com/embed/sAiM4Lcjn5E' },
             { id: 7, thumbnail: yt7, link: 'https://www.youtube.com/embed/cDd-k4ci-KE' },
             { id: 8, thumbnail: yt8, link: 'https://www.youtube.com/embed/RDzUU8IHKJs' },
          ].map(video => (
            <SwiperSlide key={video.id} className='swiper-slideYT'>
              <img
                src={video.thumbnail}
                alt={`YouTube Video ${video.id}`}
                className="youtube-thumbnail"
                onClick={() => setCurrentVideo(video.link)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {currentVideo && (
          <div className="video-player">
            <iframe
              width="560"
              height="315"
              src={currentVideo}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
    </div>
  );
}

export default AllResource;
