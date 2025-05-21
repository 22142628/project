
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.querySelector('.menu').classList.toggle('active');
        });
    }
    
    // Search modal controls
    const searchModal = document.getElementById('search-modal');
    const searchBtn = document.getElementById('search-trail-btn');
    const closeSearch = document.getElementById('close-search');
    
    // Hero search button (may not exist on all pages)
    const heroSearchBtn = document.getElementById('hero-search-btn');
    
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchModal.style.display = 'flex';
        });
    }
    
    if (searchBtn && closeSearch && searchModal) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchModal.style.display = 'flex';
        });
        
        closeSearch.addEventListener('click', function() {
            searchModal.style.display = 'none';
        });
        
        // Close when clicking outside the search container
        window.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                searchModal.style.display = 'none';
            }
        });
    }
    
    // Form validation
    const searchForm = document.getElementById('main-search-form');
    if (searchForm) {
        const trailNameInput = document.getElementById('trail-name');
        const locationInput = document.getElementById('location');
        const distanceMinInput = document.getElementById('distance-min');
        const distanceMaxInput = document.getElementById('distance-max');
        
        // Trail Name validation
        if (trailNameInput) {
            trailNameInput.addEventListener('input', function() {
                validateTrailName();
            });
        }
        
        // Location validation
        if (locationInput) {
            locationInput.addEventListener('input', function() {
                validateLocation();
            });
        }
        
        // Distance validation
        if (distanceMinInput) {
            distanceMinInput.addEventListener('input', function() {
                // Force value to be non-negative
                if (this.value && Number(this.value) < 0) {
                    this.value = 0;
                }
                validateDistance();
            });
        }
        
        if (distanceMaxInput) {
            distanceMaxInput.addEventListener('input', function() {
                // Force value to be non-negative
                if (this.value && Number(this.value) < 0) {
                    this.value = 0;
                }
                validateDistance();
            });
        }
        
        // Form submission with validation
        searchForm.addEventListener('submit', function(e) {
            // For Django-based form submission, we'll only validate but not prevent submission
            // unless validation fails
            
            // Validate all fields
            const isTrailNameValid = validateTrailName();
            const isLocationValid = validateLocation();
            const isDistanceValid = validateDistance();
            
            // If any validation fails, prevent form submission
            if (!isTrailNameValid || !isLocationValid || !isDistanceValid) {
                e.preventDefault();
            }
        });
    }
});

// Validation functions
function validateTrailName() {
    const trailName = document.getElementById('trail-name');
    if (!trailName) return true;
    
    const errorElement = document.getElementById('trail-name-error');
    
    if (trailName.value && !/^[a-zA-Z0-9\s\-]+$/.test(trailName.value)) {
        errorElement.textContent = 'Trail name may only contain letters, numbers, spaces, and hyphens.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateLocation() {
    const location = document.getElementById('location');
    if (!location) return true;
    
    const errorElement = document.getElementById('location-error');
    
    if (location.value && !/^[a-zA-Z0-9\s\-]+$/.test(location.value)) {
        errorElement.textContent = 'Location may only contain letters, numbers, spaces, and hyphens.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateDistance() {
    const minDistance = document.getElementById('distance-min');
    const maxDistance = document.getElementById('distance-max');
    if (!minDistance || !maxDistance) return true;
    
    const errorElement = document.getElementById('distance-error');
    
    // Check if inputs are numbers
    const isMinValid = !minDistance.value || (!isNaN(Number(minDistance.value)) && Number(minDistance.value) >= 0);
    const isMaxValid = !maxDistance.value || (!isNaN(Number(maxDistance.value)) && Number(maxDistance.value) >= 0);
    
    // Check if min is less than max when both are provided
    const isRangeValid = !minDistance.value || !maxDistance.value ||
                         (Number(minDistance.value) <= Number(maxDistance.value));
    
    if (!isMinValid || !isMaxValid) {
        if ((minDistance.value && isNaN(Number(minDistance.value))) || (maxDistance.value && isNaN(Number(maxDistance.value)))) {
            errorElement.textContent = 'Distance values must be numbers.';
        } else {
            errorElement.textContent = 'Distance values cannot be negative.';
        }
        return false;
    } else if (!isRangeValid) {
        errorElement.textContent = 'Minimum distance must be less than or equal to maximum distance.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}