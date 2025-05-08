document.addEventListener("DOMContentLoaded", async function() {
    // Get item ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const itemDataEncoded = urlParams.get('data');

    // Load item data
    let itemData;
    try {
        if (itemDataEncoded) {
            itemData = JSON.parse(decodeURIComponent(itemDataEncoded));
        } else if (itemId) {
            // Try to fetch from API if no encoded data
            const response = await fetch(`https://680d0e83c47cb8074d8f6cb6.mockapi.io/items/${itemId}`);
            if (response.ok) {
                itemData = await response.json();
            }
        }

        if (!itemData) {
            throw new Error("Item data not available");
        }

        // Populate item details
        populateItemDetails(itemData);

        // Set up review form
        document.getElementById('review-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleReviewSubmission(itemData.id);
        });

    } catch (error) {
        console.error("Error loading item details:", error);
        alert("Failed to load item details. Please try again.");
    }
});

// Populate item details on the page
function populateItemDetails(item) {
    document.getElementById('detailImage').src = item.image || 'img/default-item.png';
    document.getElementById('itemName').textContent = item.title || 'Untitled Item';
    document.getElementById('itemOwner').textContent = `By ${item.author || 'Unknown'}`;
    document.getElementById('itemPrice').textContent = `Price: ${item.price || '0.00'} BD`;
    document.getElementById('itemFormat').textContent = `Format: ${item.format || 'Unknown'}`;
    document.getElementById('itemContact').textContent = `Contact No: ${item.contact || 'Not provided'}`;
    
    // Set overview text (preserving any existing HTML structure)
    const overviewElement = document.getElementById('itemOverview');
    if (overviewElement) {
        overviewElement.textContent = item.overview || 'No description available';
    }

    // Load reviews if they exist
    if (Array.isArray(item.customerReviews)) {
        renderReviews(item.customerReviews);
    } else {
        document.getElementById('reviews-container').innerHTML = 
            '<p class="text-gray-500 text-center">No reviews yet</p>';
    }
}

// Handle review submission
async function handleReviewSubmission(itemId) {
    const reviewText = document.getElementById('review-text').value.trim();
    if (!reviewText) {
        alert('Please write a review before submitting.');
        return;
    }

    const submitBtn = document.querySelector('#review-form button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // Create new review object
        const newReview = {
            text: reviewText,
            date: new Date().toISOString(),
            reviewer: "User" // You can replace with actual user data
        };

        // 1. Add to UI immediately (optimistic update)
        addReviewToUI(newReview);

        // 2. Clear the form
        document.getElementById('review-text').value = '';

        // 3. Update the API
        await updateItemReviews(itemId, newReview);

        // Show success message
        alert('Thank you for your review!');

    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
    }
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
    const response = await fetch(`https://680d0e83c47cb8074d8f6cb6.mockapi.io/items/${itemId}`);
    if (!response.ok) throw new Error('Failed to fetch item data');
    
    const item = await response.json();
    
    // 2. Initialize reviews array if needed
    if (!Array.isArray(item.customerReviews)) {
        item.customerReviews = [];
    }
    
    // 3. Add new review
    item.customerReviews.unshift(newReview);
    
    // 4. Update item in API
    const updateResponse = await fetch(`https://680d0e83c47cb8074d8f6cb6.mockapi.io/items/${itemId}`, {
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
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="w-64 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-gray-700 italic">"${review.text || review}"</p>
            ${review.date ? `<p class="text-xs text-gray-500 mt-1">${new Date(review.date).toLocaleDateString()}</p>` : ''}
        </div>
    `).join('');
}