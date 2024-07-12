import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../Utility/toastUtils';
import './CreateResource.css';

function CreateResource() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    permalink: '',
    writer: '',
    summary: '',
    phone: '',
    type: [],
    email: '',
    securityKey: '',
    category: [],
    whatYouWillLearn: [],
    bannerPreview: '',
    bannerFile: null,
    pdfFile: null,
  });

  const handleBannerClick = () => {
    document.getElementById('banner').click();
  };

  const handlePdfClick = () => {
    document.getElementById('pdf').click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      permalink: name === 'name' ? `/${value.replace(/\s+/g, '-')}` : prevState.permalink,
    }));
    if (name === 'summary' && value.split(/\s+/).length > 50) {
      showInfoToast('Summary should not exceed 50 words.');
      return;
    }
  };

  const handleSelectChange = (selectedList, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedList,
    }));
  };

  const handleKeyPress = (event, name) => {
    if (event.key === 'Enter' && event.target.value) {
      const newItem = event.target.value;
      setFormData((prevState) => ({
        ...prevState,
        [name]: [...prevState[name], newItem],
      }));
      event.target.value = '';
      event.preventDefault();
    }
  };

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file && file.type.match('image.*')) {
      reader.onload = () => {
        setFormData((prevState) => ({
          ...prevState,
          bannerPreview: reader.result,
          bannerFile: file,
        }));
      };

      reader.readAsDataURL(file);
    } else {
      showErrorToast('Please upload a valid image file.');
    }
  };

  const handlePdfChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      setFormData((prevState) => ({
        ...prevState,
        pdfFile: file,
      }));
    } else {
      showErrorToast('Please upload a valid PDF file.');
    }
  };

  const handleRemovePdf = () => {
    setFormData((prevState) => ({
      ...prevState,
      pdfFile: null,
    }));
  };

  const options = [
    { name: 'Space Technology', id: 1 },
    { name: 'Astronomy', id: 2 },
    { name: 'AI & ML', id: 3 },
    { name: 'Coding', id: 4 },
    { name: 'UI & UX', id: 5 },
    { name: 'Space Law', id: 6 },
    { name: 'AstroBiology', id: 7 },
    { name: 'Space Medicine', id: 8 },
    { name: 'Satellite Technology', id: 9 },
    { name: 'Aerospace', id: 10 },
    { name: 'Additive Manufacturing', id: 11 },
    { name: 'Avionics', id: 12 },
    { name: 'Aerodynamics', id: 13 },
    { name: 'CFD', id: 14 },
    { name: 'Others', id: 15 },
  ];
  

  const optionsType = [
    { name: 'Option 1', id: 1 },
    { name: 'Option 2', id: 2 },
    { name: 'Option 3', id: 3 },
    { name: 'Option 4', id: 4 },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, writer, summary, phone, type, email, category, securityKey, whatYouWillLearn, bannerFile, pdfFile } = formData;

    if (!name || !writer || !summary || !phone || !type.length || !email || !category.length || !whatYouWillLearn.length) {
      showErrorToast('Please fill in all the required fields.');
      return;
    }

    if (summary.split(/\s+/).length > 50) {
      showInfoToast('Summary should not exceed 50 words.');
      return;
    }

    if (!bannerFile) {
      showErrorToast('Please upload a banner image.');
      return;
    }

    if (!pdfFile) {
      showErrorToast('Please upload a PDF file.');
      return;
    }

    const data = new FormData();
    data.append('resourceName', name);
    data.append('permalink', formData.permalink);
    data.append('uploaderName', writer);
    data.append('description', summary);
    data.append('phone', phone);
    data.append('Type', JSON.stringify(type.map((item) => item.name)));
    data.append('email', email);
    data.append('security_key', securityKey);
   
    data.append('image', bannerFile);
    data.append('pdf', pdfFile);
    category.forEach((cat) => {
      data.append('category', cat.name);
    });
    
    // Append all skills
    whatYouWillLearn.forEach((skill) => {
      data.append('skills', skill);
    }); //

    setLoading(true);

    try {
      const response = await axios.post('https://hsu-blog-site.onrender.com/api/createResource', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      if (response.status === 200) {
        console.log(response)
        showSuccessToast(response.data.message||'Resource created syccessfully');
        setFormData({
          name: '',
          permalink: '',
          writer: '',
          summary: '',
          phone: '',
          type: [],
          email: '',
          securityKey: '',
          category: [],
          whatYouWillLearn: [],
          bannerPreview: '',
          bannerFile: null,
          pdfFile: null,
        });
      } else {
        showErrorToast(response.data.error || 'Failed to create resource.');
      }
    } catch (error) {
      console.error('Error creating resource:', error);
      if (error.response && error.response.data && error.response.data.error) {
        showErrorToast(error.response.data.error);
      } else {
        showErrorToast('Error creating resource. Please try again!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-resource">
      <h1>Welcome Admin,</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group">
            <label htmlFor="banner">Upload Resource PDF Poster<span className="required">*</span></label>
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
            <label htmlFor="pdf">Upload PDF<span className="required">*</span></label>
            <input type="file" id="pdf" name="pdf" accept="application/pdf" className="hidden-input" onChange={handlePdfChange} />
            <div className="custom-file-input" onClick={handlePdfClick}>
              {formData.pdfFile ? (
                <div className="pdf-uploaded">
                  <div>{formData.pdfFile.name}</div>
                  <div className="pdf-buttons">
                    <button type="button" onClick={handlePdfClick}>Change</button>
                    <button type="button" onClick={handleRemovePdf}>Remove</button>
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
            <label htmlFor="name">Name of the Resource<span className="required">*</span></label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="writer">Name of the Uploader<span className="required">*</span></label>
            <input type="text" id="writer" name="writer" value={formData.writer} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="summary">Small Description (50 words)<span className="required">*</span></label>
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
            <label htmlFor="securityKey">Security Key (leave blank if you don't have)</label>
            <input type="text" id="securityKey" name="securityKey" value={formData.securityKey} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number<span className="required">*</span></label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row">
          <div className="form-group category-container select-arrow">
            <label htmlFor="type">Type<span className="required">*</span></label>
            <Multiselect
              options={optionsType}
              selectedValues={formData.type}
              onSelect={(selectedList) => handleSelectChange(selectedList, 'type')}
              onRemove={(selectedList) => handleSelectChange(selectedList, 'type')}
              displayValue="name"
              placeholder=""
              id="type"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email<span className="required">*</span></label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
        </div>
        <button className={`submit-button ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Resources'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreateResource;
