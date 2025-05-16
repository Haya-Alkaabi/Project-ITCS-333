
//CHANGE THIS WHEN DEPLOYING TO REPLIT
const API_URL = "http://localhost:8000/api";

let allNotesData = [];
let filteredNotes = [];
let currentPage = 1;
const notesPerPage = 6;
let notesGrid, paginationContainer;



async function fetchNotes() {
    displayLoading();
    try {
        const response = await fetch(`${API_URL}/notes/index.php?page=${currentPage}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 

        const data = await response.json();
        clearLoading();

        allNotesData = data;
        filteredNotes = [...allNotesData];

        renderNotes();
        renderPagination();
        populateCategoryOptions();
    } catch (error) {
        console.error('Fetch error:', error);
        displayError(error.message);
    }
}

function displayLoading() {
    if (notesGrid) {
        notesGrid.innerHTML = '<p class="text-gray-500">Loading notes...</p>';
    } 
}

function clearLoading() {
    alert('notes loaded!')
}

function displayError(message) {
    if (notesGrid) {
        notesGrid.innerHTML = `<p class="text-red-500">Error: ${message}</p>`;
    } 
}


function populateCategoryOptions() {
    const categorySelect = document.querySelector('select:first-of-type');
    if (!categorySelect) return;

    while (categorySelect.options.length > 1) categorySelect.remove(1);
    const uniqueCourses = [...new Set(allNotesData.map(note => note.course_name))];

    uniqueCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        categorySelect.appendChild(option);
    });
}

function renderNotes() {
    if (!notesGrid) return;
    const startIndex = (currentPage - 1) * notesPerPage;
    const currentNotes = filteredNotes.slice(startIndex, startIndex + notesPerPage);
    notesGrid.innerHTML = '';
    currentNotes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'border rounded-lg p-4 shadow hover:shadow-md transition duration-200 bg-white';
        noteDiv.innerHTML = `
            <h2 class="text-lg font-semibold mb-2">${note.course_name}</h2>
            <p class="text-xs text-gray-400 mb-2">${new Date(note.note_date).toLocaleDateString()}</p>
            <p class="text-sm text-gray-600 mb-4">${note.description}</p>
            <button class="viewDetailsBtn text-blue-600 hover:underline text-sm" data-id="${note.id}" data-course="${note.course_name}">View Details</button>
        `;
        notesGrid.appendChild(noteDiv);
    });

    document.querySelectorAll('.viewDetailsBtn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const courseName = button.dataset.course;
            showDetails(id, courseName);
        });
    });
}


function renderPagination() {
    if (!paginationContainer) return;
    const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
    paginationContainer.innerHTML = '';

    const createButton = (text, callback, disabled = false, active = false) => {
        const btn = document.createElement('button');
        btn.className = 'px-3 py-1 border border-gray-300 rounded hover:bg-gray-100';
        if (disabled) btn.disabled = true;
        if (active) {
            btn.classList.remove('border-gray-300');
            btn.classList.add('bg-blue-600', 'text-white');
        }
        btn.textContent = text;
        btn.addEventListener('click', callback);
        return btn;
    };

    paginationContainer.appendChild(createButton('Previous', () => { currentPage--; renderNotes(); renderPagination(); }, currentPage === 1));
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createButton(i, () => { currentPage = i; renderNotes(); renderPagination(); }, false, i === currentPage));
    }
    paginationContainer.appendChild(createButton('Next', () => { currentPage++; renderNotes(); renderPagination(); }, currentPage === totalPages));
}


function showDetails(noteId, courseName) {
    const notesMain = document.querySelector('main');
    const detailsPage = document.getElementById('detailsPage');
    if (!notesMain || !detailsPage) return;

    notesMain.classList.add('hidden');
    detailsPage.classList.remove('hidden');
    document.querySelector('#detailsPage h2').textContent = `Comments for ${courseName}`;
    loadComments(noteId);
}


async function loadComments(noteId) {
    const commentsContainer = document.getElementById('comments');
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';
    try {
        const response = await fetch(`${API_URL}/comments/index.php?note_id=${noteId}`);
        const comments = await response.json();
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'border rounded-md p-3 bg-gray-50 mb-2';
            commentDiv.innerHTML = `
                <p class="text-sm text-gray-700 mb-1">${comment.text}</p>
                <p class="text-xs text-gray-500">By ${comment.author || 'Anonymous'} on ${new Date(comment.created_at).toLocaleDateString()}</p>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    } catch (error) {
        commentsContainer.innerHTML = '<p class="text-red-500">Failed to load comments.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    notesGrid = document.querySelector('.grid');
    paginationContainer = document.querySelector('.mt-10.flex.justify-center.items-center.space-x-2.text-sm');

    // mobile navigation
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.md\\:hidden nav');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    
    document.getElementById('backButton').addEventListener('click', () => {
        document.getElementById('detailsPage').classList.add('hidden');
        document.querySelector('main').classList.remove('hidden');
        document.getElementById('comments').innerHTML = '';
    });

    
    document.getElementById('postComment').addEventListener('click', async () => {
        const commentText = document.getElementById('commentInput').value.trim();
        const title = document.querySelector('#detailsPage h2').textContent;
        const courseName = title.split('for ')[1];
        const note = allNotesData.find(n => n.course_name === courseName);
        if (!note || !commentText) return alert('Please enter a comment.');

        try {
            await fetch(`${API_URL}/comments/index.php?note_id=${note.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText, author: 'You' })
            });
            document.getElementById('commentInput').value = '';
            loadComments(note.id);
        } catch (err) {
            alert('Error posting comment');
        }
    });

    
    document.querySelector('#item-form form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseName = e.target.querySelector('input[type="text"]').value.trim();
        const description = e.target.querySelector('textarea').value.trim();
        const date = e.target.querySelector('input[type="date"]').value;
        if (!courseName || !description || !date) {
            return alert('Fill all fields.');
        } 

        try {
            const res = await fetch(`${API_URL}/notes/index.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseName, description, date })
            });
            const newNote = await res.json();
            await fetchNotes();
            e.target.reset();
        } catch (error) {
            alert('Error creating note');
        }
    });

    // filters.
    document.querySelector('select:first-of-type').addEventListener('change', (e) => {
        const selected = e.target.value;
        currentPage = 1;
        filteredNotes = selected === 'All Categories'
            ? [...allNotesData]
            : allNotesData.filter(n => n.course_name === selected);
        renderNotes();
    });


    document.querySelector('.flex.gap-2.items-center select').addEventListener('change', (e) => {
        const sortBy = e.target.value;
        filteredNotes.sort((a, b) => new Date(sortBy === 'Newest' ? b.note_date : a.note_date) - new Date(sortBy === 'Newest' ? a.note_date : b.note_date));
        renderNotes();
    });

    // searching
    document.querySelector('input[type="text"]').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filteredNotes = allNotesData.filter(note =>
            note.course_name.toLowerCase().includes(term) ||
            note.description.toLowerCase().includes(term)
        );
        currentPage = 1;
        renderNotes();
    });

    // first render
    fetchNotes();
});
