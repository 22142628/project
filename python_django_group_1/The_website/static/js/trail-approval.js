/**
 * Outdoor Adventure Hike Tracker 
 * Admin Dashboard - Trail Approval JavaScript
 */

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const trailNameSelect = document.getElementById('trail_name_approval');
    const approvalStatusSelect = document.getElementById('approval_status');
    const editDataTextarea = document.getElementById('edit_data_approval');
    const adminCommentsTextarea = document.getElementById('admin_comments');
    const badgeSelect = document.getElementById('badge_select');
    const approvalForm = document.getElementById('approval-form');
    const successPopup = document.getElementById('successPopup');
  
    // Load trails from local storage
    loadPendingTrails();
  
    // Add event listener for trail selection
    trailNameSelect.addEventListener('change', function() {
      displayTrailData(this.value);
    });
  
    // Add event listener for form submission
    approvalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      processApprovalForm();
    });
  
    /**
     * Load pending trails from localStorage and populate the dropdown
     */
    function loadPendingTrails() {
      const allTrails = JSON.parse(localStorage.getItem('submittedTrails')) || [];
      const pendingTrails = allTrails.filter(trail => trail.status === 'Pending');
  
      // Clear existing options except the first one
      while (trailNameSelect.options.length > 1) {
        trailNameSelect.remove(1);
      }
      
      // Add pending trails to the dropdown
      if (pendingTrails.length > 0) {
        pendingTrails.forEach(trail => {
          const option = document.createElement('option');
          option.value = trail.trail_name;
          option.textContent = trail.trail_name;
          trailNameSelect.appendChild(option);
        });
      } else {
        // Add a "No pending trails" option if none exist
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = "No pending trails available";
        trailNameSelect.appendChild(option);
      }
    }
  
    /**
     * Display trail data in the textarea when a trail is selected
     * @param {string} trailName - The name of the selected trail
     */
    function displayTrailData(trailName) {
      const allTrails = JSON.parse(localStorage.getItem('submittedTrails')) || [];
      const selectedTrail = allTrails.find(trail => trail.trail_name === trailName);
  
      if (selectedTrail) {
        // Format trail data for display
        editDataTextarea.value = formatTrailData(selectedTrail);
        
        // Reset other form fields
        approvalStatusSelect.selectedIndex = 0;
        adminCommentsTextarea.value = '';
        badgeSelect.selectedIndex = 0;
      }
    }
  
    /**
     * Format trail data for display in the textarea
     * @param {Object} trail - The trail object to format
     * @return {string} - Formatted trail data
     */
    function formatTrailData(trail) {
      return `Location: ${trail.location || 'N/A'}
  GPS Coordinates: ${trail.gps || 'N/A'}
  Start/End: ${trail.start_end || 'N/A'}
  Distance: ${trail.distance || 'N/A'} km
  Elevation Gain: ${trail.elevation || 'N/A'} ft
  Difficulty: ${trail.difficulty || 'N/A'}
  Trail Type: ${trail.trail_type || 'N/A'}
  Estimated Time: ${trail.estimated_time || 'N/A'}
  Conditions: ${trail.conditions || 'N/A'}
  Accessibility: ${trail.accessibility || 'N/A'}
  Hiker/Biker: ${trail.hiker_biker || 'N/A'}
  Completed As: ${trail.completed_as || 'N/A'}
  Photos: ${trail.photos ? trail.photos.join(', ') : 'None'}
  Notes: ${trail.notes || 'N/A'}
  Submitted By: ${trail.submitted_by || 'Anonymous'}
  Submission Date: ${trail.submission_date || 'Unknown'}`;
    }
  
    /**
     * Process the approval form submission
     */
    function processApprovalForm() {
      const selectedTrailName = trailNameSelect.value;
      const selectedStatus = approvalStatusSelect.value;
      const adminComments = adminCommentsTextarea.value;
      const selectedBadge = badgeSelect.value;
  
      // Check if a trail is selected and status is not pending
      if (selectedTrailName && selectedStatus !== 'Pending') {
        // Update trail status in localStorage
        updateTrailStatus(selectedTrailName, selectedStatus, adminComments, selectedBadge);
        
        // Show success popup
        showSuccessPopup();
        
        // Reset form
        approvalForm.reset();
        
        // Reload pending trails
        loadPendingTrails();
      } else {
        alert('Please select a trail and approval status.');
      }
    }
  
    /**
     * Update trail status in localStorage
     * @param {string} trailName - The name of the trail to update
     * @param {string} status - The new status
     * @param {string} comments - Admin comments
     * @param {string} badge - Selected badge
     */
    function updateTrailStatus(trailName, status, comments, badge) {
      const allTrails = JSON.parse(localStorage.getItem('submittedTrails')) || [];
      
      const updatedTrails = allTrails.map(trail => {
        if (trail.trail_name === trailName) {
          // Update trail information
          trail.status = status;
          trail.admin_comments = comments;
          trail.review_date = getCurrentDate();
          
          // Add badge if selected
          if (badge && badge !== 'Select Badge (Optional)') {
            trail.badges = trail.badges || [];
            trail.badges.push(badge);
          }
        }
        return trail;
      });
  
      // Save updated trails to localStorage
      localStorage.setItem('submittedTrails', JSON.stringify(updatedTrails));
    }
  
    /**
     * Show success popup
     */
    function showSuccessPopup() {
      successPopup.style.display = 'block';
    }
  
    /**
     * Get current date in format YYYY-MM-DD
     * @return {string} - Formatted date string
     */
    function getCurrentDate() {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  });
  
  /**
   * Close success popup
   */
  function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'none';
  }