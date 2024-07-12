import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../CreateResource/CreateResource.css'; // Ensure CSS is imported for styling

function ViewResource() {
  const [resourceData, setResourceData] = useState({
    resourceName: '',
    uploaderName: '',
    description: '',
    category: [],
    permalink: '',
    skills: [],
    phone: '',
    Type: [],
    email: '',
    securityKey: '',
    bannerPreview: '',
    bannerFile: null,
    pdfFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(true); // Default to true for view mode

  const { id } = useParams(); // Get the id parameter from the URL

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://hsu-blog-site.onrender.com/api/getResource/${id}`);
        if (response.status === 200) {
          const { resource } = response.data;
          const updatedData = {
            resourceName: resource.resourceName || '',
            uploaderName: resource.uploaderName || '',
            description: resource.description || '',
            category: resource.category||[],
            permalink: resource.permalink || '',
            skills: resource.skills|| [],
            phone: resource.phone || '',
            Type: Array.isArray(resource.Type) ? resource.Type : [resource.Type],
            email: resource.email || '',
            securityKey: resource.securityKey || '',
            bannerFile: resource.pdfPoster || null,
            pdfFile: resource.pdf || null,
          };
          setResourceData(updatedData);
          setReadonly(true); // Set readonly mode here if needed
        } else {
          // Handle error scenario
          console.error('Failed to fetch resource data');
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  // Ensure data is loaded before rendering
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="create-resource">
      <h1>View Resource Details</h1>
      <form className="form-container">
        <div className="row">
          <div className="form-group">
            <label htmlFor="resourceName">Name of the Resource</label>
            <input
              type="text"
              id="name"
              name="resourceName"
              value={resourceData.resourceName}
              readOnly={readonly}
            />
          </div>
          <div className="form-group">
            <label htmlFor="uploaderName">Name of the Uploader</label>
            <input
              type="text"
              id="writer"
              name="uploaderName"
              value={resourceData.uploaderName}
              readOnly={readonly}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea style={{paddingLeft:"2rem"}}
              id="summary"
              name="description"
              value={resourceData.description}
              readOnly={readonly}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={resourceData.phone}
              readOnly={readonly}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={resourceData.email}
              readOnly={readonly}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={resourceData.category.join(', ')}
              readOnly={readonly}
              className="searchWrapper"
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">What You will learn</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={resourceData.skills.join(', ')}
              readOnly={readonly}
              className='searchWrapper'
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="Type">Type</label>
            <input
              type="text"
              id="type"
              name="Type"
              value={resourceData.Type.join(', ')}
              readOnly={readonly}
            />
          </div>
          <div className="form-group">
            <label htmlFor="securityKey">Security Key</label>
            <input
              type="text"
              id="securityKey"
              name="securityKey"
              value={resourceData.securityKey}
              readOnly={readonly}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="permalink">Permalink</label>
          <input
            type="text"
            id="permalink"
            name="permalink"
            value={resourceData.permalink}
            readOnly={readonly}
          />
        </div>
        {/* Display banner file if available */}
        {resourceData.bannerFile && (
          <div className="row">
            <div className="form-group">
              <label htmlFor="bannerFile">Banner File</label>
              <img src={resourceData.bannerFile} alt="Banner" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>
        )}

        {/* Display PDF file if available */}
        {resourceData.pdfFile && (
          <div className="row">
            <div className="form-group">
              <label htmlFor="pdfFile">PDF File</label>
              <a href={resourceData.pdfFile} target="_blank" rel="noopener noreferrer">View PDF</a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default ViewResource;
