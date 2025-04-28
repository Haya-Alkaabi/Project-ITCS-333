//event handling 
/*sorting control*/  
document.addEventListener("DOMContentLoaded", async() => {
    //filtter - sort - search  elements
    const filterSelect = document.getElementById("filter");
    const cardsContainer = document.getElementById("cards-container");
    let cards = Array.from(document.querySelectorAll(".card-wrapper"));
    const sortSelect = document.getElementById("sort");
    const searchForm = document.getElementById("control-gallery");
    const searchInput = document.getElementById("Search-bar");

    //pagination elements
    const links = document.querySelectorAll(".pagination a");
    const prevbtn = document.getElementById("prev-btn");
    const nextbtn = document.getElementById("next-btn");

    //constant that detemine the NO. of cards
    const itemsPerPage = 4;
    let currentPage = 0;
    let filteredCards = [];
    
    //intialization 
    // Initialize with API data
    await loadInitialData();
    initCards();

    //event listeners 
    filterSelect.addEventListener("change", () => updateDisplay());
    sortSelect.addEventListener("change", () => updateDisplay());
    searchForm.addEventListener("submit",(event) => {
        event.preventDefault();
        updateDisplay();
    });

    //pagination eventListener
    links.forEach((link,index) => {
        link.addEventListener("click", (event)=>{
            event.preventDefault();
            currentPage = index;
            showPage(currentPage);
            updatePagination();
        });
    });

    prevbtn.addEventListener("click", () => {
        if(currentPage > 0){
            currentPage--;
            showPage(currentPage);
            updatePagination();
        }
    });

    nextbtn.addEventListener("click", () => {
        if (currentPage < Math.ceil(filteredCards.length / itemsPerPage) - 1) {
            currentPage++;
            showPage(currentPage);
            updatePagination();
        }
    });
    
    //functions
   function initCards(){
        // Initialize cards array if needed
        if (!cards.length) {
            cards = Array.from(document.querySelectorAll(".card-wrapper"));
        }
    
        // Ensure all cards have reviews
        cards.forEach(card => {
            if (!card.querySelector('.card').dataset.reviews) {
                card.querySelector('.card').dataset.reviews = Math.floor(Math.random() * 50);}
        });
    
        // Show only 4 cards per page
        updateDisplay();
    }

   function updateDisplay() {
        // Show loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');

        // Use setTimeout to allow the UI to update
        setTimeout(() => {
            try{
                // Filter
                const category = filterSelect.value.toLowerCase();
                const searchTerm = searchInput.value.toLowerCase();

                filteredCards = cards.filter(card => {
                    const cardElement = card.querySelector('.card');
                    if(!cardElement) return false;

                    const cardCategory = cardElement.dataset.category.toLowerCase();
                    const matchesCategory = category === "all" || cardCategory === category;
        
                    // Search
                    const title = card.querySelector("h3").textContent.toLowerCase();
                    const author = card.querySelector("p.text-gray-600").textContent.toLowerCase();
                    const matchesSearch = !searchTerm || 
                            title.includes(searchTerm) || 
                            author.includes(searchTerm);
        
                    return matchesCategory && matchesSearch;
                });
    
                // Sort
                const sortValue = sortSelect.value;
                switch(sortValue) { 
                case "P-Low":
                    filteredCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.card').dataset.price);
                    const priceB = parseFloat(b.querySelector('.card').dataset.price);
                    return priceA - priceB;
                });
                break;
                case "P-high":
                    filteredCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.card').dataset.price);
                    const priceB = parseFloat(b.querySelector('.card').dataset.price);
                    return priceB - priceA;
                });
                break;
                case "review":
                    filteredCards.sort((a, b) => {
                        const reviewsA = parseInt(a.dataset.reviews) || 0;
                        const reviewsB = parseInt(b.dataset.reviews) || 0;
                        return reviewsB - reviewsA;
                    });
                break;
                default:
                    // Default sorting (original order)
                    filteredCards.sort((a, b) => 
                    Array.from(cards).indexOf(a) - Array.from(cards).indexOf(b)
                );     
            }

            const noResultsMessage = document.getElementById('no-results-message');
    
            if (filteredCards.length === 0) {
                noResultsMessage?.classList.remove('hidden');
                cardsContainer.classList.add('justify-center'); // Center the message
        
                // Hide all cards when no results
                cards.forEach(card => card.classList.add('hidden'));
            } else {
                noResultsMessage?.classList.add('hidden');
                cardsContainer.classList.remove('justify-center');
            
                reorderCardsInDOM();
                // Reset to first page and update
                currentPage = 0;
                showPage(currentPage);
            }
            updatePagination();

        }finally {
            // Hide loading indicator when done
            document.getElementById('loading-indicator').classList.add('hidden');
        }}, 50);
    }

    //item adding
    function addNewItem(itemData) {
        // Create new card element
        const newCard = document.createElement('div');
        newCard.className = 'p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 card-wrapper';
        newCard.innerHTML = `
            <div class="card" data-category="${itemData.category}" data-price="${itemData.price}" data-reviews="${itemData.reviews || 0}">
            <div class="w-full h-48 flex items-center justify-center bg-gray-100">
                <img src="${itemData.image}" alt="${itemData.title}" class="max-h-full max-w-full object-contain">
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${itemData.title}</h3>
                <p class="text-gray-600 mb-2">${itemData.author}</p>
                <p class="text-green-600 font-bold">${itemData.price} BD</p>
            </div>
            </div>
            `;
    
        // Add to cards array and DOM
        cardsContainer.appendChild(newCard);
        cards.push(newCard);
    
        // Reinitialize with the new card
        initCards();
    
        // If on last page with full items, move to new page
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage === totalPages - 1 && filteredCards.length % itemsPerPage === 0) {
        currentPage = totalPages;
    }
        // Update display
        updateDisplay();
    }

    function reorderCardsInDOM() {
        const container = document.getElementById('cards-container');
        // First remove all cards
        cards.forEach(card => container.appendChild(card));
    
        // Then append in sorted order
        filteredCards.forEach(card => container.appendChild(card));
    }

    function showPage(pageIndex) {
        // Hide all cards first
        cards.forEach(card => card.classList.add("hidden"));
    
        // Calculate range for current page
        const startIndex = pageIndex * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
    
        // Show cards for current page
        filteredCards.slice(startIndex, endIndex).forEach(card => {
            card.classList.remove("hidden");
        });
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

        // Always show pagination controls (but disable when not applicable)
        const paginationContainer = document.querySelector(".pagination");
        if (paginationContainer) {
        paginationContainer.style.display = "flex"; // Always show
        }
        prevbtn.style.display = "block"; // Always show
        nextbtn.style.display = "block"; // Always show

        // Update page links
        links.forEach((link, index) => {
            if (index < totalPages) {
                link.style.display = "inline-block";
                link.textContent = index + 1;
                link.classList.toggle("active", index === currentPage);
            } else {
                link.style.display = "none";
            }
        });
    
    // Update button states
    prevbtn.disabled = currentPage === 0;
    nextbtn.disabled = currentPage >= totalPages - 1 || totalPages === 0;
}

async function loadInitialData() {
    try {
        const response = await fetch('https://680d0e83c47cb8074d8f6cb6.mockapi.io/items');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const apiItems = await response.json();
        
        // Transform API data to match your structure
        const formattedItems = apiItems.map(item => ({
            id: item.id,
            title: item.name || item.title,
            author: item.seller || item.author,
            price: item.price.toString(),
            category: item.type || item.category,
            image: item.imageUrl || item.image,
            reviews: parseInt(item.ratingCount) || 0,
            // Detail page fields
            format: item.format,
            contact: item.contactInfo,
            overview: item.description,
            customerReviews: item.reviews || []
        }));
        
        // Cache all items
        localStorage.setItem('marketplaceItems', JSON.stringify(formattedItems));

        renderCards(formattedItems);
    } catch (error) {
        console.error('Error loading API data:', error);
        // Fallback to local data
        const localResponse = await fetch('data.json');
        if (localResponse.ok) {
            const localData = await localResponse.json();
            renderCards(localData.items);
        }
    }
}

function renderCards(items) {
    // Clear existing cards
    cardsContainer.innerHTML = '';
    cards.length =0;
    
    // Create new cards
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 card-wrapper hover:cursor-pointer';
        card.innerHTML = `
            <div class="card" data-category="${item.category}" data-price="${item.price}" data-reviews="${item.reviews}">
                <div class="w-full h-48 flex items-center justify-center bg-gray-100">
                    <img src="${item.image}" alt="${item.title}" class="max-h-full max-w-full object-contain">
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">${item.title}</h3>
                    <p class="text-gray-600 mb-2">${item.author}</p>
                    <p class="text-green-600 font-bold">${item.price} BD</p>
                </div>
            </div>
        `;
        // Add click handler
        card.addEventListener('click', () => {
            // Pass both the full data and ID
            const itemData = {
                ...item,
                // Ensure we have the API's id if available
                id: item.id || Math.random().toString(36).substr(2, 9)
            };

            //to cache and navigate
            openItemDetail(itemData);
        });

        cardsContainer.appendChild(card);
        cards.push(card);
    });

    // Initialize with the loaded cards
    initCards();
}

//addNewItem to work with JSON data
window.addNewItem = (itemData) => {
    const newCard = document.createElement('div');
    newCard.className = 'p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 card-wrapper';
    newCard.innerHTML = `
        <div class="card" data-category="${itemData.category}" data-price="${itemData.price}" data-reviews="${itemData.reviews || 0}">
            <div class="w-full h-48 flex items-center justify-center bg-gray-100">
                <img src="${itemData.image}" alt="${itemData.title}" class="max-h-full max-w-full object-contain">
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${itemData.title}</h3>
                <p class="text-gray-600 mb-2">${itemData.author}</p>
                <p class="text-green-600 font-bold">${itemData.price} BD</p>
            </div>
        </div>
    `;
    
    cardsContainer.appendChild(newCard);
    cards = Array.from(document.querySelectorAll(".card-wrapper"));
    updateDisplay();
};

function openItemDetail(item) {
    // 1. First cache all items in localStorage
    const currentItems = JSON.parse(localStorage.getItem('marketplaceItems') || '[]');
    
    // Check if this item already exists in cache
    const existingIndex = currentItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
        // Update existing item
        currentItems[existingIndex] = item;
    } else {
        // Add new item
        currentItems.push(item);
    }
    
    localStorage.setItem('marketplaceItems', JSON.stringify(currentItems));

    // 2. Navigate to detail page with both ID and data
    window.location.href = `itemDetail.html?id=${item.id}&data=${encodeURIComponent(JSON.stringify(item))}`;
}


/*pagination control */

let current = 0;

function updateActivePage(index){
    links.forEach(link => link.classList.remove("active"));
    links[index].classList.add("active");
    current = index;

    //if the page is first or las -> disable prev/next btn
    prevbtn.disabled = current ===0;
    nextbtn.disabled = current === links.length -1;
}

links.forEach((link,index) => {
    link.addEventListener("click",(event) => {
        event.preventDefault();
        updateActivePage(index);
    });
});

prevbtn.addEventListener("click", () =>{
    if (current>0){
        updateActivePage(current-1);
    }
});

nextbtn.addEventListener("click", () =>{
    if (current<links.length-1){
        updateActivePage(current+1);
    }
});

updateActivePage(current);

});

