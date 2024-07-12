import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { ToastContainer } from 'react-toastify';
import { showSuccessToast } from '../../Utility/toastUtils';
import './PendingContent.css'; // Import your CSS file for styling

const PendingContents = () => {
  const [pendingContents, setPendingContents] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fetch pending resources from backend
    const fetchPendingContents = async () => {
      try {
        const response = await axios.get('https://hsu-blog-site.onrender.com/api/getPendingResources');
        setPendingContents(response.data); // Assuming backend returns an array of pending resources
      } catch (error) {
        console.error('Error fetching pending resources:', error);
      }
    };

    fetchPendingContents();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  const handleApproval = async (id, status) => {
    try {
      const response = await axios.patch(`https://hsu-blog-site.onrender.com/api/updateResource/${id}`, { status });
      showSuccessToast(response.data.message);
      console.log(response.data.message);
      setPendingContents(pendingContents.filter(content => content._id !== id));
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  const handleView = (id) => {
    navigate(`/viewResource/${id}`);
  };

  return (
    <div className="pending-contents">
      <h1>Pending Contents</h1>
      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th style={{ backgroundColor: "#D9D9D9" }}>Type</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Title</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Author</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Date</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>View Details</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Approval</th>
            </tr>
          </thead>
          <tbody>
            {pendingContents.map(content => (
              <tr key={content._id}>
                <td>Resources</td>
                <td>{content.resourceName}</td>
                <td>{content.uploaderName}</td>
                <td>{new Date(content.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleView(content._id)} className="details-button">View Details</button>
                </td>
                <td style={{ display: "flex", gap: "1rem", height: "116%", justifyContent: "center" }}>
                  <button
                    className="approve-button"
                    onClick={() => handleApproval(content._id, 'Approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="decline-button"
                    onClick={() => handleApproval(content._id, 'Decline')}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PendingContents;
