import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { showErrorToast, showInfoToast, showSuccessToast } from '../Utility/toastUtils';


function EditAudio() {
    const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    permalink: '',
    writer: '',
    summary: '',
    phone: '',
    type: '',
    email: '',
    category: [],
    securityKey: '',
    whatYouWillLearn: [],
    bannerPreview: '',
    bannerFile: null,
    audioFile: null
  });
  useEffect(() => {
    const fetchAudioBook = async () => {
      try {
        const response = await axios.get(`https://hsu-blog-site.onrender.com/api/getAudioBook/${id}`);
        console.log('Response:', response); // Log response to inspect data structure
        const audioBook = response.data.audiobook; // Assuming 'audiobook' is the correct key in your API response
        console.log(audioBook)
        const mappedCategories = audioBook.category.map(cat => ({ name: cat }));

        // Update formData with fetched data
        setFormData({
          name: audioBook.AudioBookName || '',
          permalink: audioBook.permalink || '',
          writer: audioBook.AuthorName || '',
          summary: audioBook.description || '',
          phone: audioBook.phone || '',
          type: audioBook.Type || '',
          email: audioBook.email || '',
          category: mappedCategories,
          whatYouWillLearn: audioBook.skills || [],
          bannerPreview: audioBook.audioBookPoster || '',
          bannerFile: audioBook.audioBookPoster||null,
          audioFile: audioBook.audio||null
        });
        console.log(formData.category)
      } catch (error) {
        console.error('Error fetching audiobook data:', error); // Log error for troubleshooting
        showErrorToast('Failed to fetch audiobook data.');
      }
    };
  
    fetchAudioBook();
  }, [id]);
  


  // Function to handle clicking on banner input
  const handleBannerClick = () => {
    document.getElementById('banner').click();
  };

  // Function to handle clicking on audio input
  const handleAudioClick = () => {
    document.getElementById('audio').click();
  };

  // Function to handle input change (text inputs)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      // Automatically update permalink based on name input
      permalink: name === 'name' ? `/${value.replace(/\s+/g, '-')}` : prevState.permalink
    }));
    // Check summary length and show info message if necessary
    if (name === 'summary' && value.split(/\s+/).length > 50) {
      showInfoToast('Summary should not exceed 50 words.');
    }
  };

  // Function to handle multiselect change (category and whatYouWillLearn)
  const handleSelectChange = (selectedList, name) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: selectedList
    }));
  };

  // Function to handle key press (adding items on Enter)
  const handleKeyPress = (event, name) => {
    if (event.key === 'Enter' && event.target.value) {
      const newItem = event.target.value;
      setFormData(prevState => ({
        ...prevState,
        [name]: [...prevState[name], newItem]
      }));
      event.target.value = '';
      event.preventDefault();
    }
  };

  // Function to handle banner file change
  const handleBannerChange = (event) => {
    const file = event.target.files[0];
  
    const reader = new FileReader();

    if (file && file.type.match('image.*')) {
      reader.onload = () => {
        setFormData(prevState => ({
          ...prevState,
          bannerPreview: reader.result,
          bannerFile: file ,
          // Set the bannerFile to the File object
        }));
      };
     
      reader.readAsDataURL(file); // Read the file as Data URL
    } else {
      showErrorToast('Please upload a valid image file.');
    }
  };
  
  // Function to handle audio file change
  const handleAudioChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.match('audio.*')) {
      setFormData(prevState => ({
        ...prevState,
        audioFile: file // Set the audioFile to the File object
      }));
    } else {
      showErrorToast('Please upload a valid audio file.');
    }
  };

  // Function to handle removing audio file
  const handleRemoveAudio = () => {
    setFormData(prevState => ({
      ...prevState,
      audioFile: null // Reset audioFile to null
    }));
  };

  // Sample options for Multiselect component
  const options = [
    { name: 'Option 1', id: 1 },
    { name: 'Option 2', id: 2 },
    { name: 'Option 3', id: 3 },
    { name: 'Option 4', id: 4 },
  ];

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, writer, summary, phone, type, email, category, securityKey, whatYouWillLearn, bannerFile, audioFile } = formData;

    // Validate required fields
    if (!name || !writer || !summary || !phone || !type || !email || category.length === 0 || whatYouWillLearn.length === 0 || !bannerFile || !audioFile) {
      showErrorToast('Please fill in all the required fields.');
      return;
    }

    // Additional validation for summary length
    if (summary.split(/\s+/).length > 50) {
      showInfoToast('Summary should not exceed 50 words.');
      return;
    }

    // Create FormData object for multipart/form-data submission
    const data = new FormData();
    data.append('AudioBookName', name);
    data.append('permalink', formData.permalink);
    data.append('AuthorName', writer);
    data.append('description', summary);
    data.append('phone', phone);
    data.append('Type', type);
    data.append('email', email);
    data.append('security_key', securityKey); // Ensure the parameter name matches backend expectations
    category.forEach((cat) => {
      data.append('category', cat.name);
    });
    
    // Append all skills
    whatYouWillLearn.forEach((skill) => {
      data.append('skills', skill);
    }); // Assuming you only need the first skill
    data.append('image', bannerFile); // Ensure bannerFile is properly set as a File object
    data.append('audio', audioFile); // Ensure audioFile is properly set as a File object
    
    setLoading(true);
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
        const response = await axios.patch(`https://hsu-blog-site.onrender.com/api/editAudioBook/${id}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
  
        if (response.status === 200) {
          showSuccessToast('Audio Book updated successfully!!');
        // Reset form state after successful submission
        setFormData({
          name: '',
          permalink: '',
          writer: '',
          summary: '',
          phone: '',
          type: '',
          email: '',
          category: [],
          whatYouWillLearn: [],
          bannerPreview: '',
          bannerFile: null,
          audioFile: null
        });
      } else {
        showErrorToast(response.data.error || 'Failed to Update audio book.');
      }
    } catch (error) {
      console.error('Error creating audio book:', error);
      if (error.response && error.response.data && error.response.data.error) {
        showErrorToast(error.response.data.error);
      } else {
        showErrorToast('Error creating audio book. Please try again!');
      }
    }finally {
      setLoading(false); // Reset loading state after submission
    }
  };
  console.log('Rendered formData.category:', formData.category);
  return (
    <div className="edit-audio">
      <h1>Welcome Admin,</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group">
            <label htmlFor="banner">Audio Book Banner:<span className="required">*</span></label>
            <input type="file" id="banner" name="banner" accept="image/*" className="hidden-input" onChange={handleBannerChange} />
            <div className="custom-file-input" onClick={handleBannerClick}>
              {formData.bannerPreview ? (
                <div className="banner-preview">
                  <img src={formData.bannerPreview} alt="Banner Preview" style={{ height: "10rem", width: "10rem", position: "relative", top: "1rem" }} />
                </div>
              ) : (
                <div className="upload">
                  <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#6637ED">
                    <path d="M435-323v-324L322-533l-66-65 225-224 224 224-66 65-113-114v324h-91ZM230-139q-37.18 0-64.09-26.91Q139-192.82 139-230v-143h91v143h500v-143h92v143q0 37-27.21 64-27.2 27-64.79 27H230Z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="audio">Upload Audio:<span className="required">*</span></label>
            <input type="file" id="audio" name="audio" accept="audio/*" className="hidden-input" onChange={handleAudioChange} />
            <div className="custom-file-input" onClick={handleAudioClick}>
              {formData.audioFile ? (
                <div className="audio-uploaded">
                  <div>{formData.audioFile}</div>
                  <div className="audio-buttons">
                    <button type="button" onClick={handleAudioClick}>Change</button>
                    <button type="button" onClick={handleRemoveAudio}>Remove</button>
                  </div>
                </div>
              ) : (
                <div className="upload">
                  <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#6637ED">
                    <path d="M435-323v-324L322-533l-66-65 225-224 224 224-66 65-113-114v324h-91ZM230-139q-37.18 0-64.09-26.91Q139-192.82 139-230v-143h91v143h500v-143h92v143q0 37-27.21 64-27.2 27-64.79 27H230Z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="name">Name of Audio Book:<span className="required">*</span></label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="writer">Name of Book Writer:<span className="required">*</span></label>
            <input type="text" id="writer" name="writer" value={formData.writer} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="summary">Small Summary(50 words)<span className="required">*</span></label>
            <input type="text" id="summary" name="summary" value={formData.summary} onChange={handleInputChange} />
          </div>
          <div className="form-group category-container select-arrow">
            <label htmlFor="category">Category:<span className="required">*</span></label>
            
            <Multiselect
              options={options}
              selectedValues={formData.category}
              onSelect={(selectedList) => handleSelectChange(selectedList, 'category')}
              onRemove={(selectedList) => handleSelectChange(selectedList, 'category')}
              displayValue="name"
              placeholder=""
              id="category"
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="permalink">Permalink<span className="required">*</span></label>
            <input type="text" id="permalink" name="permalink" value={formData.permalink} readOnly />
          </div>
          <div className="form-group category-container">
            <label htmlFor="whatYouWillLearn">What You Will Learn<span className="required">*</span></label>
            <Multiselect
              isObject={false}
              selectedValues={formData.whatYouWillLearn}
              onSelect={(selectedList) => handleSelectChange(selectedList, 'whatYouWillLearn')}
              onRemove={(selectedList) => handleSelectChange(selectedList, 'whatYouWillLearn')}
              onKeyPressFn={(event) => handleKeyPress(event, 'whatYouWillLearn')}
              displayValue="name"
              id="whatYouWillLearn"
              placeholder=""
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="securityKey">Security Key (leave blank if don't have)</label>
            <input type="text" id="securityKey" name="securityKey" value={formData.securityKey} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number<span className="required">*</span></label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="type">Type<span className="required">*</span></label>
            <input type="text" id="type" name="type" value={formData.type} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email<span className="required">*</span></label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
        </div>
        <button
          className={`submit-button ${loading ? 'loading' : ''}`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Audio Book'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default EditAudio;