import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './PopularAudio.css'; // Import component-specific styles

function PopularAudio() {
  const [popularAudiobooks, setPopularAudiobooks] = useState([]);
  const navigate=useNavigate()

  useEffect(() => {
    fetchPopularAudiobooks();
  }, []);

  const fetchPopularAudiobooks = async () => {
    try {
      const response = await axios.get('https://hsu-blog-site.onrender.com/api/getpopularAudiobook'); // Adjust URL based on your backend setup
      if (response.status !== 200) {
        throw new Error('Failed to fetch audiobooks');
      }
      setPopularAudiobooks(response.data);
    } catch (error) {
      console.error('Error fetching popular audiobooks:', error);
    }
  };

  return (
    <div className="popular-audio-container">
      <Swiper
        spaceBetween={30}
        slidesPerView={5}
        modules={[Navigation, Pagination, Autoplay, Keyboard]}
        autoplay={{
          delay: 2000,
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
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,            spaceBetween: 40,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 60,
          },
        }}
        className="swiper-container"
      >
        {popularAudiobooks.map((audiobook, index) => (
          <SwiperSlide className='popularSlide' key={audiobook._id} onClick={()=>{
            navigate(`/audio/${audiobook._id}`)
          }}>
            <div className="audiobook-slide" style={{ backgroundColor: audiobook.color }}>
              <img src={audiobook.audioBookPoster} alt={audiobook.AudioBookName} className="slide-imageP" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default PopularAudio;
