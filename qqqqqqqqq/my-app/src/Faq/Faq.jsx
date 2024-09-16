import React, { useState, useEffect } from 'react';
import './faq.css';
import { FaEdit, FaTrashAlt, FaPlus, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newFaq, setNewFaq] = useState({ fruit_name: '', question: '', answer: '', image: '' });
  const [editingFaq, setEditingFaq] = useState(null);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [grouped, setGrouped] = useState(false); // State to track grouping

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = () => {
    axios.get('https://appreciate-12.onrender.com/faqs/')
      .then(response => setFaqs(response.data))
      .catch(error => console.error(error));
  };

  const handleAddFaq = () => {
    setNewFaq({ fruit_name: '', question: '', answer: '', image: '' });
    setEditingFaq(null);
    setShowPopup(true);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = faqs.filter(faq =>
      faq.fruit_name.toLowerCase().includes(searchTerm)
    );
    setFilteredFaqs(filtered);
  };

  const handleEditFaq = (id) => {
    const faqToEdit = faqs.find(faq => faq.id === id);
    setNewFaq(faqToEdit);
    setEditingFaq(id);
    setShowPopup(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Show SweetAlert confirmation before saving
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
        if (editingFaq) {
          axios.put(`https://appreciate-12.onrender.com/faqs/${editingFaq}`, newFaq)
            .then(() => {
              setShowPopup(false);
              fetchFaqs();
              Swal.fire("Saved!", "Your changes have been saved.", "success");
            })
            .catch(error => console.error(error));
        } else {
          axios.post('https://appreciate-12.onrender.com/faqs/', newFaq)
            .then(() => {
              setShowPopup(false);
              fetchFaqs();
              Swal.fire("Saved!", "Your new FAQ has been added.", "success");
            })
            .catch(error => console.error(error));
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  
  const handleDeleteFaq = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://appreciate-12.onrender.com/faqs/${id}`)
          .then(() => {
            setFaqs(faqs.filter(faq => faq.id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: 'Your FAQ has been deleted.',
              icon: 'success'
            });
          })
          .catch(error => console.error(error));
      }
    });
  };
  

  const handleGroupToggle = () => {
    setGrouped(!grouped);
  };

  // Function to group FAQs by fruit_name
  const groupByFruit = (faqs) => {
    return faqs.reduce((acc, faq) => {
      if (!acc[faq.fruit_name]) {
        acc[faq.fruit_name] = [];
      }
      acc[faq.fruit_name].push(faq);
      return acc;
    }, {});
  };

  // Grouped FAQs
  const groupedFaqs = Object.keys(groupByFruit(filteredFaqs.length > 0 ? filteredFaqs : faqs))
    .sort()
    .map(fruit_name => ({
      fruit_name,
      faqs: groupByFruit(filteredFaqs.length > 0 ? filteredFaqs : faqs)[fruit_name],
    }));

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h1 className="centerr">FAQ Section</h1>
        <button className="add-btn" onClick={handleAddFaq}>
          <FaPlus /> Add FAQ
        </button>
        <button className="group-btn" onClick={handleGroupToggle}>
          {grouped ? <FaArrowUp /> : <FaArrowDown />} Group by Fruit
        </button>
      </div>

      <div className="searchbox">
        <div className="search">
          <div className="icon" onClick={() => document.querySelector('.search').classList.toggle('active')}></div>
          <div className="innput">
            <input
              type="text"
              placeholder="Search"
              id="mysearch"
              onChange={handleSearchChange}
            />
          </div>
          <span className="clear" onClick={() => (document.getElementById('mysearch').value = '', handleSearchChange({target: {value: ''}}))}></span>
        </div>
      </div>

      <div className="faq-list">
        {grouped ? (
          groupedFaqs.map(group => (
            <div key={group.fruit_name} className="faq-group">
              <h2 className="sort">{group.fruit_name}</h2>
              {group.faqs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <img src={faq.image || '/default-image.png'} alt={faq.fruit_name} className="faq-image" />
                  <div className="faq-content">
                    <h3>{faq.question}</h3>
                    <p className="faq-con">{faq.answer}</p>
                  </div>
                  <div className="faq-actions">
                    <button className="edit-btn" onClick={() => handleEditFaq(faq.id)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteFaq(faq.id)}>
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          (filteredFaqs.length > 0 ? filteredFaqs : faqs).map(faq => (
            <div key={faq.id} className="faq-item">
              <img src={faq.image || '/default-image.png'} alt={faq.fruit_name} className="faq-image" />
              <div className="faq-content">
                <h3>{faq.question}</h3>
                <p className="faq-con">{faq.answer}</p>
              </div>
              <div className="faq-actions">
                <button className="edit-btn" onClick={() => handleEditFaq(faq.id)}>
                  <FaEdit /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteFaq(faq.id)}>
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showPopup && <div className="faq-overlay"></div>}

      {showPopup && (
        <div className="faq-popup">
          <div className="popup-content">
            <h2>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</h2>
            <form onSubmit={handleSubmit}>
              <label>Fruit Name</label>
              <input
                type="text"
                name="fruit_name"
                value={newFaq.fruit_name}
                onChange={handleInputChange}
                required
              />
              <label>Question</label>
              <input
                type="text"
                name="question"
                value={newFaq.question}
                onChange={handleInputChange}
                required
              />
              <label>Answer</label>
              <input
                type="text"
                name="answer"
                value={newFaq.answer}
                onChange={handleInputChange}
                required
              />
              <label>Image URL ( Paste Only Image address) </label>
              <input
                type="text"
                name="image"
                value={newFaq.image}
                onChange={handleInputChange}
              />
              <button type="submit">{editingFaq ? "Update FAQ" : "Submit"}</button>
              <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Faq;
