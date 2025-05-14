// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Select the form element and image input field
    const newsForm = document.querySelector('form');
    const imageInput = document.getElementById('image');
    const previewContainer = document.getElementById('image-preview');
     //Image Preview Handler (handles the image preview display when a file is selected).
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            previewContainer.innerHTML = '';
            // Check if a file is selected and display the preview
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewContainer.innerHTML = `
                        <div class="relative">
                            <img src="${e.target.result}" class="max-h-40 rounded-lg">
                            <button type="button" onclick="clearImage()" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                };
                reader.readAsDataURL(this.files[0]);
            }
            // Validate the selected image
            validateImage();
        });
    }
    //Form Submission Handler (Prevents the default form submission, validates the form data, and sends a POST request)
    if (newsForm) {
        newsForm.addEventListener('submit', async function(event) {
            event.preventDefault();// Prevent the default form submission

            if (!validateForm()) {
                showNotification('Please fix all errors before submitting', 'error');
                return;
            }
            // Validate the form before proceeding
            const submitBtn = newsForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Publishing...';
            submitBtn.disabled = true;
            newsForm.classList.add('opacity-50', 'pointer-events-none');

            try {
                // Collect form data and send a POST request
                const formData = new FormData(newsForm);
                const response = await fetch('/Project-ITCS-333/course-reviews/create.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                // Handle server response
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to publish article');
                }
                // Success notification
                showNotification('Article published successfully!', 'success');
                newsForm.reset();
                previewContainer.innerHTML = '';
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'CampusNews.html';
                }, 2000);
            } catch (error) {
                console.error('Submission error:', error);
                showNotification(error.message, 'error');
                // Reset form state
            } finally {
                newsForm.classList.remove('opacity-50', 'pointer-events-none');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add event listeners for real-time validation
    const inputs = {
        title: document.getElementById('title'),
        content: document.getElementById('content'),
        category: document.getElementById('category'),
        author: document.getElementById('author'),
        'publish-date': document.getElementById('publish-date')
    };

    Object.entries(inputs).forEach(([name, input]) => {
        if (input) {
            const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(eventType, () => {
                if (name === 'publish-date') validatePublishDate();
                else if (name === 'category') validateCategory();
                else if (name === 'author') validateAuthor();
                else if (name === 'content') validateContent();
                else validateTitle();
            });
        }
    });
});

// Notification system
function showNotification(message, type) {
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `form-notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white animate-fade-in`;

    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Validation functions
function validateForm() {
    return [
        validateTitle(),
        validateContent(),
        validateCategory(),
        validateImage(),
        validateAuthor(),
        validatePublishDate()
    ].every(valid => valid);
}

function createErrorElement(input) {
    let errorElement = input.nextElementSibling;
    if (!errorElement?.classList?.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red-500 mt-1 text-sm';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    return errorElement;
}

function validateTitle() {
    const input = document.getElementById('title');
    const value = input.value.trim();
    const errorElement = createErrorElement(input);

    let isValid = true;
    if (value === '') {
        errorElement.textContent = 'Title is required';
        isValid = false;
    } else if (value.length > 100) {
        errorElement.textContent = 'Title must be less than 100 characters';
        isValid = false;
    } else {
        errorElement.textContent = '';
    }

    input.classList.toggle('border-red-500', !isValid);
    return isValid;
}

function validateContent() {
    const input = document.getElementById('content');
    const value = input.value.trim();
    const errorElement = createErrorElement(input);

    let isValid = true;
    if (value === '') {
        errorElement.textContent = 'Content is required';
        isValid = false;
    } else if (value.length < 300) {
        errorElement.textContent = 'Content must be at least 300 characters';
        isValid = false;
    } else {
        errorElement.textContent = '';
    }

    input.classList.toggle('border-red-500', !isValid);
    return isValid;
}

function validateCategory() {
    const input = document.getElementById('category');
    const value = input.value;
    const errorElement = createErrorElement(input);

    const isValid = value !== '';
    errorElement.textContent = isValid ? '' : 'Please select a category';
    input.classList.toggle('border-red-500', !isValid);
    return isValid;
}

function validateImage() {
    const input = document.getElementById('image');
    const uploadContainer = input.closest('div.border-dashed');
    const errorElement = createErrorElement(uploadContainer);

    let isValid = true;
    if (!input.files.length) {
        errorElement.textContent = 'An image is required';
        isValid = false;
    } else {
        const file = input.files[0];
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            errorElement.textContent = 'Only JPEG, PNG, and GIF images are allowed';
            isValid = false;
        } else if (file.size > 2 * 1024 * 1024) {
            errorElement.textContent = 'Image size must be less than 2MB';
            isValid = false;
        } else {
            errorElement.textContent = '';
        }
    }

    uploadContainer.classList.toggle('border-red-500', !isValid);
    return isValid;
}

function validateAuthor() {
    const input = document.getElementById('author');
    const value = input.value.trim();
    const errorElement = createErrorElement(input);

    const isValid = value !== '';
    errorElement.textContent = isValid ? '' : 'Author name is required';
    input.classList.toggle('border-red-500', !isValid);
    return isValid;
}

function validatePublishDate() {
    const input = document.getElementById('publish-date');
    const value = new Date(input.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const errorElement = createErrorElement(input);

    let isValid = true;
    if (!input.value) {
        errorElement.textContent = 'Publish date is required';
        isValid = false;
    } else if (value < currentDate) {
        errorElement.textContent = 'Publish date cannot be in the past';
        isValid = false;
    } else {
        errorElement.textContent = '';
    }

    input.classList.toggle('border-red-500', !isValid);
    return isValid;
}

function clearImage() {
    const input = document.getElementById('image');
    input.value = '';
    document.getElementById('image-preview').innerHTML = '';
    validateImage();
}