import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import PopularAudio from '../../components/PopularAudio/PopularAudio';
import './AllAudio.css';

function AllAudio() {
  const [audiobooks, setAudiobooks] = useState([]);
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);
  const [category, setCategory] = useState('');
  const navigate=useNavigate();

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
    fetchAudiobooks();
  }, []);

  const handleCategoryChange = async (selectedCategory) => {
    setCategory(selectedCategory);

    if (selectedCategory === 'All') {
      setFilteredAudiobooks(audiobooks);
      return;
    }

    try {
      const response = await axios.post('https://hsu-blog-site.onrender.com/api/categoryFilteraudiobook', { category: selectedCategory });

      // Check if the response contains a message indicating no resources were found
      if (response.data.message) {
        setFilteredAudiobooks([]);
      } else {
        setFilteredAudiobooks(response.data);
      }
    } catch (error) {
      console.error('Error filtering audiobooks:', error);
    }
  };

  return (
    <>
   
    <div className="all-audio-container">
    <div className="popular">
        <p style={{marginBottom:"2rem"}}>Audio Book Summaries</p>
       
      </div>
      <div className="filter-container">
        {['All', 'Option 1', 'Option 2', 'Option 3', 'Option 4'].map((cat) => (
          <button
            key={cat}
            className={`category-button ${category === cat ? 'selected' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    
      <Swiper
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
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        className="swiper-container"
      >
        {filteredAudiobooks.map((audio) => (
          <SwiperSlide key={audio._id} onClick={()=>{
            navigate(`/audio/${audio._id}`)
          }}>
            <div className="audio-box">
              <img src={audio.audioBookPoster} alt={audio.AudioBookName} className="audio-banner" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="popular">
        <p>Popular</p>
        <PopularAudio />
      </div>
    </div>
    </>
  );
}

export default AllAudio;
