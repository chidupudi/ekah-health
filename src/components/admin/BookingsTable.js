import React, { useState, useEffect } from 'react';
import { bookingsDB, timeSlotsDB } from '../../services/firebase/database.js';
import { useTheme } from '../ParticleBackground';
import './BookingsTable.css';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, rejected
  const { theme } = useTheme();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const allBookings = await bookingsDB.getAll();
      // Sort by creation date, most recent first
      const sortedBookings = allBookings.sort((a, b) => 
        new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      alert('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (booking) => {
    try {
      setActionLoading(prev => ({ ...prev, [booking.id]: 'confirming' }));
      
      const adminData = {
        adminId: 'admin_001', // You can get this from auth context
        notes: 'Booking confirmed by admin'
      };

      const result = await timeSlotsDB.atomicAdminConfirmBooking(booking.id, adminData);
      
      console.log('Booking confirmed:', result);
      alert('Booking confirmed successfully! Meet link has been sent to the patient.');
      
      // Refresh bookings list
      await loadBookings();
      
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [booking.id]: null }));
    }
  };

  const handleRejectBooking = async (booking) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(prev => ({ ...prev, [booking.id]: 'rejecting' }));
      
      const rejectionData = {
        adminId: 'admin_001',
        reason: reason,
        notes: 'Booking rejected by admin'
      };

      const result = await timeSlotsDB.atomicAdminRejectBooking(booking.id, rejectionData);
      
      console.log('Booking rejected:', result);
      alert('Booking rejected successfully. Patient has been notified.');
      
      // Refresh bookings list
      await loadBookings();
      
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [booking.id]: null }));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'status-pending', text: 'Pending', icon: '⏳' },
      'pending_admin_confirmation': { class: 'status-pending', text: 'Needs Confirmation', icon: '⚠️' },
      'confirmed': { class: 'status-confirmed', text: 'Confirmed', icon: '✅' },
      'rejected': { class: 'status-rejected', text: 'Rejected', icon: '❌' },
      'cancelled': { class: 'status-cancelled', text: 'Cancelled', icon: '🚫' },
      'completed': { class: 'status-completed', text: 'Completed', icon: '🎉' }
    };

    const config = statusConfig[status] || { class: 'status-unknown', text: status, icon: '❓' };
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getActionButtons = (booking) => {
    const isLoading = actionLoading[booking.id];
    
    switch (booking.status) {
      case 'pending_admin_confirmation':
        return (
          <div className="action-buttons">
            <button 
              className="btn-confirm"
              onClick={() => handleConfirmBooking(booking)}
              disabled={isLoading}
            >
              {isLoading === 'confirming' ? '⏳ Confirming...' : '✅ Confirm'}
            </button>
            <button 
              className="btn-reject"
              onClick={() => handleRejectBooking(booking)}
              disabled={isLoading}
            >
              {isLoading === 'rejecting' ? '⏳ Rejecting...' : '❌ Reject'}
            </button>
          </div>
        );
      
      case 'confirmed':
        return (
          <div className="action-buttons">
            <span className="confirmed-info">
              ✅ Confirmed
              {booking.meetLink && (
                <a 
                  href={booking.meetLink.url || booking.meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="meet-link-btn"
                >
                  🎥 Join Meeting
                </a>
              )}
            </span>
          </div>
        );
      
      case 'rejected':
        return (
          <div className="action-buttons">
            <span className="rejected-info">
              ❌ Rejected: {booking.rejectionReason || 'No reason provided'}
            </span>
          </div>
        );
      
      case 'cancelled':
        return (
          <div className="action-buttons">
            <span className="cancelled-info">
              🚫 Cancelled: {booking.cancellationReason || 'No reason provided'}
            </span>
          </div>
        );
      
      default:
        return <span className="no-action">-</span>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'pending_admin_confirmation';
    return booking.status === filter;
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="bookings-loading">⏳ Loading bookings...</div>;
  }

  return (
    <div className={`bookings-table-container ${theme}-theme`}>
      <div className="bookings-header">
        <h2>📅 Bookings Management</h2>
        
        <div className="bookings-filters">
          <button 
            className={filter === 'all' ? 'filter-active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button 
            className={filter === 'pending' ? 'filter-active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({bookings.filter(b => b.status === 'pending_admin_confirmation').length})
          </button>
          <button 
            className={filter === 'confirmed' ? 'filter-active' : ''}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button 
            className={filter === 'rejected' ? 'filter-active' : ''}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({bookings.filter(b => b.status === 'rejected').length})
          </button>
        </div>

        <button className="refresh-btn" onClick={loadBookings}>
          🔄 Refresh
        </button>
      </div>

      <div className="bookings-table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Patient Info</th>
              <th>Contact</th>
              <th>Service</th>
              <th>Appointment Date</th>
              <th>Status</th>
              <th>Medical Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id} className={`booking-row ${booking.status}`}>
                <td>
                  <span className="booking-id">{booking.id}</span>
                  <small className="booking-date">
                    Created: {formatDate(booking.createdAt)}
                  </small>
                </td>
                
                <td>
                  <div className="patient-info">
                    <strong>{booking.firstName} {booking.lastName}</strong>
                    {booking.age && <div>Age: {booking.age}</div>}
                    {booking.gender && <div>Gender: {booking.gender}</div>}
                  </div>
                </td>
                
                <td>
                  <div className="contact-info">
                    <div>📧 <a href={`mailto:${booking.email}`}>{booking.email}</a></div>
                    {booking.phone && <div>📞 <a href={`tel:${booking.phone}`}>{booking.phone}</a></div>}
                  </div>
                </td>
                
                <td>
                  <span className="service-type">
                    {booking.serviceType || 'General Consultation'}
                  </span>
                </td>
                
                <td>
                  <div className="appointment-time">
                    <strong>📅 {booking.confirmedDate || booking.preferredDate}</strong>
                    <div>🕒 {booking.confirmedTime || booking.preferredTime}</div>
                  </div>
                </td>
                
                <td>
                  {getStatusBadge(booking.status)}
                  {booking.confirmedBy && (
                    <div className="confirmed-by">
                      By: {booking.confirmedBy}
                    </div>
                  )}
                </td>
                
                <td>
                  <div className="medical-info">
                    {booking.medicalHistory && (
                      <div className="medical-item">
                        <strong>History:</strong>
                        <span className="medical-text">{booking.medicalHistory.substring(0, 50)}...</span>
                      </div>
                    )}
                    {booking.currentConcerns && (
                      <div className="medical-item">
                        <strong>Concerns:</strong>
                        <span className="medical-text">{booking.currentConcerns.substring(0, 50)}...</span>
                      </div>
                    )}
                    {booking.specialRequests && (
                      <div className="medical-item">
                        <strong>Requests:</strong>
                        <span className="medical-text">{booking.specialRequests.substring(0, 50)}...</span>
                      </div>
                    )}
                  </div>
                </td>
                
                <td>
                  {getActionButtons(booking)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="no-bookings">
            📭 No bookings found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsTable;