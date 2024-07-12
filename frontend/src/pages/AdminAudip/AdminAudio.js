import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import { ToastContainer } from 'react-toastify';
import { showErrorToast, showSuccessToast } from '../../Utility/toastUtils';
import './AdminAudio.css'; // Import your CSS file for styling

const AdminAudioBooks = () => {
  const navigate = useNavigate(); // Initialize useHistory

  const [audioBooks, setAudioBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null); // State to manage the book being edited

  useEffect(() => {
    const fetchAudioBooks = async () => {
      try {
        const response = await axios.get('https://hsu-blog-site.onrender.com/api/getAudioBooks');
        setAudioBooks(response.data); // Assuming backend returns an array of audiobooks
      } catch (error) {
        console.error('Error fetching audiobooks:', error);
      }
    };

    fetchAudioBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://hsu-blog-site.onrender.com/api/deleteAudiobook/${id}`);
      showSuccessToast(response.data.message);
      setAudioBooks(audioBooks.filter(book => book._id !== id));
    } catch (error) {
      showErrorToast('Error deleting audiobook');
      console.error('Error deleting audiobook:', error);
    }
  };

  const handleEdit = (book) => {
    // Navigate to editAudio/:id
    navigate(`/editAudio/${book._id}`);
  };

  const handleEditClose = () => {
    setEditingBook(null); // Close the edit modal
  };

  return (
    <div className="admin-audiobooks">
       
      <h1>Admin Control - AudioBooks</h1>
      <div className="table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th style={{ backgroundColor: "#D9D9D9" }}>Type</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Title</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Author</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Date</th>
              <th style={{ backgroundColor: "#D9D9D9" }}>Approval</th>
            </tr>
          </thead>
          <tbody>
            {audioBooks.map(book => (
              <tr key={book._id}>
                <td>AudioBook</td>
                <td>{book.AudioBookName}</td>
                <td>{book.AuthorName}</td>
                <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(book)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(book._id)} className="delete-button">Delete</button>
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

export default AdminAudioBooks;
