// CampusNews-AddNews.js
document.addEventListener('DOMContentLoaded', function() {
    const newsForm = document.querySelector('form');
    
    if (newsForm) {
        newsForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            if (!validateForm()) {
                showNotification('Please fix all errors before submitting', 'error');
                return;
            }

            // Show loading state
            const submitBtn = newsForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Publishing...';
            submitBtn.disabled = true;

            try {
                // Simulate API call 
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Article published successfully!', 'success');
                
                // Clear form
                newsForm.reset();
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = 'CampusNews.html';
                }, 2000);
            } catch (error) {
                console.error('Submission error:', error);
                showNotification('Failed to publish article', 'error');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add event listeners for real-time validation
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const categorySelect = document.getElementById('category');
    const imageInput = document.getElementById('image');
    const authorInput = document.getElementById('author');
    const publishDateInput = document.getElementById('publish-date');

    if (titleInput) titleInput.addEventListener('input', validateTitle);
    if (contentInput) contentInput.addEventListener('input', validateContent);
    if (categorySelect) categorySelect.addEventListener('change', validateCategory);
    if (imageInput) imageInput.addEventListener('change', validateImage);
    if (authorInput) authorInput.addEventListener('input', validateAuthor);
    if (publishDateInput) publishDateInput.addEventListener('change', validatePublishDate);
});

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `form-notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function validateForm() {
    const isTitleValid = validateTitle();
    const isContentValid = validateContent();
    const isCategoryValid = validateCategory();
    const isImageValid = validateImage();
    const isAuthorValid = validateAuthor();
    const isDateValid = validatePublishDate();

    return isTitleValid && isContentValid && isCategoryValid && 
           isImageValid && isAuthorValid && isDateValid;
}

function validateTitle() {
    const titleInput = document.getElementById('title');
    const title = titleInput.value.trim();

    // Create error element if it doesn't exist
    let errorElement = titleInput.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red mt-1 text-sm';
        titleInput.parentNode.insertBefore(errorElement, titleInput.nextSibling);
    }

    if (title === '') {
        errorElement.textContent = 'Title is required';
        titleInput.classList.add('border-red');
        titleInput.classList.remove('border-brown');
        return false;
    }

    if (title.length > 100) {
        errorElement.textContent = 'Title must be less than 100 characters';
        titleInput.classList.add('border-red');
        titleInput.classList.remove('border-brown');
        return false;
    }

    errorElement.textContent = '';
    titleInput.classList.remove('border-red');
    titleInput.classList.add('border-brown');
    return true;
}

function validateContent() {
    const contentInput = document.getElementById('content');
    const content = contentInput.value.trim();

    let errorElement = contentInput.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red mt-1 text-sm';
        contentInput.parentNode.insertBefore(errorElement, contentInput.nextSibling);
    }

    if (content === '') {
        errorElement.textContent = 'Content is required';
        contentInput.classList.add('border-red');
        contentInput.classList.remove('border-brown');
        return false;
    }

    if (content.length < 300) {
        errorElement.textContent = 'Content must be at least 300 characters';
        contentInput.classList.add('border-red');
        contentInput.classList.remove('border-brown');
        return false;
    }

    errorElement.textContent = '';
    contentInput.classList.remove('border-red');
    contentInput.classList.add('border-brown');
    return true;
}

function validateCategory() {
    const categorySelect = document.getElementById('category');
    const category = categorySelect.value;

    let errorElement = categorySelect.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red mt-1 text-sm';
        categorySelect.parentNode.insertBefore(errorElement, categorySelect.nextSibling);
    }

    if (category === '') {
        errorElement.textContent = 'Please select a category';
        categorySelect.classList.add('border-red');
        categorySelect.classList.remove('border-brown');
        return false;
    }

    errorElement.textContent = '';
    categorySelect.classList.remove('border-red');
    categorySelect.classList.add('border-brown');
    return true;
}

function validateImage() {
    const imageInput = document.getElementById('image');
    const uploadContainer = imageInput.closest('div.border-dashed');
    
    let errorElement = uploadContainer.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red mt-1 text-sm';
        uploadContainer.parentNode.insertBefore(errorElement, uploadContainer.nextSibling);
    }

    if (imageInput.files.length === 0) {
        errorElement.textContent = 'An image is required';
        uploadContainer.classList.add('border-red');
        uploadContainer.classList.remove('border-brown');
        return false;
    }

    const file = imageInput.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
        errorElement.textContent = 'Only JPEG, PNG, and GIF images are allowed';
        uploadContainer.classList.add('border-red');
        uploadContainer.classList.remove('border-brown');
        return false;
    }

    if (file.size > maxSize) {
        errorElement.textContent = 'Image size must be less than 2MB';
        uploadContainer.classList.add('border-red');
        uploadContainer.classList.remove('border-brown');
        return false;
    }

    errorElement.textContent = '';
    uploadContainer.classList.remove('border-red');
    uploadContainer.classList.add('border-brown');
    return true;
}

function validateAuthor() {
    const authorInput = document.getElementById('author');
    const author = authorInput.value.trim();

    let errorElement = authorInput.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red mt-1 text-sm';
        authorInput.parentNode.insertBefore(errorElement, authorInput.nextSibling);
    }

    if (author === '') {
        errorElement.textContent = 'Author name is required';
        authorInput.classList.add('border-red');
        authorInput.classList.remove('border-brown');
        return false;
    }

    errorElement.textContent = '';
    authorInput.classList.remove('border-red');
    authorInput.classList.add('border-brown');
    return true;
}

function validatePublishDate() {
    const publishDateInput = document.getElementById('publish-date');
    const publishDate = new Date(publishDateInput.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

    let errorElement = publishDateInput.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red mt-1 text-sm';
        publishDateInput.parentNode.insertBefore(errorElement, publishDateInput.nextSibling);
    }

    if (!publishDateInput.value) {
        errorElement.textContent = 'Publish date is required';
        publishDateInput.classList.add('border-red');
        publishDateInput.classList.remove('border-brown');
        return false;
    }

    if (publishDate < currentDate) {
        errorElement.textContent = 'Publish date cannot be in the past';
        publishDateInput.classList.add('border-red');
        publishDateInput.classList.remove('border-brown');
        return false;
    }

    errorElement.textContent = '';
    publishDateInput.classList.remove('border-red');
    publishDateInput.classList.add('border-brown');
    return true;
}