const API_BASE_URL_REVIEW = '../backend/controllers/reviewsController.php';
const API_BASE_URL = '../backend/controllers/itemsController.php';

function displayError(message, containerId = 'detail-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="error bg-red-100 border-red-400 text-red-700 p-4 rounded">
            ${message}
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Get ID from URL
        const itemId = new URLSearchParams(window.location.search).get('id');
        if (!itemId) throw new Error('Missing item ID');

        // Try to load from sessionStorage first
        const storedItem = JSON.parse(sessionStorage.getItem('selectedItem'));

        // 3. Load item data
        const itemData = storedItem?.id == itemId ? storedItem : await loadItemFromAPI(itemId);
        if (!itemData) throw new Error('Item not found');

        // 4. Display the item
        populateItemDetails(itemData);

        // 5. Load reviews
        await loadReviewsForItem(itemId); // Load reviews specifically for this itemawait loadAndDisplayReviews(itemId);

        // 6. Setup review form
        document.getElementById('review-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitReview(itemId);
        });

    } catch (error) {
        displayError(error.message);
        console.error('Initialization error:', error);
    }
    });

    // new helper function
async function loadItemFromAPI(itemId) {
    const response = await fetch(`${API_BASE_URL}?id=${itemId}`);
    if (!response.ok) throw new Error('Failed to fetch item');
    return await response.json();
    }

async function loadReviewsForItem(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL_REVIEW}?item_id=${itemId}`);
        const data = await response.json();

        if (data.reviews && data.reviews.length > 0) {
            renderReviews(data.reviews, data.average_rating || 0);
        } else {
            document.getElementById('reviews-container').innerHTML = 
                '<p class="text-gray-500">No reviews yet</p>';
        }
    } catch (error) {
        console.error('Failed to load reviews:', error);
        displayError('Failed to load reviews', 'reviews-container');
    }
}

async function loadAndDisplayReviews(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL_REVIEW}?item_id=${itemId}`);
        if (!response.ok) throw new Error('Failed to load reviews');

        const { reviews = [], average_rating = 0 } = await response.json();
        renderReviews(reviews, average_rating);
    } catch (error) {
        displayError('Failed to load reviews', 'reviews-container');
    }
    }

function renderReviews(reviews, averageRating) {
    const reviewsContainer = document.getElementById('reviews-container');
    const ratingContainer = document.getElementById('average-rating');

    // Update average rating display
    if (ratingContainer) {
        ratingContainer.innerHTML = `
            <span class="text-2xl font-bold">${averageRating.toFixed(1)}</span>
            <span class="text-yellow-400">${'★'.repeat(Math.round(averageRating))}${'☆'.repeat(5 - Math.round(averageRating))}</span>
            <span class="text-gray-500">(${reviews.length} reviews)</span>
        `;
    }

    // Render individual reviews
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="mb-4 p-4 bg-white rounded-lg shadow">
            <div class="flex justify-between items-center mb-2">
                <span class="font-semibold">${review.reviewer_name || 'Anonymous'}</span>
                <span class="text-yellow-400">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p class="text-gray-700">${review.review_text}</p>
            <p class="text-xs text-gray-500 mt-2">
                ${new Date(review.created_at).toLocaleDateString()}
            </p>
        </div>
    `).join('');
}

async function submitReview(itemId) {
    const reviewText = document.getElementById('review-text').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 5;
    const ID = new URLSearchParams(window.location.search).get('id');


    if (!reviewText) {
        alert('Please write your review before submitting');
        return;
    }

    const submitBtn = document.querySelector('#review-form button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

    try {
        const response = await fetch(API_BASE_URL_REVIEW, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id: ID,
                review_text: reviewText,
                rating: parseInt(rating),
                reviewer_name: "Anonymous"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        
        // Clear form
        document.getElementById('review-text').value = '';
        document.getElementById('review-form').reset();
        
        // Update reviews display directly with returned data
        if (responseData.reviews && responseData.average_rating) {
            renderReviews(responseData.reviews, responseData.average_rating);
        }
        
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
    }
}

// Populate item details on the page
function populateItemDetails(item) {
    const detailImage = document.getElementById('detailImage');
    const itemName = document.getElementById('itemName');
    const itemOwner = document.getElementById('itemOwner');
    const itemPrice = document.getElementById('itemPrice');
    const itemFormat = document.getElementById('itemFormat');
    const itemContact = document.getElementById('itemContact');
    const itemOverview = document.getElementById('itemOverview');

    if (detailImage) detailImage.src = item.image || 'img/default-item.png';
    if (itemName) itemName.textContent = item.title || 'Untitled Item';
    if (itemOwner) itemOwner.textContent = `By ${item.author || 'Unknown'}`;
    if (itemPrice) itemPrice.textContent = `Price: ${item.price || '0.00'} BD`;
    if (itemFormat) itemFormat.textContent = `Format: ${item.format || 'Unknown'}`;
    if (itemContact) itemContact.textContent = `Contact No: ${item.contact || 'Not provided'}`;
    if (itemOverview) itemOverview.textContent = item.overview || 'No description available';
}

// Add a review to the UI
function addReviewToUI(review) {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'w-64 p-4 bg-gray-50 rounded-lg border border-gray-200';
    reviewElement.innerHTML = `
        <p class="text-gray-700 italic">"${review.text}"</p>
        <p class="text-xs text-gray-500 mt-1">
            ${new Date(review.date).toLocaleDateString()}
        </p>
    `;
    
    const reviewsContainer = document.getElementById('reviews-container');
    
    // Remove "no reviews" message if it exists
    if (reviewsContainer.querySelector('p.text-gray-500')) {
        reviewsContainer.innerHTML = '';
    }
    
    reviewsContainer.prepend(reviewElement);
}

// Update item reviews in the API
async function updateItemReviews(itemId, newReview) {
    // 1. Get current item data
    const response = await fetch(`API_BASE_URL_review?item_id=${itemId}`);
    if (!response.ok) throw new Error('Failed to fetch item data');
    
    const item = await response.json();
    
    // 2. Initialize reviews array if needed
    if (!Array.isArray(item.customerReviews)) {
        item.customerReviews = [];
    }
    
    // 3. Add new review
    item.customerReviews.unshift(newReview);
    
    // 4. Update item in API
    const updateResponse = await fetch(`../backend/controllers/reviewsController.php?item_id=${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customerReviews: item.customerReviews
        })
    });
    
    if (!updateResponse.ok) {
        throw new Error('Failed to update reviews in API');
    }
}

// Render all reviews
function renderReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');

    if (!reviews || reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-gray-500 text-center">No reviews yet</p>';
        return;
    }

    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="w-64 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="font-semibold">${review.reviewer_name || 'Anonymous'}</p>
            <div class="flex items-center mb-2">
                ${'★'.repeat(review.rating || 5)}${'☆'.repeat(5 - (review.rating || 5))}
            </div>
            <p class="text-gray-700 italic">"${review.review_text}"</p>
            <p class="text-xs text-gray-500 mt-1">
                ${new Date(review.created_at).toLocaleDateString()}
            </p>
        </div>
    `).join('');
}