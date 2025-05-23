document.addEventListener('DOMContentLoaded', function () {
  const trailNameSelect = document.getElementById('trail_name_approval');
  const approvalStatusSelect = document.getElementById('approval_status');
  const editDataTextarea = document.getElementById('edit_data_approval');
  const adminCommentsTextarea = document.getElementById('admin_comments');
  const approvalForm = document.getElementById('approval-form');
  const successPopup = document.getElementById('successPopup');

  trailNameSelect.addEventListener('change', function () {
    const selected = this.options[this.selectedIndex];
    const details = `
Trail Name: ${selected.text}
Location: ${selected.dataset.location}
Distance: ${selected.dataset.distance} km
Elevation: ${selected.dataset.elevation} m
Difficulty: ${selected.dataset.difficulty}
Type: ${selected.dataset.type}
Estimated Time: ${selected.dataset.time} hrs
GPS: ${selected.dataset.gps}
Start/End: ${selected.dataset.start_end}
Description: ${selected.dataset.description}
`;
    editDataTextarea.value = details;
    adminCommentsTextarea.value = '';
    approvalStatusSelect.selectedIndex = 0;
  });

  approvalForm.addEventListener('submit', function (e) {
    if (!trailNameSelect.value || !approvalStatusSelect.value || approvalStatusSelect.value === 'Pending') {
      e.preventDefault();
      alert('Please select a trail and approval status before submitting.');
    }
  });
});

function closePopup() {
  const popup = document.getElementById('successPopup');
  popup.style.display = 'none';
}
