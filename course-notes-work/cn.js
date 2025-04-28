// Global variables that need to be accessed across functions
let allNotesData = [];
let filteredNotes = [];
let currentPage = 1;
const notesPerPage = 6;
let notesGrid, paginationContainer;

async function fetchNotes() {
    displayLoading();
    try {
        const response = await fetch('https://680e88eb67c5abddd1926516.mockapi.io/notes/courseNotes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        clearLoading();
        allNotesData = data;
        filteredNotes = [...allNotesData];
        currentPage = 1;
        renderNotes();
        renderPagination();
        populateCategoryOptions();
    } catch (error) {
        console.error('Fetch error:', error);
        displayError(error.message);
        if (notesGrid) {
            notesGrid.innerHTML = '<p class="text-red-500">Failed to load notes.</p>';
        }
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
    }
}

function displayLoading() {
    if (notesGrid) {
        notesGrid.innerHTML = '<p class="text-gray-500">Loading notes...</p>';
    }
}

function clearLoading() {
    console.log('Notes loaded.');
}

function displayError(message) {
    if (notesGrid) {
        notesGrid.innerHTML = `<p class="text-red-500">Error: ${message}</p>`;
    }
}

function populateCategoryOptions() {
    const categorySelect = document.querySelector('select:first-of-type');
    if (!categorySelect) return;

    // Clear existing options except the first one
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }

    // Get unique course names
    const uniqueCourses = [...new Set(allNotesData.map(note => note.courseName))];
    
    // Add new options
    uniqueCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        categorySelect.appendChild(option);
    });
}

// Function to render the notes for the current page
function renderNotes() {
    if (!notesGrid) return;

    const startIndex = (currentPage - 1) * notesPerPage;
    const endIndex = startIndex + notesPerPage;
    const currentNotes = filteredNotes.slice(startIndex, endIndex);

    notesGrid.innerHTML = ''; // Clear existing notes
    currentNotes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('border', 'rounded-lg', 'p-4', 'shadow', 'hover:shadow-md', 'transition', 'duration-200', 'bg-white');
        noteDiv.innerHTML = `
            <h2 class="text-lg font-semibold mb-2">${note.courseName || 'No Title'}</h2>
            <p class="text-xs text-gray-400 mb-2">${note.date ? new Date(note.date).toLocaleDateString() : 'No Date'}</p>
            <p class="text-sm text-gray-600 mb-4">${note.description || 'No Description'}</p>
            <button class="viewDetailsBtn text-blue-600 hover:underline text-sm" data-course="${note.courseName}">View Details</button>
        `;
        notesGrid.appendChild(noteDiv);
    });

    // Re-attach event listeners to the newly rendered "View Details" buttons
    document.querySelectorAll('.viewDetailsBtn').forEach(button => {
        button.addEventListener('click', () => {
            const courseName = button.dataset.course;
            showDetails(courseName);
        });
    });
}

// Function to render the pagination links
function renderPagination() {
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.classList.add('px-3', 'py-1', 'border', 'border-gray-300', 'rounded', 'hover:bg-gray-100');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderNotes();
            renderPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('px-3', 'py-1', 'border', 'border-gray-300', 'rounded', 'hover:bg-gray-100');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.remove('border-gray-300', 'hover:bg-gray-100');
            pageButton.classList.add('bg-blue-600', 'text-white');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderNotes();
            renderPagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.classList.add('px-3', 'py-1', 'border', 'border-gray-300', 'rounded', 'hover:bg-gray-100');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderNotes();
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Function to display details page and load comments
function showDetails(courseName) {
    const notesMain = document.querySelector('main');
    const detailsPage = document.getElementById('detailsPage');
    if (!notesMain || !detailsPage) return;

    notesMain.classList.add('hidden');
    detailsPage.classList.remove('hidden');
    document.querySelector('#detailsPage h2').textContent = `Comments for ${courseName}`;
    loadComments(courseName);
}

// Function to find a note by its course name
function findNote(courseName) {
    return allNotesData.find(note => note.courseName === courseName);
}

// Function to load comments for a specific course
function loadComments(courseName) {
    const commentsContainer = document.getElementById('comments');
    if (!commentsContainer) return;

    commentsContainer.innerHTML = ''; // Clear existing comments
    const note = findNote(courseName);
    if (note && note.comments) {
        note.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('border', 'rounded-md', 'p-3', 'bg-gray-50', 'mb-2');
            commentDiv.innerHTML = `<p class="text-sm text-gray-700 mb-1">${comment.text}</p>
                                     <p class="text-xs text-gray-500">By ${comment.author || 'Anonymous'} on ${comment.date ? new Date(comment.date).toLocaleDateString() : 'unknown date'}</p>`;
            commentsContainer.appendChild(commentDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    notesGrid = document.querySelector('.grid');
    paginationContainer = document.querySelector('.mt-10.flex.justify-center.items-center.space-x-2.text-sm');
    
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.md\\:hidden nav');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Dropdown menu on hover (for desktop)
    const menuLink = document.querySelector('.group > a');
    const menuDropdown = document.querySelector('#MN');
    if (menuLink && menuDropdown) {
        menuLink.addEventListener('mouseenter', () => {
            menuDropdown.classList.remove('hidden');
        });

        const menuGroup = menuLink.closest('.group');
        if (menuGroup) {
            menuGroup.addEventListener('mouseleave', () => {
                menuDropdown.classList.add('hidden');
            });
        }
    }

    // Back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            const detailsPage = document.getElementById('detailsPage');
            const notesMain = document.querySelector('main');
            if (detailsPage && notesMain) {
                detailsPage.classList.add('hidden');
                notesMain.classList.remove('hidden');
                document.getElementById('comments').innerHTML = '';
            }
        });
    }

    // Post comment
    const postCommentButton = document.getElementById('postComment');
    const commentInput = document.getElementById('commentInput');
    if (postCommentButton && commentInput) {
        postCommentButton.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                const detailsPageTitle = document.querySelector('#detailsPage h2').textContent;
                const courseName = detailsPageTitle.split('for ')[1];
                const note = findNote(courseName);
                if (note) {
                    if (!note.comments) note.comments = [];
                    const newComment = { 
                        text: commentText, 
                        author: 'You', 
                        date: new Date().toISOString() 
                    };
                    note.comments.push(newComment);
                    loadComments(courseName);
                    commentInput.value = '';
                }
            } else {
                alert('Please enter a comment.');
            }
        });
    }

    // Create new note form
    const createNoteForm = document.querySelector('#item-form form');
    if (createNoteForm) {
        createNoteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const courseNameInput = createNoteForm.querySelector('input[type="text"]');
            const descriptionInput = createNoteForm.querySelector('textarea');
            const dateInput = createNoteForm.querySelector('input[type="date"]');
            
            const newCourseName = courseNameInput.value.trim();
            const newDescription = descriptionInput.value.trim();
            const newDate = dateInput.value;

            if (newCourseName && newDescription && newDate) {
                const newNote = {
                    courseName: newCourseName,
                    description: newDescription,
                    date: newDate,
                    comments: []
                };
                
                // Here you should also POST this to your API
                fetch('https://680e88eb67c5abddd1926516.mockapi.io/notes/courseNotes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newNote),
                })
                .then(response => response.json())
                .then(data => {
                    // Add the new note to our local data
                    allNotesData.unshift(data);
                    currentPage = 1;
                    filteredNotes = [...allNotesData];
                    renderNotes();
                    createNoteForm.reset();
                })
                .catch(error => {
                    console.error('Error creating note:', error);
                    alert('Failed to create note. Please try again.');
                });
            } else {
                alert('Please fill in all the required fields to create a new note.');
            }
        });
    }

    // Filtering by category
    const categorySelect = document.querySelector('select:first-of-type');
    if (categorySelect) {
        categorySelect.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            currentPage = 1;
            if (selectedCategory === 'All Categories') {
                filteredNotes = [...allNotesData];
            } else {
                filteredNotes = allNotesData.filter(note => note.courseName === selectedCategory);
            }
            renderNotes();
        });
    }

    // Sorting functionality
    const sortSelect = document.querySelector('.flex.gap-2.items-center select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            const sortBy = event.target.value;
            currentPage = 1;
            if (sortBy === 'Newest') {
                filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sortBy === 'Oldest') {
                filteredNotes.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
            renderNotes();
        });
    }

    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            currentPage = 1;
            filteredNotes = allNotesData.filter(note =>
                (note.courseName && note.courseName.toLowerCase().includes(searchTerm)) ||
                (note.description && note.description.toLowerCase().includes(searchTerm))
            );
            renderNotes();
        });
    }

    // Initial data fetch
    fetchNotes();
});