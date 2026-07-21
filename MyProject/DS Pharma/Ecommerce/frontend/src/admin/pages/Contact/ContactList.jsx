import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      const response = await axios.get(`${apiUrl}/contact`);
      const contactData = response.data.data || response.data || [];
      setContacts(contactData);
      setFilteredContacts(contactData);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.response?.data?.message || 'Failed to fetch contact submissions');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.contactDetails?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, contacts]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await axios.delete(`${apiUrl}/contact/${id}`);
      // Refresh the list after deletion
      fetchContacts(false);
      if (showModal) {
        handleCloseModal();
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert(err.response?.data?.message || 'Failed to delete contact submission');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchContacts(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Styles
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle = {
    marginBottom: '30px',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px',
  };

  const statsContainerStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const statCardStyle = {
    padding: '15px 25px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    minWidth: '150px',
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '5px',
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
  };

  const searchContainerStyle = {
    marginBottom: '20px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const searchInputStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '12px 20px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    flex: '1',
    minWidth: '250px',
  };

  const tableContainerStyle = {
    overflowX: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '20px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px',
  };

  const thStyle = {
    padding: '15px',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '700',
    color: '#2d3748',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: '1px solid #f7fafc',
    fontSize: '14px',
    color: '#4a5568',
  };

  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '8px',
  };

  const viewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4299e1',
    color: '#ffffff',
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f56565',
    color: '#ffffff',
  };

  const refreshButtonStyle = {
    ...buttonStyle,
    backgroundColor: refreshing ? '#a0aec0' : '#48bb78',
    color: '#ffffff',
    padding: '12px 24px',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: refreshing ? 'not-allowed' : 'pointer',
  };

  const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
  };

  const pageButtonStyle = (isActive) => ({
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: '600',
    border: isActive ? 'none' : '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#4299e1' : '#ffffff',
    color: isActive ? '#ffffff' : '#2d3748',
    transition: 'all 0.3s ease',
  });

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  };

  const modalHeaderStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e2e8f0',
  };

  const modalFieldStyle = {
    marginBottom: '20px',
  };

  const modalLabelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#718096',
    marginBottom: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const modalValueStyle = {
    fontSize: '16px',
    color: '#2d3748',
    lineHeight: '1.6',
    padding: '10px',
    backgroundColor: '#f7fafc',
    borderRadius: '6px',
  };

  const modalButtonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
    justifyContent: 'flex-end',
  };

  const closeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#718096',
    color: '#ffffff',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#718096',
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#4a5568',
  };

  const errorStyle = {
    padding: '15px 20px',
    backgroundColor: '#fed7d7',
    color: '#742a2a',
    border: '2px solid #fc8181',
    borderRadius: '8px',
    marginBottom: '20px',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading contact submissions...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Contact Form Submissions</h1>

        {/* Stats */}
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Total Submissions</div>
            <div style={statValueStyle}>{contacts.length}</div>
          </div>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Filtered Results</div>
            <div style={statValueStyle}>{filteredContacts.length}</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* Search and Refresh */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search by name, subject, message, or contact details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#4299e1')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={refreshButtonStyle}
          onMouseEnter={(e) => {
            if (!refreshing) e.target.style.backgroundColor = '#38a169';
          }}
          onMouseLeave={(e) => {
            if (!refreshing) e.target.style.backgroundColor = '#48bb78';
          }}
        >
          <span style={{ fontSize: '18px' }}>{refreshing ? '⟳' : '↻'}</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Table */}
      {filteredContacts.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No Contact Submissions Found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'No contact form submissions have been received yet.'}
          </p>
        </div>
      ) : (
        <>
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Contact Details</th>
                  <th style={thStyle}>Subject</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((contact) => (
                  <tr key={contact._id || contact.id}>
                    <td style={tdStyle}>{contact.name || 'N/A'}</td>
                    <td style={tdStyle}>{contact.contactDetails || 'N/A'}</td>
                    <td style={tdStyle}>
                      {contact.subject
                        ? contact.subject.length > 50
                          ? contact.subject.substring(0, 50) + '...'
                          : contact.subject
                        : 'N/A'}
                    </td>
                    <td style={tdStyle}>{formatDate(contact.createdAt || contact.date)}</td>
                    <td style={tdStyle}>
                      <button
                        style={viewButtonStyle}
                        onClick={() => handleViewDetails(contact)}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#3182ce')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#4299e1')}
                      >
                        View
                      </button>
                      <button
                        style={deleteButtonStyle}
                        onClick={() => handleDelete(contact._id || contact.id)}
                        disabled={deleteLoading}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#e53e3e')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#f56565')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={paginationContainerStyle}>
              <button
                style={pageButtonStyle(false)}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) e.target.style.backgroundColor = '#f7fafc';
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) e.target.style.backgroundColor = '#ffffff';
                }}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  style={pageButtonStyle(currentPage === index + 1)}
                  onClick={() => handlePageChange(index + 1)}
                  onMouseEnter={(e) => {
                    if (currentPage !== index + 1) e.target.style.backgroundColor = '#f7fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== index + 1) e.target.style.backgroundColor = '#ffffff';
                  }}
                >
                  {index + 1}
                </button>
              ))}

              <button
                style={pageButtonStyle(false)}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) e.target.style.backgroundColor = '#f7fafc';
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) e.target.style.backgroundColor = '#ffffff';
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal for viewing details */}
      {showModal && selectedContact && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalHeaderStyle}>Contact Submission Details</h2>

            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Name</label>
              <div style={modalValueStyle}>{selectedContact.name || 'N/A'}</div>
            </div>

            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Contact Details</label>
              <div style={modalValueStyle}>{selectedContact.contactDetails || 'N/A'}</div>
            </div>

            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Subject</label>
              <div style={modalValueStyle}>{selectedContact.subject || 'N/A'}</div>
            </div>

            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Message</label>
              <div style={modalValueStyle}>{selectedContact.message || 'N/A'}</div>
            </div>

            <div style={modalFieldStyle}>
              <label style={modalLabelStyle}>Submitted On</label>
              <div style={modalValueStyle}>
                {formatDate(selectedContact.createdAt || selectedContact.date)}
              </div>
            </div>

            <div style={modalButtonContainerStyle}>
              <button
                style={deleteButtonStyle}
                onClick={() => handleDelete(selectedContact._id || selectedContact.id)}
                disabled={deleteLoading}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e53e3e')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#f56565')}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                style={closeButtonStyle}
                onClick={handleCloseModal}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#4a5568')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#718096')}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;