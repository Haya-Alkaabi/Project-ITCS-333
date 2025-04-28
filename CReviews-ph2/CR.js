document.addEventListener('DOMContentLoaded', () => {
    const reviewsGridContainer = document.querySelector('.layout-grid.grid-columns-one.grid-columns-three.padding-gap-large');
    const searchInput = document.querySelector('input[placeholder="Search reviews..."]');
    const categoryFilter = document.getElementById('categoryFilter');
    const courseLevelFilter = document.getElementById('courseLevelFilter');
    const sortByFilter = document.getElementById('sortBy');
    console.log('sortByFilter element:', sortByFilter); // Logging the sortByFilter element for debugging
    const paginationContainer = document.querySelector('.pagination');
    const addReviewButton = document.querySelector('aside button');
    const reviewForm = document.getElementById('reviewForm');//The form to add a new review
    const addReviewForm = document.getElementById('addReviewForm'); // The form element itself
    const cancelReviewButton = document.getElementById('cancelReview');
    const commentsContainer = document.querySelector('aside'); 
    const commentInput = document.querySelector('aside input[placeholder="Add a comment..."]');
    const postCommentButton = document.querySelector('aside button.background-dark-blue');
    let comments = []; // Array to store comments
    let allReviews = []; // Array to store all fetched and added reviews
    let currentPage = 1; // Current page number for pagination
    const reviewsPerPage = 6;  // Number of reviews to display per page
    let currentlyEditingId = null; // To track which review is being edited



    // --- Load Comments from local Storage ---
    function loadComments() {
        const storedComments = localStorage.getItem('comments');
        if (storedComments) {
            comments = JSON.parse(storedComments);
            renderComments();

        }
    }

    // --- Save Comments to localStorage ---
    function saveComments() {
        localStorage.setItem('comments', JSON.stringify(comments));
    }


    // --- Render Comments ---
    function renderComments() {
        if (commentsContainer) {
            // Clear only the existing comment articles
            const existingComments = commentsContainer.querySelectorAll('article');
            existingComments.forEach(comment => comment.remove());
    
            const commentsHeading = commentsContainer.querySelector('#comments-heading');
    
            comments.forEach((comment, index) => {
                const commentArticle = document.createElement('article');
                commentArticle.classList.add('background-white', 'padding-all-small', 'border-rounded-small', 'margin-bottom-small', 'layout-flex', 'items-center-vertical', 'justify-between'); // Added flex layout
                const commentParagraph = document.createElement('p');
                commentParagraph.textContent = `student ${index + 1}: ${comment}`;
                commentArticle.appendChild(commentParagraph);
    
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('background-red-dark', 'text-pure-white', 'padding-vertical-tiny', 'padding-horizontal-small', 'border-rounded-small', 'text-smaller');
                deleteButton.dataset.index = index; // Store the index
                commentArticle.appendChild(deleteButton);
    
                if (commentsHeading && commentsHeading.nextSibling) {
                    commentsContainer.insertBefore(commentArticle, commentsHeading.nextSibling);
                } else if (commentsHeading) {
                    commentsContainer.appendChild(commentArticle);
                } else {
                    commentsContainer.prepend(commentArticle);
                }
            });
        } else {
            console.log('commentsContainer element not found in renderComments().');
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const filteredReviews = allReviews.filter(review =>
                review.course.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            renderCurrentPage(filteredReviews);
            updatePagination(filteredReviews);
        });
    }

    // --- Event listener for deleting a comment ---
    if (commentsContainer) {
        commentsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('background-red-dark') && event.target.textContent === 'Delete') {
                const indexToDelete = parseInt(event.target.dataset.index);
                if (!isNaN(indexToDelete) && indexToDelete >= 0 && indexToDelete < comments.length) {
                    comments.splice(indexToDelete, 1); // Remove the comment from the array
                    saveComments(); // Update localStorage
                    renderComments(); // Rerender the comments
                }
            }
        });
    }

    // --- Event listener for the "Post" button ---
    if (postCommentButton) {
        console.log('Post button element found.'); 
        postCommentButton.addEventListener('click', () => {
            console.log('Post button was clicked!'); // for checking
            const commentText = commentInput.value.trim();
            if (commentText) {
                comments.push(commentText);
                saveComments(); // Save comments to localStorage
                renderComments();
                commentInput.value = ''; // Clear the input field
            }
        });
    } else {
        console.log('Post button element NOT found.'); 
    }

    // --- Initialize Comments ---
    loadComments();

    // --- Course Categories Mapping ---
    const courseCategories = {
      "Computer Programming I": "Information System",
      "Network Security III": "Information System",
      "CyberEthics IIV": "Information System",
      "Calculus I": "Mathematics",
      "Calculus II": "Mathematics",
      "Calculus III": "Mathematics",
      "Mechanics of Materials II": "Engineering",
      "Highway Engineering III": "Engineering",
      "Hydraulics IIV": "Engineering"
    };
   
    // --- Display Loading State ---
    function displayLoading() {
      if (reviewsGridContainer) {
        reviewsGridContainer.innerHTML = '<p>Loading reviews...</p>';
      }
    }
    
    // --- Clear Loading State ---
    function clearLoading() {
      if (reviewsGridContainer) {
        reviewsGridContainer.innerHTML = '';
      }
    }

    // --- Transform Fetched Review Data ---
    function transformReviewData(data) {
      const courses = Object.keys(courseCategories);
      const reviewers = ["Aldana", "saud", "Shikha", "Hamad", "Omayma", "Khalid", "Fajer", "Fahad", "Maria", "Aziz","kalifa","sultan","Ameena","Reem","Shahad","Noor"];
      const numberOfReviewsPerCourse = 3;
  
      const transformedData = [];
      let idCounter = 1;
  
      courses.forEach(course => {
        for (let i = 0; i < numberOfReviewsPerCourse; i++) {
          transformedData.push({
            id: idCounter++,
            course: course,
            reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
            rating: Math.floor(Math.random() * 5) + 1,
            text: data[Math.floor(Math.random() * data.length)].body,
            date: new Date().toLocaleDateString(),
          });
        }
      });
     // Shuffle the array to randomize the order of reviews
      for (let i = transformedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [transformedData[i], transformedData[j]] = [transformedData[j], transformedData[i]];
      }
  
      return transformedData.slice(0, 27);
    }

    // --- Populate Course Filter Options ---
    function populateCourseFilter(reviews) {
      if (!categoryFilter) return;
      categoryFilter.innerHTML = '<option value="">Category</option>';
  
      const uniqueCategories = [...new Set(Object.values(courseCategories))];
  
      uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    }
    
    // --- Fetch Reviews from API ---
    async function fetchReviews() {
      displayLoading();
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const transformedData = transformReviewData(data.slice(0, 27));
        clearLoading();
        allReviews = transformedData;
        renderCurrentPage(allReviews);
        updatePagination(allReviews);
        populateCourseFilter(allReviews);
      } catch (error) {
        console.error('Fetch error:', error);
        displayError(error.message);
      }
    }
   
     // --- Render Reviews to the Grid ---
    function renderReviews(reviews) {
        if (!reviewsGridContainer) return;
        reviewsGridContainer.innerHTML = '';
        reviews.forEach(review => {
            const reviewArticle = document.createElement('article');
            reviewArticle.classList.add('background-white', 'padding-all-large', 'border-rounded-medium', 'shadow-light');
            reviewArticle.innerHTML = `
                <div class="layout-flex items-center-vertical margin-bottom-small">
                    <span class="text-gold">${'★'.repeat(review.rating)}</span><span class="text-gray-medium">${'★'.repeat(5 - review.rating)}</span>
                    <span class="text-gray-medium margin-left-tiny">${review.rating}.0</span>
                </div>
                <h3 class="text-normal text-semi-bold margin-bottom-small">${review.course}</h3>
                <button class="background-gold text-pure-white padding-vertical-small padding-horizontal-large border-rounded-small view-review-button" data-review-id="${review.id}">View Review</button>
                <div class="review-details hidden mt-2">
                    <p><strong>Reviewer:</strong> <span class="reviewer-name">${review.reviewer}</span></p>
                    <p><strong>Course:</strong> <span class="course-name">${review.course}</span></p>
                    <p><strong>Rating:</strong> <span class="review-rating">${review.rating}</span>/5</p>
                    <p><strong>Review:</strong> <span class="review-text">${review.text}</span></p>
                    <div class="layout">
                        <button class="background-gray-light text-pure-white padding-vertical-tiny padding-horizontal-small border-rounded-small text-smaller edit-review-button" data-review-id="${review.id}">Edit</button>
                        <button class="background-red-dark text-pure-white padding-vertical-tiny padding-horizontal-small border-rounded-small text-smaller delete-review-button" data-review-id="${review.id}">Delete</button>
                    </div>
                </div>
                <div class="edit-form hidden mt-2">
                    <label for="edit-reviewer-${review.id}" class="block text-gray-700 text-sm font-bold mb-2">Your Name:</label>
                    <input type="text" id="edit-reviewer-${review.id}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${review.reviewer}">
                    <label for="edit-course-${review.id}" class="block text-gray-700 text-sm font-bold mb-2">Course Name:</label>
                    <input type="text" id="edit-course-${review.id}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${review.course}">
                    <label for="edit-rating-${review.id}" class="block text-gray-700 text-sm font-bold mb-2">Rating (1-5):</label>
                    <input type="number" id="edit-rating-${review.id}" min="1" max="5" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${review.rating}">
                    <label for="edit-text-${review.id}" class="block text-gray-700 text-sm font-bold mb-2">Review:</label>
                    <textarea id="edit-text-${review.id}" rows="4" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">${review.text}</textarea>
                    <div class="mt-2">
                        <button class="background-gold hover:bg-gold-700 text-white font-bold py-2 px-4 border-rounded-small focus:outline-none focus:shadow-outline save-edit-button" data-review-id="${review.id}">Save Changes</button>
                        <button class="background-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 border-rounded-small focus:outline-none focus:shadow-outline cancel-edit-button" data-review-id="${review.id}">Cancel</button>
                    </div>
                </div>
            `;
            reviewsGridContainer.appendChild(reviewArticle);
        });
    }


       // --- Event listener for "View Review" button ---
    reviewsGridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('view-review-button')) {
            const reviewId = parseInt(event.target.dataset.reviewId);
            const reviewDetails = event.target.nextElementSibling;
            if (reviewDetails && reviewDetails.classList.contains('review-details')) {
                reviewDetails.classList.toggle('hidden');
                event.target.textContent = reviewDetails.classList.contains('hidden') ? 'View Review' : 'Hide Details';
                // Hide edit form if it was open for this review
                const editForm = reviewDetails.nextElementSibling;
                if (editForm && editForm.classList.contains('edit-form')) {
                    editForm.classList.add('hidden');
                    currentlyEditingId = null;
                }
            }
        }
    });

    // --- Event listener for "Delete" button ---
    reviewsGridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-review-button')) {
            const reviewIdToDelete = parseInt(event.target.dataset.reviewId);
            if (!isNaN(reviewIdToDelete)) {
                allReviews = allReviews.filter(review => review.id !== reviewIdToDelete);
                saveReviews();
                applyFiltersAndSort();
            }
        }
    });

    // --- Event listener for "Edit" button ---
    reviewsGridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-review-button')) {
            const reviewIdToEdit = parseInt(event.target.dataset.reviewId);
            currentlyEditingId = reviewIdToEdit;
            const reviewDetails = event.target.closest('.review-details');
            const editForm = reviewDetails.nextElementSibling;
            if (reviewDetails && editForm && editForm.classList.contains('edit-form')) {
                reviewDetails.classList.add('hidden');
                editForm.classList.remove('hidden');
                // Optional scroll to the edit form
                editForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });

    // --- Event listener for "Cancel" button in edit form ---
    reviewsGridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('cancel-edit-button')) {
            const reviewId = parseInt(event.target.dataset.reviewId);
            const editForm = event.target.closest('.edit-form');
            const reviewDetails = editForm.previousElementSibling;
            if (editForm && reviewDetails && reviewDetails.classList.contains('review-details')) {
                editForm.classList.add('hidden');
                reviewDetails.classList.remove('hidden');
                currentlyEditingId = null;
            }
        }
    });

    // --- Event listener for "Save Changes" button in edit form ---
    reviewsGridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('save-edit-button')) {
                console.log('Save Changes button clicked!')
            const reviewIdToUpdate = parseInt(event.target.dataset.reviewId);
            if (!isNaN(reviewIdToUpdate)) {
                // Find the corresponding review in the allReviews array
                const reviewIndex = allReviews.findIndex(review => review.id === reviewIdToUpdate);
            
                if (reviewIndex !== -1) {
                    // Get the updated values from the input fields
                    const editForm = event.target.closest('.edit-form');
                    const reviewerNameInput = editForm.querySelector(`#edit-reviewer-${reviewIdToUpdate}`);
                    const courseNameInput = editForm.querySelector(`#edit-course-${reviewIdToUpdate}`);
                    const ratingInput = editForm.querySelector(`#edit-rating-${reviewIdToUpdate}`);
                    const reviewTextInput = editForm.querySelector(`#edit-text-${reviewIdToUpdate}`);

                    if (reviewerNameInput && courseNameInput && ratingInput && reviewTextInput) {
                        allReviews[reviewIndex].reviewer = reviewerNameInput.value.trim();
                        allReviews[reviewIndex].course = courseNameInput.value.trim();
                        allReviews[reviewIndex].rating = parseInt(ratingInput.value);
                        allReviews[reviewIndex].text = reviewTextInput.value.trim();

                        // Save the updated reviews to localStorage
                        saveReviews();

                        // Re-render the reviews to display the changes
                        applyFiltersAndSort();

                        // Hide the edit form and show the review details
                        const reviewDetails = editForm.previousElementSibling;
                        editForm.classList.add('hidden');
                        reviewDetails.classList.remove('hidden');
                        currentlyEditingId = null;
                    }
                }
            }
        }
    });

   // --- Update Pagination Controls ---
    function updatePagination(reviews) {
      if (!paginationContainer) return;
      const totalPages = Math.ceil(reviews.length / reviewsPerPage); // Calculate the total number of pages
      paginationContainer.innerHTML = ''; // Clear existing pagination links
  
      const prevLink = document.createElement('a'); // Create "Previous" link
      prevLink.href = '#';
      prevLink.classList.add('page-number', 'prev');
      prevLink.textContent = 'Previous';
      prevLink.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderCurrentPage(reviews);
          updatePagination(reviews);
        }
      });
      paginationContainer.appendChild(prevLink);
  
      for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.classList.add('page-number');
        pageLink.textContent = i;
        if (i === currentPage) {
          pageLink.classList.add('current');
        }
        pageLink.addEventListener('click', () => {
          currentPage = i;
          renderCurrentPage(reviews);
          updatePagination(reviews);
        });
        paginationContainer.appendChild(pageLink);

         // Add ellipses for large number of pages
        if (totalPages > 5 && i === 2 && currentPage > 3) {
          const dots = document.createElement('span');
          dots.classList.add('page-number', 'dots');
          dots.textContent = '...';
          paginationContainer.appendChild(dots);
          i = totalPages - 2;
        } else if (totalPages > 5 && i === totalPages - 2 && currentPage < totalPages - 2) {
          const dots = document.createElement('span');
          dots.classList.add('page-number', 'dots');
          dots.textContent = '...';
          paginationContainer.appendChild(dots);
        }
      }
  
      const nextLink = document.createElement('a');
      nextLink.href = '#';
      nextLink.classList.add('page-number', 'next');
      nextLink.textContent = 'Next';
      nextLink.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderCurrentPage(reviews);
          updatePagination(reviews);
        }
      });
      paginationContainer.appendChild(nextLink);
    }


    // --- Render Reviews for the Current Page ---
    function renderCurrentPage(reviews) {
      const startIndex = (currentPage - 1) * reviewsPerPage;
      const endIndex = startIndex + reviewsPerPage;
      const currentReviews = reviews.slice(startIndex, endIndex);
      renderReviews(currentReviews);
    }
  
     // --- Get Course Level from Course Name ---
    function getCourseLevel(courseName) {
        const romanMap = { "I": 1, "II": 2, "III": 3, "IIV": 4 };
        const parts = courseName.split(/[\s]+/);

        for (const part of parts) {
            const romanMatch = romanMap[part.toUpperCase()];
            if (romanMatch) return romanMatch;
            const numberMatch = part.match(/^(\d+)$/);
            if (numberMatch) return parseInt(numberMatch[1]);
        }
        return 1; // Default to level 1
    }
    
  
    // --- Search Functionality ---
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredReviews = allReviews.filter(review =>
          review.course.toLowerCase().includes(searchTerm) ||
          review.text.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderCurrentPage(filteredReviews);
        updatePagination(filteredReviews);
      });
    }
    
    // --- Sort Reviews ---
    if (sortByFilter) {
        console.log('sortByFilter event listener is being attached.');
        sortByFilter.addEventListener('change', applyFiltersAndSort);
    }
  
    // --- Filter by Category ---
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            applyFiltersAndSort();
            
        });
    }
  
    // --- Apply Filters and Sorting ---
    function applyFiltersAndSort() {
        const selectedCategory = categoryFilter ? categoryFilter.value : "";
        const sortByValue = sortByFilter ? sortByFilter.value : "sort";

        let filteredAndSortedReviews = [...allReviews];

        if (selectedCategory) {
            filteredAndSortedReviews = filteredAndSortedReviews.filter(review => courseCategories[review.course] === selectedCategory);
        }

        if (sortByValue === 'rating') {
            filteredAndSortedReviews.sort((a, b) => b.rating - a.rating);
        } else if (sortByValue === 'level') {
            filteredAndSortedReviews.sort((a, b) => getCourseLevel(a.course) - getCourseLevel(b.course));
        }

        currentPage = 1;
        renderCurrentPage(filteredAndSortedReviews);
        updatePagination(filteredAndSortedReviews);
    }

    // --- Load Reviews from localStorage ---
    function loadReviews() {
        const storedReviews = localStorage.getItem('reviews');
        if (storedReviews) {
            allReviews = JSON.parse(storedReviews);
        }
    }

    // --- Save Reviews to localStorage ---
    function saveReviews() {
        localStorage.setItem('reviews', JSON.stringify(allReviews));
    }


    // --- Event listener to show the add review form ---
    if (addReviewButton) {
        addReviewButton.addEventListener('click', () => {
            if (reviewForm) {
                reviewForm.classList.remove('hidden');
            }
        });
    }

    // --- Event listener for submitting the add review form ---
    if (addReviewForm) {
         addReviewForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const reviewerNameInput = document.getElementById('reviewerName');
            const courseNameInput = document.getElementById('courseName');
            const reviewTextInput = document.getElementById('reviewText');
            const ratingInput = document.getElementById('rating');
            const categorySelect = document.getElementById('category');

            const reviewerName = reviewerNameInput.value.trim();
            const courseName = courseNameInput.value.trim();
            const reviewText = reviewTextInput.value.trim();
            const rating = parseInt(ratingInput.value);
            const category = categorySelect.value;

            let isValid = true;
            const errorMessages = [];

            if (!reviewerName) {
                isValid = false;
                errorMessages.push("Please enter your name.");
            }
            if (!courseName) {
                isValid = false;
                errorMessages.push("Please enter a course name.");
            }
            if (!category) {
                isValid = false;
                errorMessages.push("Please select a category.");
            }
            if (!reviewText) {
                isValid = false;
                errorMessages.push("Please enter your review.");
            }
            if (isNaN(rating) || rating < 1 || rating > 5) {
                isValid = false;
                errorMessages.push("Please enter a rating between 1 and 5.");
            }

            if (!isValid) {
                alert(errorMessages.join('\n'));
                return;
            }

            // Create a new review object
            const newReview = {
                id: Date.now(),
                course: courseName,
                reviewer: reviewerName,
                rating: rating,
                text: reviewText,
                date: new Date().toLocaleDateString()
            };
            allReviews.unshift(newReview);
            // Update the courseCategories object if the new course doesn't exist
            if (!courseCategories[courseName]) {
                courseCategories[courseName] = category;
                populateCourseFilter(allReviews); 
            }
            saveReviews(); // Save the updated reviews to localStorage
            currentPage = 1;
            applyFiltersAndSort();

            reviewForm.classList.add('hidden');
            addReviewForm.reset();
        });
    }
    
    // --- Initial Load and Setup ---
    loadReviews();
    if (allReviews.length === 0) {
        fetchReviews(); // Fetch reviews from the API if none are in local storage
    } else {
        renderCurrentPage(allReviews);
        updatePagination(allReviews);
        populateCourseFilter(allReviews);
    }
    loadComments();  // Load comments from local storage
});




//everything seems good know ..Aldana