import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../Utility/toastUtils';
import './CreateProject.css';

const initialFormData = {
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
  docFile: null,
  securityKey: '',
  missionStatement: '',
  teamMembers: 1,
  vision: '',
  projectStatus: '',
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


function CreateProject() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleBannerClick = () => document.getElementById('banner').click();

  const handleDocClick = () => document.getElementById('doc').click();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      permalink: name === 'name' ? `/${value.replace(/\s+/g, '-')}` : prevState.permalink,
    }));
    if (name === 'summary' && value.split(/\s+/).length > 200) {
      showInfoToast('Summary should not exceed 200 words.');
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

  const handleDocChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        docFile: file,
      }));
    } else {
      showErrorToast('Please upload a valid document file.');
    }
  };

  const handleRemoveDoc = () => {
    setFormData((prevState) => ({
      ...prevState,
      docFile: null,
    }));
  };

  const validateForm = () => {
    const {
      name, writer, missionStatement, teamMembers, summary, vision, phone, type, email, projectStatus, category, whatYouWillLearn,
    } = formData;

    if (!name || !writer || !missionStatement || !teamMembers || !vision || !summary || !phone || !projectStatus || !type || !email || !category.length || !whatYouWillLearn.length) {
      showErrorToast('Please fill in all the required fields.');
      return false;
    }

    if (summary.split(/\s+/).length > 200) {
      showInfoToast('Summary should not exceed 200 words.');
      return false;
    }

    if (!formData.bannerPreview) {
      showErrorToast('Please upload a banner image.');
      return false;
    }

    if (!formData.docFile) {
      showErrorToast('Please upload a document file.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
  
    const {
      name, writer, missionStatement, bannerFile, teamMembers, summary, vision, phone, type, email, projectStatus, category, whatYouWillLearn, securityKey, docFile,
    } = formData;
  
    const data = new FormData();
    data.append('ProjectName', name);
    data.append('permalink', formData.permalink);
    data.append('AuthorName', writer);
    data.append('abstract', summary);
    data.append('phone', phone);
    data.append('Type', type);
    data.append('email', email);
    data.append('security_key', securityKey);
   
    data.append('mission_statement', missionStatement);
    data.append('project_vision', vision);
    data.append('team_size', teamMembers);
    data.append('status', projectStatus);
    data.append('image', bannerFile);
    data.append('pdf', docFile);
    category.forEach((cat) => {
      data.append('category', cat.name);
    });
    
    // Append all skills
    whatYouWillLearn.forEach((skill) => {
      data.append('skills', skill);
    }); //
  
    setLoading(true);
  
    try {
      console.log('Sending request to create project...');
      const response = await axios.post('https://hsu-blog-site.onrender.com/api/createProject', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        
        console.log('Project created successfully:', response.data);
        showSuccessToast(response.data.message||'Project created successfully!');
        setFormData(initialFormData);
      } else {
        console.error('Failed to create project:', response.data.error);
        showErrorToast(response.data.error || 'Failed to create project.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response && error.response.data && error.response.data.error) {
        showErrorToast(error.response.data.error);
      } else {
        showErrorToast('Error creating project. Please try again!');
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
            <label htmlFor="banner">Upload Project Banner:<span className="required">*</span></label>
            <input type="file" id="banner" name="banner" accept="image/*" className="hidden-input" onChange={handleBannerChange} />
            <div className="custom-file-input" onClick={handleBannerClick}>
              {formData.bannerPreview ? (
                <div className="banner-preview">
                  <img src={formData.bannerPreview} alt="Banner Preview" style={{ height: '10rem', width: '10rem', position: 'relative', top: '1rem' }} />
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
            <label htmlFor="doc">Upload Document:<span className="required">*</span></label>
            <input type="file" id="doc" name="doc" accept=".pdf,.doc,.docx" className="hidden-input" onChange={handleDocChange} />
            <div className="custom-file-input" onClick={handleDocClick}>
              {formData.docFile ? (
                <div className="doc-uploaded">
                  <div>{formData.docFile.name}</div>
                  <div className="doc-buttons">
                    <button type="button" onClick={handleDocClick}>Change</button>
                    <button type="button" onClick={handleRemoveDoc}>Remove</button>
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
            <label htmlFor="name">Name of the Project<span className="required">*</span></label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="writer">Name of Author<span className="required">*</span></label>
            <input type="text" id="writer" name="writer" value={formData.writer} onChange={handleInputChange} disabled={loading} />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="summary">Abstract (150 words)<span className="required">*</span></label>
            <input type="text" id="summary" name="summary" value={formData.summary} onChange={handleInputChange} disabled={loading} />
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="securityKey">Security Key (leave blank if don't have)</label>
            <input type="text" id="securityKey" name="securityKey" value={formData.securityKey} onChange={handleInputChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number<span className="required">*</span></label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={loading} />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="missionStatement">Mission Statement<span className="required">*</span></label>
            <input type="text" id="missionStatement" name="missionStatement" value={formData.missionStatement} onChange={handleInputChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="teamMembers">Current Number Of Team Members<span className="required">*</span></label>
            <input type="text" id="teamMembers" name="teamMembers" value={formData.teamMembers} onChange={handleInputChange} disabled={loading} />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="vision">Vision Of Project<span className="required">*</span></label>
            <input type="text" id="vision" name="vision" value={formData.vision} onChange={handleInputChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="projectStatus">Current Status Of the Project<span className="required">*</span></label>
            <input type="text" id="projectStatus" name="projectStatus" value={formData.projectStatus} onChange={handleInputChange} disabled={loading} />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="type">Type<span className="required">*</span></label>
            <input type="text" id="type" name="type" value={formData.type} onChange={handleInputChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email<span className="required">*</span></label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} disabled={loading} />
          </div>
        </div>
        <button className={`submit-button ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Project'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreateProject;
