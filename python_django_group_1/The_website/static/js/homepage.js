
document.addEventListener('DOMContentLoaded', function() {
    // Display trails initially
    displayTrails(trails);
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.menu').classList.toggle('active');
    });
    
    // Search modal controls
    const searchModal = document.getElementById('search-modal');
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const searchBtn = document.getElementById('search-trail-btn');
    const closeSearch = document.getElementById('close-search');
    
    heroSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchModal.style.display = 'flex';
    });
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchModal.style.display = 'flex';
    });
    
    closeSearch.addEventListener('click', function() {
        searchModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
        }
    });
    
    // Form validation
    const searchForm = document.getElementById('main-search-form');
    const trailNameInput = document.getElementById('trail-name');
    const locationInput = document.getElementById('location');
    const distanceMinInput = document.getElementById('distance-min');
    const distanceMaxInput = document.getElementById('distance-max');
    
    // Trail Name validation
    trailNameInput.addEventListener('input', function() {
        validateTrailName();
    });
    
    // Location validation
    locationInput.addEventListener('input', function() {
        validateLocation();
    });
    
    // Distance validation
    distanceMinInput.addEventListener('input', function() {
        // Force value to be non-negative
        if (this.value && Number(this.value) < 0) {
            this.value = 0;
        }
        validateDistance();
    });
    
    distanceMaxInput.addEventListener('input', function() {
        // Force value to be non-negative
        if (this.value && Number(this.value) < 0) {
            this.value = 0;
        }
        validateDistance();
    });
    
    // Form submission with validation
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isTrailNameValid = validateTrailName();
        const isLocationValid = validateLocation();
        const isDistanceValid = validateDistance();
        
        // If all validations pass
        if (isTrailNameValid && isLocationValid && isDistanceValid) {
            const filters = getFilters();
            const filteredTrails = filterTrails(filters);
            displayTrails(filteredTrails);
            searchModal.style.display = 'none';
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
        }
    });
    
    // Simulated login functionality
    function simulateLogin(isAdmin = false) {
        document.querySelector('.profile-item').style.display = 'block';
        if (isAdmin) {
            document.querySelector('.admin-item').style.display = 'block';
        }
    }
    
    // Initially hide profile and admin items
    document.querySelector('.profile-item').style.display = 'none';
    document.querySelector('.admin-item').style.display = 'none';
});

// Validation functions
function validateTrailName() {
    const trailName = document.getElementById('trail-name').value;
    const errorElement = document.getElementById('trail-name-error');
    
    if (trailName && !/^[a-zA-Z0-9\s\-]+$/.test(trailName)) {
        errorElement.textContent = 'Trail name may only contain letters, numbers, spaces, and hyphens.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateLocation() {
    const location = document.getElementById('location').value;
    const errorElement = document.getElementById('location-error');
    
    if (location && !/^[a-zA-Z0-9\s\-]+$/.test(location)) {
        errorElement.textContent = 'Location may only contain letters, numbers, spaces, and hyphens.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateDistance() {
    const minDistance = document.getElementById('distance-min').value;
    const maxDistance = document.getElementById('distance-max').value;
    const errorElement = document.getElementById('distance-error');
    
    // Check if inputs are numbers
    const isMinValid = !minDistance || (!isNaN(Number(minDistance)) && Number(minDistance) >= 0);
    const isMaxValid = !maxDistance || (!isNaN(Number(maxDistance)) && Number(maxDistance) >= 0);
    
    // Check if min is less than max when both are provided
    const isRangeValid = !minDistance || !maxDistance ||
                         (Number(minDistance) <= Number(maxDistance));
    
    if (!isMinValid || !isMaxValid) {
        if (minDistance && isNaN(Number(minDistance)) || maxDistance && isNaN(Number(maxDistance))) {
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

// Get the filters from the form
function getFilters() {
    return {
        name: document.getElementById('trail-name').value.toLowerCase(),
        location: document.getElementById('location').value.toLowerCase(),
        difficulty: document.getElementById('difficulty').value,
        minDistance: document.getElementById('distance-min').value ? Number(document.getElementById('distance-min').value) : '',
        maxDistance: document.getElementById('distance-max').value ? Number(document.getElementById('distance-max').value) : '',
        type: document.getElementById('trail-type').value,
        minRating: document.querySelector('input[name="rating"]:checked')?.value
    };
}

// Filter trails based on the criteria
function filterTrails(filters) {
    return trails.filter(trail => {
        const nameMatch = !filters.name || trail.name.toLowerCase().includes(filters.name);
        const locationMatch = !filters.location || trail.location.toLowerCase().includes(filters.location);
        const difficultyMatch = !filters.difficulty || trail.difficulty === filters.difficulty;
        const minDistanceMatch = !filters.minDistance || trail.distance >= filters.minDistance;
        const maxDistanceMatch = !filters.maxDistance || trail.distance <= filters.maxDistance;
        const typeMatch = !filters.type || trail.type === filters.type;
        const ratingMatch = !filters.minRating || trail.rating >= Number(filters.minRating);
        
        return nameMatch && locationMatch && difficultyMatch && minDistanceMatch && 
               maxDistanceMatch && typeMatch && ratingMatch;
    });
}

// Display filtered trails
function displayTrails(trailsToDisplay) {
    const trailResults = document.getElementById('trail-results');
    trailResults.innerHTML = '';
    
    if (trailsToDisplay.length === 0) {
        trailResults.innerHTML = '<p class="no-results">No trails found matching your criteria.</p>';
        return;
    }
    
    trailsToDisplay.forEach(trail => {
        const trailCard = document.createElement('div');
        trailCard.className = 'trail-card';
        trailCard.innerHTML = `
            <img src="${trail.image}" alt="${trail.name}">
            <div class="trail-info">
                <h3>${trail.name}</h3>
                <div class="trail-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${trail.location}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${trail.difficulty}</span>
                    <span><i class="fas fa-road"></i> ${trail.distance}km</span>
                    <span><i class="fas fa-star"></i> ${trail.rating}</span>
                </div>
                <p>${trail.description}</p>
                <a href="#" class="trail-link">VIEW TRAIL DETAILS →</a>
            </div>
            <div class="comments-section">
                <h4>Comments & Ratings</h4>
                ${trail.comments.map(comment => `
                    <div class="comment">
                        <div class="comment-author">${comment.author}</div>
                        <div class="comment-rating">
                            <span class="stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}</span>
                            <span class="rating-value">${comment.rating}.0</span>
                        </div>
                        <div class="comment-text">${comment.text}</div>
                    </div>
                `).join('')}
                <form class="comment-form" data-trail-id="${trail.id}">
                    <div class="rating-input">
                        <span>Your Rating: </span>
                        <div class="rating">
                            <input type="radio" id="star5-card${trail.id}" name="rating-card${trail.id}" value="5">
                            <label for="star5-card${trail.id}" title="5 stars">★</label>
                            <input type="radio" id="star4-card${trail.id}" name="rating-card${trail.id}" value="4">
                            <label for="star4-card${trail.id}" title="4 stars">★</label>
                            <input type="radio" id="star3-card${trail.id}" name="rating-card${trail.id}" value="3">
                            <label for="star3-card${trail.id}" title="3 stars">★</label>
                            <input type="radio" id="star2-card${trail.id}" name="rating-card${trail.id}" value="2">
                            <label for="star2-card${trail.id}" title="2 stars">★</label>
                            <input type="radio" id="star1-card${trail.id}" name="rating-card${trail.id}" value="1">
                            <label for="star1-card${trail.id}" title="1 star">★</label>
                        </div>
                    </div>
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                    <button type="submit" class="comment-submit">Post</button>
                </form>
            </div>
        `;
        trailResults.appendChild(trailCard);
    });
    
    // Add event listeners for comment forms
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.comment-input');
            const commentText = input.value.trim();
            const ratingInput = this.querySelector('input[name^="rating-card"]:checked');
            
            if (!ratingInput) {
                alert('Please select a rating before submitting your comment.');
                return;
            }
            
            if (commentText) {
                const commentsSection = this.parentElement;
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                const ratingValue = ratingInput.value;
                const stars = '★'.repeat(ratingValue) + '☆'.repeat(5 - ratingValue);
                
                newComment.innerHTML = `
                    <div class="comment-author">You</div>
                    <div class="comment-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-value">${ratingValue}.0</span>
                    </div>
                    <div class="comment-text">${commentText}</div>
                `;
                
                // Insert the new comment before the form
                commentsSection.insertBefore(newComment, this);
                
                // Reset the form
                input.value = '';
                this.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.checked = false;
                });
            }
        });
    });
}