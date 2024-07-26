import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import PopularAudio from '../../components/PopularAudio/PopularAudio';
import './AllAudio.css';

function AllAudio() {
  const [audiobooks, setAudiobooks] = useState([]);
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);
  const [searchedAudiobooks, setSearchedAudiobooks] = useState([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Track if a search is being performed
  const navigate = useNavigate();

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
    setIsSearching(false); // Reset search state on category change

    if (selectedCategory === 'All') {
      setFilteredAudiobooks(audiobooks);
      return;
    }

    try {
      const response = await axios.post('https://hsu-blog-site.onrender.com/api/categoryFilteraudiobook', { category: selectedCategory });

      if (response.data.message) {
        setFilteredAudiobooks([]);
      } else {
        setFilteredAudiobooks(response.data);
      }
    } catch (error) {
      console.error('Error filtering audiobooks:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true); // Set search state to true

    try {
      const response = await axios.post('https://hsu-blog-site.onrender.com/api/findaudiobooks', { AudioBookName: searchTerm });

      setSearchedAudiobooks(response.data);
    } catch (error) {
      console.error('Error searching audiobooks:', error);
    }
  };

  return (
    <>
      <div className="all-audio-container">
        <p>Audiobook Summaries</p>
        <Swiper
          spaceBetween={10}
          slidesPerView={6}
          modules={[Navigation, Pagination, Keyboard]}
         
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 40,
              autoplay:false
            },
            375:{
              slidesPerView: 1,
              spaceBetween: 40,
              autoplay:false

            },
            390:{
              slidesPerView: 2,
              spaceBetween: 40,
              autoplay:false

            },
            1020:
            {
              slidesPerView: 6,
              spaceBetween: 20,
              

            }
          }}
          
          className="filter-container"
        >
          {[ 'Space Technology', 'Self Help', 'Marketing', 'Entrepreneurship', 'Astronomy', 'AI & ML'].map((cat) => (
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

        <div className="popular">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p>Popular</p>
            <div className="search-bar-container">
              <form onSubmit={handleSearch} style={{display:"flex"}}>
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
          
          {isSearching ? (
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
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
              }}
              className="swiper-container"
            >
              {searchedAudiobooks.map(audio => (
                <SwiperSlide key={audio._id} onClick={() => navigate(`/audio/${audio._id}`)}>
                  <div className="audio-box" style={{
                    backgroundColor: audio.color,
                    position: 'relative',
                    width: '100%',
                    height: '110%',
                    padding: "2rem",
                    
                  }}>
                    <img
                      style={{
                        width: '100%',
                        height: '120%',
                        objectFit: 'cover',
                        position:"relative",
                        top: 0,
                        left: 0
                      }}
                      src={audio.audioBookPoster}
                      alt={audio.AudioBookName}
                      className="audio-banner"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <PopularAudio/>
          )}
        </div>
      </div>
    </>
  );
}

export default AllAudio;
