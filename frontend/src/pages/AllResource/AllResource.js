import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import PopularAudio from '../../components/PopularAudio/PopularAudio';
import './AllResource.css';

function AllResource() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedResource, setSearchedResource] = useState([]);
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

  useEffect(() => {
    fetchResources();
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
      <div style={{display:"flex",justifyContent:"space-between"}}>
      <h1> Resources</h1>
      <div className="search-bar-container">
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" onClick={handleSearch} style={{cursor:"pointer"}}>Search</button>
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
            slidesPerView: 2,
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
          <SwiperSlide key={resource._id} onClick={() => navigate(`/resource/${resource._id}`)}>
            <div className="resource-box" style={{
              backgroundColor: resource.color || '#f5f5f5',
              position: 'relative',
              width: '250px',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <img
                src={resource.pdfPoster
                  || 'default-poster.jpg'}
                alt={resource.name}
                className="resource-banner"
                style={{ width: '100%', height: 'auto' }}
              />
              <div className="resource-details">
                <h3>{resource.resourceName}</h3>
               
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="popular">
        <p>Listen to audioBook Summaries</p>
      <PopularAudio/>
      </div>
    </div>
  );
}

export default AllResource;
