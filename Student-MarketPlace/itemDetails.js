function populateItemDetails(item) {
    console.log('Complete item data:', item);
    
    // Update Contact Info (check all possible fields)
    const contactValue = item.contact || item.contactInfo || item.phone;
    document.getElementById('itemContact').textContent = 
        `Contact No: ${contactValue || 'Not provided'}`;
    
    // Update Overview (check all possible fields)
    const overviewValue = item.overview || item.description || item.details;
    document.getElementById('itemOverview').innerHTML = 
        (overviewValue || 'No description available').replace(/\n/g, '<br>');
    
    // Update Reviews - handle both array and number
    let reviews = [];
    if (Array.isArray(item.customerReviews)) {
        reviews = item.customerReviews;
    } else if (typeof item.customerReviews === 'number' && item.customerReviews > 0) {
        reviews = [`${item.customerReviews} verified reviews`];
    }
    
    const reviewsContainer = document.querySelector('#customer-review .flex.flex-wrap');
    reviewsContainer.innerHTML = reviews.length > 0
        ? reviews.map(review => `
            <div class="w-64 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-gray-700 italic">${review}</p>
            </div>
          `).join('')
        : '<div class="w-full text-center py-4 text-gray-500">No reviews yet</div>';
}

// Update transformItemData to ensure proper field mapping
function transformItemData(apiItem) {
    // First check for the actual field names in your API response
    console.log('API Item Structure:', Object.keys(apiItem));
    
    return {
        id: apiItem.id,
        title: apiItem.name || apiItem.title,
        author: apiItem.seller || apiItem.author,
        price: apiItem.price?.toString(),
        image: apiItem.imageUrl || apiItem.image,
        format: apiItem.format,
        // Check all possible field names the API might use
        contact: apiItem.contact || apiItem.contactInfo || apiItem.phone || 'Not provided',
        overview: apiItem.overview || apiItem.description || apiItem.details || 'No description available',
        // Handle both the API's reviews field and your local customerReviews
        customerReviews: apiItem.customerReviews || []
    };
}

async function fetchItemFromApi(itemId) {
    // Skip if ID doesn't look like a MockAPI ID
    if (!/^\d+$/.test(itemId)) {
        console.log(`Skipping API fetch for non-numeric ID: ${itemId}`);
        return false;
    }

    try {
        console.log(`Fetching item ${itemId} from API`);
        const response = await fetch(`https://680d0e83c47cb8074d8f6cb6.mockapi.io/items/${itemId}`);

        if (!response.ok) {
            // Special handling for 404s
            if (response.status === 404) {
                console.log(`Item ${itemId} not found in API`);
                return false;
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        const apiItem = await response.json();
        console.log('Received API data:', apiItem);

        // Transform and cache the data
        const itemData = transformItemData(apiItem);
        cacheItem(itemData);
        
        populateItemDetails(itemData);
        return true;

    } catch (error) {
        console.error('API fetch failed:', error);
        return false;
    }
}

// transformItemData to ensure proper field mapping
function transformItemData(apiItem) {
    // First check for the actual field names in your API response
    console.log('API Item Structure:', Object.keys(apiItem));
    
    return {
        id: apiItem.id,
        title: apiItem.name || apiItem.title,
        author: apiItem.seller || apiItem.author,
        price: apiItem.price?.toString(),
        image: apiItem.imageUrl || apiItem.image,
        format: apiItem.format,
        // Check all possible field names the API might use
        contact: apiItem.contact || apiItem.contactInfo || apiItem.phone || 'Not provided',
        overview: apiItem.overview || apiItem.description || apiItem.details || 'No description available',
        // Handle both the API's reviews field and your local customerReviews
        customerReviews: apiItem.customerReviews || []
    };
}

function cacheItem(itemData) {
    const cachedItems = JSON.parse(localStorage.getItem('marketplaceItems') || []);
    const existingIndex = cachedItems.findIndex(i => i.id === itemData.id);
    
    if (existingIndex >= 0) {
        cachedItems[existingIndex] = itemData;
    } else {
        cachedItems.push(itemData);
    }
    
    localStorage.setItem('marketplaceItems', JSON.stringify(cachedItems));
}


document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const itemDataEncoded = urlParams.get('data');

    // Debugging: Log what we're working with
    console.log('Starting item load', { itemId, itemDataEncoded });

    try {
        // 1. First try to use the encoded data (fastest)
        if (itemDataEncoded) {
            try {
                const itemData = JSON.parse(decodeURIComponent(itemDataEncoded));
                console.log('Using URL-encoded data');
                populateItemDetails(itemData);
                
                // Background refresh if we have a "real" ID (numeric)
                if (itemId && /^\d+$/.test(itemId)) {
                    try {
                        console.log('Attempting background refresh');
                        await fetchItemFromApi(itemId);
                    } catch (refreshError) {
                        console.log('Background refresh failed - using existing data');
                    }
                }
                return;
            } catch (parseError) {
                console.error('Failed to parse URL data', parseError);
                // Continue to other methods
            }
        }

        // 2. Try localStorage if we have an ID
        if (itemId) {
            const storedItems = JSON.parse(localStorage.getItem('marketplaceItems') || []);
            const storedItem = storedItems.find(item => item.id === itemId);
            
            if (storedItem) {
                console.log('Found item in localStorage');
                populateItemDetails(storedItem);
                return;
            }
        }

        // 3. Try API only if ID looks like a MockAPI ID (numeric)
        if (itemId && /^\d+$/.test(itemId)) {
            console.log('Attempting API fetch');
            const success = await fetchItemFromApi(itemId);
            if (success) return;
        }

        // 4. Final fallback
        console.warn('All data loading methods failed');
        showErrorState();
    } catch (error) {
        console.error('Item loading failed:', error);
        showErrorState();
    }
});
