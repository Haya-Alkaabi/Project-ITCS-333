// Update the API base URL
const API_BASE_URL = '../backend/controllers/itemsController.php';

document.addEventListener("DOMContentLoaded", async () => {
    // Elements
    const filterSelect = document.getElementById("filter");
    const cardsContainer = document.getElementById("cards-container");
    const sortSelect = document.getElementById("sort");
    const searchForm = document.getElementById("control-gallery");
    const searchInput = document.getElementById("Search-bar");
    const paginationContainer = document.querySelector(".pagination");
    const prevbtn = document.getElementById("prev-btn");
    const nextbtn = document.getElementById("next-btn");

    // Variables
    const itemsPerPage = 4;
    let currentPage = 0;
    let totalPages = 1;
    let allItems = [];
    let filteredItems = [];

    // Initialization 
    await loadAllItems(); // Load all items initially

    // Event listeners
    filterSelect.addEventListener("change", () => applyFiltersAndSort());
    sortSelect.addEventListener("change", () => applyFiltersAndSort());
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        applyFiltersAndSort();
    });

    prevbtn.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            showCurrentPage();
        }
    });

    nextbtn.addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            showCurrentPage();
        }
    });

    // Functions
    async function loadAllItems() {
        try {
            // First try to get all items without pagination
            const response = await fetch(`${API_BASE_URL}?limit=1000`); // Large limit to get all items
            if (!response.ok) throw new Error('Failed to fetch items');

            const data = await response.json();
            allItems = data.data || [];
            filteredItems = [...allItems];

            localStorage.setItem('marketitems', JSON.stringify(data));
            updatePagination();
            showCurrentPage();

        } catch (error) {
            console.error('API fetch failed:', error);
            const cachedData = JSON.parse(localStorage.getItem('marketitems') || '{}');
            allItems = cachedData.data || [];
            filteredItems = [...allItems];

            if (allItems.length > 0) {
                updatePagination();
                showCurrentPage();
            } else {
                document.getElementById('no-results-message').classList.remove('hidden');
            }
        }
    }

    function applyFiltersAndSort() {
        const category = filterSelect.value.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase();

        // Filter items
        filteredItems = allItems.filter(item => {
            const matchesCategory = category === "all" || item.category.toLowerCase() === category;
            const matchesSearch = !searchTerm || 
                item.title.toLowerCase().includes(searchTerm) || 
                item.author.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        // Sort items
        const sortValue = sortSelect.value;
        switch(sortValue) {
            case "P-Low":
                filteredItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case "P-high":
                filteredItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case "review":
                // Note: You'll need to add review data to your items for this to work
                filteredItems.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
                break;
            default:
                // Default sorting (by ID or as they come from API)
                filteredItems.sort((a, b) => a.id - b.id);
        }

        // Reset to first page after filtering/sorting
        currentPage = 0;
        updatePagination();
        showCurrentPage();
    }

    function showCurrentPage() {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredItems.slice(startIndex, endIndex);

        renderCards(pageItems);

        // Show/hide no results message
        const noResultsMessage = document.getElementById('no-results-message');
        if (filteredItems.length === 0) {
            noResultsMessage?.classList.remove('hidden');
            cardsContainer.classList.add('justify-center');
        } else {
            noResultsMessage?.classList.add('hidden');
            cardsContainer.classList.remove('justify-center');
        }
    }

    function updatePagination() {
        paginationContainer.innerHTML = '';
        totalPages = Math.ceil(filteredItems.length / itemsPerPage);

        // Previous Button
        prevbtn.disabled = currentPage === 0;

        // Page Numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        // Adjust if we're at the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        // First Page
        if (startPage > 0) {
            const firstBtn = createPageButton(0);
            paginationContainer.appendChild(firstBtn);
            if (startPage > 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-2';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }

        // Middle Pages
        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createPageButton(i));
        }

        // Last Page
        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-2';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            const lastBtn = createPageButton(totalPages - 1);
            paginationContainer.appendChild(lastBtn);
        }

        // Next Button
        nextbtn.disabled = currentPage >= totalPages - 1;
    }

    function createPageButton(pageIndex) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `px-3 py-1 mx-1 rounded ${
            currentPage === pageIndex 
                ? 'bg-blue-600 text-white font-medium' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        } transition-colors duration-200`;
        pageBtn.textContent = pageIndex + 1;

        pageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage !== pageIndex) {  // Only update if it's a different page
                currentPage = pageIndex;
                showCurrentPage();
                updatePagination();  // Re-render to update active state
            }
        });

        return pageBtn;
    }

    function renderCards(items) {
        cardsContainer.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 card-wrapper hover:cursor-pointer';
            card.innerHTML = `
                <div class="card" data-category="${item.category}" data-price="${item.price}">
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

                // Ensure ALL item data is stored, including the correct image path
                const itemData = {
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    price: item.price,
                    category: item.category,
                    image_path: item.image, // Make sure this matches your data structure
                    format: item.format,
                    contact: item.contact,
                    overview: item.overview,
                    quantity: item.quantity
                };
                
                sessionStorage.setItem('selectedItem', JSON.stringify(item));
                window.location.href = `itemDetail.php?id=${item.id}`;
            });

            cardsContainer.appendChild(card);
        });
    }
});