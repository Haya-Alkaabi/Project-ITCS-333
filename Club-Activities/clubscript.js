document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element Selection ---
  const clubListContainer = document.querySelector('.list');
  const searchInput = document.querySelector('.search-bar');
  const filterDropdown = document.querySelector('.filter-dropdown');

  // --- UI Feedback Elements ---
  const feedbackContainer = document.createElement('div');
  feedbackContainer.style.textAlign = 'center';
  feedbackContainer.style.padding = '1rem';
  const loadMsgElement = document.createElement('p');
  loadMsgElement.textContent = 'Loading clubs...';
  const errorMsgElement = document.createElement('p');
  errorMsgElement.style.color = 'red';

  // --- Configuration ---
  const API_BASE_URL = 'https://4b615ecd-306c-40bc-85a7-71a39091c9fd-00-2xm1w8iks1y7q.sisko.replit.dev';
  const IMAGE_BASE_URL = ''; // Assuming club.image from API is a full URL or correct relative path from HTML

  // --- Initial Page Setup & Validation ---
  if (clubListContainer) {
      clubListContainer.before(feedbackContainer);
      feedbackContainer.appendChild(loadMsgElement);
  } else {
      console.error("Error: Club list container '.list' not found.");
      document.body.insertAdjacentHTML('afterbegin', '<p style="color:red; text-align:center;">Critical Error: Page content cannot load because a vital element is missing.</p>');
      return;
  }

  // --- Utility: Debounce Function ---
  function debounce(func, delay) {
      let timeout;
      return function(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), delay);
      };
  }

  // --- Core Function: Fetch Clubs from API ---
  const fetchClubs = async (searchTerm = null, categoryFilter = null) => {
      loadMsgElement.style.display = 'block';
      errorMsgElement.remove();
      if (clubListContainer) clubListContainer.innerHTML = '';

      let apiUrl = `${API_BASE_URL}/api/fetch_clubs.php`; 
      const queryParams = new URLSearchParams();

      if (searchTerm && searchTerm.trim() !== '') {
          queryParams.append('search', searchTerm.trim());
      }
      if (categoryFilter && categoryFilter.toLowerCase() !== 'all categories' && categoryFilter !== '') {
          queryParams.append('category', categoryFilter);
      }

      if (queryParams.toString()) {
          apiUrl += `?${queryParams.toString()}`;
      }

      console.log(`Attempting to fetch from: ${apiUrl}`); // Log the URL being fetched

      try {
              const response = await fetch(apiUrl);

              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const apiResponse = await response.json();

              const clubsArray = apiResponse.records || apiResponse.data || [];

              if (clubsArray.length > 0) {
                  displayClubs(clubsArray);
              } else {
                  clubListContainer.innerHTML = '<p style="text-align:center;">No clubs found matching your criteria.</p>';
              }
          } catch (error) {
              console.error('Error:', error);
              errorMsgElement.textContent = `Failed to load clubs: ${error.message}`;
              feedbackContainer.appendChild(errorMsgElement);
          } finally {
              loadMsgElement.style.display = 'none';
          }
      };

  // --- Core Function: Display Clubs in DOM ---
  const displayClubs = (clubsToDisplay) => {
      if (!clubListContainer) return;
      clubListContainer.innerHTML = '';

      clubsToDisplay.forEach(club => {
          const clubDiv = document.createElement('div');
          clubDiv.classList.add('list-content');

          const imgContainer = document.createElement('div');
          imgContainer.classList.add('image-container');

          const image = document.createElement('img');
          image.classList.add('picturelist');

          let imageUrl = 'https://placehold.co/250x180/053868/FFFFFF?text=No+Image';
          if (club.image && club.image.trim() !== '') { 
              imageUrl = IMAGE_BASE_URL ? `${IMAGE_BASE_URL}${club.image}` : club.image;
          }

          image.src = imageUrl;
          image.alt = club.name || "Club image";
          image.onerror = function() {
              this.onerror = null;
              this.src = 'https://placehold.co/250x180/D4AF37/000000?text=Image+Error';
              this.alt = `${club.name || 'Club'} (image error)`;
          };
          imgContainer.appendChild(image);

          const nameParagraph = document.createElement('p');
          nameParagraph.textContent = club.name || "Unnamed Club";

          const learnMoreButton = document.createElement('button');
          learnMoreButton.classList.add('list-button');
          learnMoreButton.textContent = 'Learn More';

          learnMoreButton.addEventListener('click', () => {
              const clubDescription = club.description || "No detailed description available.";
              const formattedDescription = clubDescription.replace(/\n/g, '<br>');
              showSimpleModal(`About ${club.name || "Club"}`, `<p>${formattedDescription}</p>`);
          });

          clubDiv.appendChild(imgContainer);
          clubDiv.appendChild(nameParagraph);
          clubDiv.appendChild(learnMoreButton);
          clubListContainer.appendChild(clubDiv);
      });
  };

  // --- UI Component: Simple Modal ---
  let currentModal = null;
  let escapeKeyListener = null;

  function showSimpleModal(title, contentHtml) {
      if (currentModal) currentModal.remove();

      const modalOverlay = document.createElement('div');
      currentModal = modalOverlay;
      modalOverlay.id = 'custom-info-modal';
      modalOverlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1001; padding: 15px; box-sizing: border-box;`;

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `background-color: white; padding: 20px 25px 25px 25px; border-radius: 8px; max-width: 600px; width: 100%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); max-height: 85vh; overflow-y: auto; box-sizing: border-box;`;

      const modalHeader = document.createElement('div');
      modalHeader.style.cssText = `display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;`;

      const modalTitle = document.createElement('h2');
      modalTitle.textContent = title;
      modalTitle.style.cssText = 'font-size: 1.5rem; color: #053868; margin: 0; font-weight: bold;';

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.setAttribute('aria-label', 'Close modal');
      closeButton.style.cssText = `background: none; border: none; font-size: 2.2rem; cursor: pointer; color: #888; line-height: 1; padding: 0; font-weight: bold;`;
      closeButton.onmouseover = () => closeButton.style.color = '#333';
      closeButton.onmouseout = () => closeButton.style.color = '#888';

      const closeModal = () => {
          if (currentModal) currentModal.remove();
          if (escapeKeyListener) document.removeEventListener('keydown', escapeKeyListener);
          currentModal = null;
          escapeKeyListener = null;
      };

      closeButton.onclick = closeModal;
      modalHeader.appendChild(modalTitle);
      modalHeader.appendChild(closeButton);

      const modalBody = document.createElement('div');
      modalBody.innerHTML = contentHtml;
      modalBody.style.cssText = 'font-size: 1rem; color: #333; line-height: 1.6;';

      modalContent.appendChild(modalHeader);
      modalContent.appendChild(modalBody);
      modalOverlay.appendChild(modalContent);

      modalOverlay.addEventListener('click', function(event) {
          if (event.target === this) closeModal();
      });

      document.body.appendChild(modalOverlay);
      closeButton.focus();

      escapeKeyListener = function(event) {
          if (event.key === 'Escape') {
              closeModal();
          }
      };
      document.addEventListener('keydown', escapeKeyListener);
  }

  // --- Event Listener Setup ---
  const debouncedFetchClubs = debounce(fetchClubs, 300);

  if (searchInput) {
      searchInput.addEventListener('input', () => {
          const searchTerm = searchInput.value;
          const selectedCategory = filterDropdown ? filterDropdown.value : "";
          debouncedFetchClubs(searchTerm, selectedCategory);
      });
  } else {
      console.warn("Warning: Search input '.search-bar' not found.");
  }

  if (filterDropdown) {
      filterDropdown.addEventListener('change', () => {
          const selectedCategory = filterDropdown.value;
          const searchTerm = searchInput ? searchInput.value : null;
          fetchClubs(searchTerm, selectedCategory);
      });
  } else {
      console.warn("Warning: Filter dropdown '.filter-dropdown' not found.");
  }

  // --- Initial Data Load ---
  fetchClubs();
});