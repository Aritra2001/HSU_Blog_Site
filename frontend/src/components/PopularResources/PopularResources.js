import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './PopularResources.css'; // Import component-specific styles

function PopularResources() {
  const [popularResources, setPopularResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularResources();
  }, []);

  const fetchPopularResources = async () => {
    try {
      const response = await axios.get('https://hsu-blog-site.onrender.com/api/getpopularResource'); // Adjust URL based on your backend setup
      if (response.status !== 200) {
        throw new Error('Failed to fetch resources');
      }
      setPopularResources(response.data);
    } catch (error) {
      console.error('Error fetching popular resources:', error);
    }
  };

  return (
    <div className="popular-resources-container">
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
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 60,
          },
        }}
        className="swiper-container"
      >
        {popularResources.map((resource, index) => (
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
    </div>
  );
}

export default PopularResources;
