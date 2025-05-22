


document.addEventListener('DOMContentLoaded', function() {
   
    const trailNameSelect = document.getElementById('trail_name_approval');
    const approvalStatusSelect = document.getElementById('approval_status');
    const editDataTextarea = document.getElementById('edit_data_approval');
    const adminCommentsTextarea = document.getElementById('admin_comments');
    const badgeSelect = document.getElementById('badge_select');
    const approvalForm = document.getElementById('approval-form');
    const successPopup = document.getElementById('successPopup');
  
  
    loadPendingTrails();
  
    
    trailNameSelect.addEventListener('change', function() {
      displayTrailData(this.value);
    });
  
   
    approvalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      processApprovalForm();
    });
  
   
    function loadPendingTrails() {
      const allTrails = JSON.parse(localStorage.getItem('submittedTrails')) || [];
      const pendingTrails = allTrails.filter(trail => trail.status === 'Pending');
  
      
      while (trailNameSelect.options.length > 1) {
        trailNameSelect.remove(1);
      }
      
     
      if (pendingTrails.length > 0) {
        pendingTrails.forEach(trail => {
          const option = document.createElement('option');
          option.value = trail.trail_name;
          option.textContent = trail.trail_name;
          trailNameSelect.appendChild(option);
        });
      } else {
        
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
       
        editDataTextarea.value = formatTrailData(selectedTrail);
        
    
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
  
   
    function processApprovalForm() {
      const selectedTrailName = trailNameSelect.value;
      const selectedStatus = approvalStatusSelect.value;
      const adminComments = adminCommentsTextarea.value;
      const selectedBadge = badgeSelect.value;
  
      
      if (selectedTrailName && selectedStatus !== 'Pending') {
       
        updateTrailStatus(selectedTrailName, selectedStatus, adminComments, selectedBadge);
        
        
        showSuccessPopup();
        
       
        approvalForm.reset();
        
        
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
          
          trail.status = status;
          trail.admin_comments = comments;
          trail.review_date = getCurrentDate();
          
         
          if (badge && badge !== 'Select Badge (Optional)') {
            trail.badges = trail.badges || [];
            trail.badges.push(badge);
          }
        }
        return trail;
      });
  
     
      localStorage.setItem('submittedTrails', JSON.stringify(updatedTrails));
    }
  
   
    function showSuccessPopup() {
      successPopup.style.display = 'block';
    }
  
    /**
     * Get current date in format YYYY-MM-DD
     * @return {string} 
     */
    function getCurrentDate() {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  });
  
 
  function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'none';
  }