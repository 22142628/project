document.addEventListener('DOMContentLoaded', function() {
  
    

    // Define input filters for different field types
    const inputFilters = {
        text: /[a-zA-Z0-9\s\-]/,
        number: /[\d]/
    };
    
    // Apply input filtering to text fields
    function applyInputFilter(inputElement, filterType) {
        // Apply input filtering based on keypress event
        inputElement.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.charCode);
            const pattern = inputFilters[filterType];
            
            // Prevent the character if it doesn't match the pattern
            if (!pattern.test(char)) {
                e.preventDefault();
                return false;
            }
        });
        
        // Handle paste events to filter content being pasted
        inputElement.addEventListener('paste', function(e) {
            // Get pasted data
            let pastedText;
            if (window.clipboardData && window.clipboardData.getData) {
                pastedText = window.clipboardData.getData('Text');
            } else if (e.clipboardData && e.clipboardData.getData) {
                pastedText = e.clipboardData.getData('text/plain');
            }
            
            // Check if all characters in the pasted text match the pattern
            if (pastedText) {
                const pattern = new RegExp(`^[${inputFilters[filterType].source.slice(1, -1)}]*$`);
                
                if (!pattern.test(pastedText)) {
                    e.preventDefault();
                    return false;
                }
            }
        });
    }
    
    displayTrails(trails);
    
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.menu').classList.toggle('active');
    });
    
    const searchModal = document.getElementById('search-modal');
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const searchBtn = document.getElementById('search-trail-btn');
    const closeSearch = document.getElementById('close-search');
    
    heroSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeSearch.addEventListener('click', function() {
        searchModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    const searchForm = document.getElementById('main-search-form');
    const trailNameInput = document.getElementById('trail-name');
    const locationInput = document.getElementById('location');
    const distanceMinInput = document.getElementById('distance-min');
    const distanceMaxInput = document.getElementById('distance-max');
    
    // Apply input filtering to the search form fields
    applyInputFilter(trailNameInput, 'text');
    applyInputFilter(locationInput, 'text');
    applyInputFilter(distanceMinInput, 'number');
    applyInputFilter(distanceMaxInput, 'number');
    
    trailNameInput.addEventListener('input', function() {
        validateTrailName();
    });
    
    locationInput.addEventListener('input', function() {
        validateLocation();
    });
    
    distanceMinInput.addEventListener('input', function() {
        if (this.value && Number(this.value) < 0) {
            this.value = 0;
        }
        validateDistance();
    });
    
    distanceMaxInput.addEventListener('input', function() {
        if (this.value && Number(this.value) < 0) {
            this.value = 0;
        }
        validateDistance();
    });
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isTrailNameValid = validateTrailName();
        const isLocationValid = validateLocation();
        const isDistanceValid = validateDistance();
        
        if (isTrailNameValid && isLocationValid && isDistanceValid) {
            const filters = getFilters();
            const filteredTrails = filterTrails(filters);
            displayTrails(filteredTrails);
            searchModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
        }
    });
    
    // Comment form input filtering
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('comment-input')) {
            // Apply filtering to dynamically added comment input fields
            applyInputFilter(e.target, 'text');
        }
    });
    
    function simulateLogin(isAdmin = false) {
        document.querySelector('.profile-item').style.display = 'block';
        if (isAdmin) {
            document.querySelector('.admin-item').style.display = 'block';
        }
    }
    
    document.querySelector('.profile-item').style.display = 'none';
    document.querySelector('.admin-item').style.display = 'none';
});


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
    
    const isMinValid = !minDistance || (!isNaN(Number(minDistance)) && Number(minDistance) >= 0);
    const isMaxValid = !maxDistance || (!isNaN(Number(maxDistance)) && Number(maxDistance) >= 0);
    
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
                <form class="comment-form" data-trail-id="${trail.id}" novalidate>
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
                        <div class="error-message" id="rating-error-${trail.id}">Please select a rating</div>
                    </div>
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                    <div class="error-message" id="comment-error-${trail.id}">Please enter a valid comment</div>
                    <button type="submit" class="comment-submit">Post</button>
                </form>
            </div>
        `;
        trailResults.appendChild(trailCard);
    });
    
    setupCommentForms();
}

function setupCommentForms() {
    document.querySelectorAll('.comment-form').forEach(form => {
        const trailId = form.getAttribute('data-trail-id');
        const ratingError = document.getElementById(`rating-error-${trailId}`);
        const commentError = document.getElementById(`comment-error-${trailId}`);
        
        if (ratingError) ratingError.style.display = 'none';
        if (commentError) commentError.style.display = 'none';
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('.comment-input');
            const commentText = input.value.trim();
            const ratingInput = this.querySelector('input[name^="rating-card"]:checked');
            
            let isValid = true;
            
            if (!ratingInput) {
                if (ratingError) {
                    ratingError.style.display = 'block';
                    ratingError.textContent = 'Please select a rating';
                }
                isValid = false;
            } else {
                if (ratingError) ratingError.style.display = 'none';
            }
            
            if (!commentText || commentText.length < 2 || commentText.length > 500) {
                if (commentError) {
                    commentError.textContent = 'Comment must be between 2 and 500 characters';
                    commentError.style.display = 'block';
                }
                isValid = false;
            } else {
                if (commentError) commentError.style.display = 'none';
            }
            
            if (isValid) {
                const commentsSection = this.parentElement;
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                const ratingValue = ratingInput.value;
                const stars = '★'.repeat(parseInt(ratingValue)) + '☆'.repeat(5 - parseInt(ratingValue));
                
                newComment.innerHTML = `
                    <div class="comment-author">You</div>
                    <div class="comment-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-value">${ratingValue}.0</span>
                    </div>
                    <div class="comment-text">${commentText}</div>
                `;
                
                commentsSection.insertBefore(newComment, form);
                
                input.value = '';
                form.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.checked = false;
                });
                
                showNotification('Comment posted successfully!', 'success');
            }
        });
        
        const commentInput = form.querySelector('.comment-input');
        if (commentInput) {
            commentInput.addEventListener('input', function() {
                const commentText = this.value.trim();
                
                if (commentText.length > 0 && (commentText.length < 2 || commentText.length > 500)) {
                    commentError.textContent = 'Comment must be between 2 and 500 characters';
                    commentError.style.display = 'block';
                } else {
                    commentError.style.display = 'none';
                }
            });
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}


function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            animation: slideIn 0.3s forwards;
        }
        
        .notification.success {
            background-color: var(--primary-color);
        }
        
        .notification.error {
            background-color: var(--error-color);
        }
        
        .notification.info {
            background-color: var(--admin-primary);
        }
        
        .notification.fade-out {
            animation: fadeOut 0.5s forwards;
        }
        
        @keyframes slideIn {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateY(20px);
            }
        }
    `;
    document.head.appendChild(style);
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('header-shrink');
    } else {
        header.classList.remove('header-shrink');
    }
});
addNotificationStyles();