import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { showErrorToast, showSuccessToast } from '../../Utility/toastUtils';
import CustomModal from '../../components/CustomModal/CustomModal'; // Import CustomModal component
import './AdminAudio.css';

const AdminAudioBooks = () => {
  const navigate = useNavigate();
  const [audioBooks, setAudioBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    const fetchAudioBooks = async () => {
      try {
        const response = await axios.get('https://hsu-blog-site.onrender.com/api/getAudioBooks');
        setAudioBooks(response.data);
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
    navigate(`/editAudio/${book._id}`);
  };

  const confirmDelete = (book) => {
    setBookToDelete(book);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(bookToDelete._id);
    setShowModal(false);
    setBookToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setBookToDelete(null);
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
                  <button onClick={() => confirmDelete(book)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
      <CustomModal
        show={showModal}
        message="Are you sure you want to delete this audiobook?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AdminAudioBooks;
