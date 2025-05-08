document.addEventListener("DOMContentLoaded", async () => {
    // Filter, sort, search elements
    const filterSelect = document.getElementById("filter");
    const cardsContainer = document.getElementById("cards-container");
    let cards = Array.from(document.querySelectorAll(".card-wrapper"));
    const sortSelect = document.getElementById("sort");
    const searchForm = document.getElementById("control-gallery");
    const searchInput = document.getElementById("Search-bar");

    // Pagination elements
    const paginationContainer = document.querySelector(".pagination");
    const prevbtn = document.getElementById("prev-btn");
    const nextbtn = document.getElementById("next-btn");

    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.has('refresh');

    // Constants
    const itemsPerPage = 4;
    let currentPage = 0;
    let filteredCards = [];
    
    // Initialization 
    await loadInitialData();
    
    // Event listeners
    filterSelect.addEventListener("change", () => updateDisplay());
    sortSelect.addEventListener("change", () => updateDisplay());
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        updateDisplay();
    });

    prevbtn.addEventListener("click", () => {
        if (currentPage > 0) {
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

    // Functions
    async function loadInitialData() {
        try {
            const response = await fetch('https://680d0e83c47cb8074d8f6cb6.mockapi.io/items');
            if (!response.ok) throw new Error('Failed to fetch items');
            
            const apiItems = await response.json();
            const formattedItems = apiItems.map(item => ({
                id: item.id,
                title: item.title || item.name || 'Untitled',
                author: item.author || item.seller || 'Unknown',
                price: item.price?.toString() || '0.00',
                category: item.category || item.type || 'general',
                image: item.image || item.imageUrl || 'img/default-item.jpg',
                reviews: item.reviews || item.ratingCount || 0,
                format: item.format || 'Unknown',
                contact: item.contact || item.contactInfo || 'Not provided',
                overview: item.overview || item.description || 'No description',
                customerReviews: item.customerReviews || []
            }));
            
            localStorage.setItem('marketplaceItems', JSON.stringify(formattedItems));
            renderCards(formattedItems);
            initCardsWithoutFilter();
            
            setTimeout(() => {
                currentPage = 0;
                updateDisplay();
            }, 50);
            
        } catch (error) {
            console.error('API fetch failed:', error);
            const cachedItems = JSON.parse(localStorage.getItem('marketplaceItems') || []);
            if (cachedItems.length > 0) {
                renderCards(cachedItems);
                initCardsWithoutFilter();
                setTimeout(() => {
                    currentPage = 0;
                    updateDisplay();
                }, 50);
            } else {
                document.getElementById('no-results-message').classList.remove('hidden');
            }
        }
    }

    function initCardsWithoutFilter() {
        if (!cards.length) {
            cards = Array.from(document.querySelectorAll(".card-wrapper"));
        }
    
        cards.forEach(card => {
            if (!card.querySelector('.card').dataset.reviews) {
                card.querySelector('.card').dataset.reviews = Math.floor(Math.random() * 50);
            }
        });
        
        cards.forEach(card => card.classList.remove('hidden'));
    }

    function updateDisplay() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');

        setTimeout(() => {
            try {
                cards.forEach(card => card.classList.remove('hidden'));
                
                const category = filterSelect.value.toLowerCase();
                const searchTerm = searchInput.value.toLowerCase();

                filteredCards = cards.filter(card => {
                    const cardElement = card.querySelector('.card');
                    if (!cardElement) return false;

                    const cardCategory = cardElement.dataset.category.toLowerCase();
                    const matchesCategory = category === "all" || cardCategory === category;
        
                    const title = card.querySelector("h3")?.textContent.toLowerCase() || '';
                    const author = card.querySelector("p.text-gray-600")?.textContent.toLowerCase() || '';
                    const matchesSearch = !searchTerm || 
                            title.includes(searchTerm) || 
                            author.includes(searchTerm);
        
                    return matchesCategory && matchesSearch;
                });
    
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
                            const reviewsA = parseInt(a.querySelector('.card').dataset.reviews) || 0;
                            const reviewsB = parseInt(b.querySelector('.card').dataset.reviews) || 0;
                            return reviewsB - reviewsA;
                        });
                        break;
                    default:
                        filteredCards.sort((a, b) => 
                            Array.from(cards).indexOf(a) - Array.from(cards).indexOf(b)
                        );     
                }

                const noResultsMessage = document.getElementById('no-results-message');
    
                if (filteredCards.length === 0) {
                    noResultsMessage?.classList.remove('hidden');
                    cardsContainer.classList.add('justify-center');
                    cards.forEach(card => card.classList.add('hidden'));
                } else {
                    noResultsMessage?.classList.add('hidden');
                    cardsContainer.classList.remove('justify-center');
                
                    reorderCardsInDOM();
                    currentPage = 0;
                    showPage(currentPage);
                }
                updatePagination();

            } finally {
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
            }
        }, 50);
    }

    function renderCards(items) {
        while (cardsContainer.firstChild) {
            cardsContainer.removeChild(cardsContainer.firstChild);
        }
        cards = [];
        
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
            
            card.addEventListener('click', () => {
                const itemData = {
                    ...item,
                    id: item.id || Math.random().toString(36).substr(2, 9)
                };
                openItemDetail(itemData);
            });

            cardsContainer.appendChild(card);
            cards.push(card);
        });
    }

    function showPage(pageIndex) {
        cards.forEach(card => card.classList.add("hidden"));
    
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (pageIndex >= totalPages) pageIndex = totalPages - 1;
        if (pageIndex < 0) pageIndex = 0;
        
        const startIndex = pageIndex * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
    
        filteredCards.slice(startIndex, endIndex).forEach(card => {
            card.classList.remove("hidden");
        });
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Create new pagination links
        for (let i = 0; i < totalPages; i++) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = i + 1;
            if (i === currentPage) {
                link.classList.add('active');
            }
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                showPage(currentPage);
                updatePagination();
            });
            
            paginationContainer.appendChild(link);
        }
    
        prevbtn.disabled = currentPage === 0;
        nextbtn.disabled = currentPage >= totalPages - 1 || totalPages === 0;
    }

    function reorderCardsInDOM() {
        const container = document.getElementById('cards-container');
        cards.forEach(card => container.appendChild(card));
        filteredCards.forEach(card => container.appendChild(card));
    }

    function openItemDetail(item) {
        const currentItems = JSON.parse(localStorage.getItem('marketplaceItems') || []);
        const existingIndex = currentItems.findIndex(i => i.id === item.id);
        
        if (existingIndex >= 0) {
            currentItems[existingIndex] = item;
        } else {
            currentItems.push(item);
        }
        
        localStorage.setItem('marketplaceItems', JSON.stringify(currentItems));
        window.location.href = `itemDetail.html?id=${item.id}&data=${encodeURIComponent(JSON.stringify(item))}`;
    }
});