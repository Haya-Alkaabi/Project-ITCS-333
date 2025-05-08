document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('.SubmitBtn');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Disable submit button to prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.querySelector('.btnText').textContent = 'Submitting...';
        
        try {
            // Validate all form data
            if (!validatePersonalData() || !validateItemDetails()) {
                return;
            }
            
            // Prepare form data with actual image filename
            const formData = prepareFormData();
            
            // Submit to API
            const response = await submitToApi(formData);
            
            if (response.ok) {
                alert('Item added successfully!');
                // Clear cache and force refresh
                localStorage.removeItem('marketplaceItems');
                sessionStorage.setItem('forceRefresh', 'true');
                window.location.href = `St_mkt_place.html?refresh=${Date.now()}`;
            } else {
                throw new Error(`API request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit item. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btnText').textContent = 'Submit';
        }
    });
    
    function prepareFormData() {
        const itemImage = document.getElementById('itemImage').files[0];
        const now = new Date().toISOString();
        
        return {
            // Core item information
            title: document.getElementById('itemName').value.trim(),
            author: document.getElementById('fullName').value.trim(),
            price: document.getElementById('itemPrice').value.trim(),
            category: document.getElementById('itemType').value.trim().toLowerCase(),
            image: `img/${itemImage.name}`, // Using actual uploaded filename
            reviews: 0,
            format: document.getElementById('itemType').value.trim(),
            contact: document.getElementById('mobileNumber').value.trim(),
            overview: document.getElementById('itemBrief').value.trim(),
            customerReviews: [],
            
            // Seller information
            seller: document.getElementById('fullName').value.trim(),
            studentId: document.getElementById('studentId').value.trim(),
            email: document.getElementById('studentEmail').value.trim(),
            phone: document.getElementById('mobileNumber').value.trim(),
            college: document.getElementById('college').value,
            major: document.getElementById('major').value.trim(),
            
            // Additional metadata
            quantity: parseInt(document.getElementById('itemQuantity').value) || 1,
            createdAt: now,
            updatedAt: now,
            
            // Store original filename for reference
            originalFilename: itemImage.name
        };
    }
    
    async function submitToApi(formData) {
        const apiUrl = 'https://680d0e83c47cb8074d8f6cb6.mockapi.io/items';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('API Error:', errorDetails);
            throw new Error(`API request failed: ${errorDetails}`);
        }
        
        return response;
    }
       
    function validatePersonalData() {
        const requiredFields = {
            fullName: 'Please enter your full name',
            studentId: 'Student ID must be 8 or 9 digits',
            studentEmail: 'Please use your valid UOB student email',
            mobileNumber: 'Please enter a valid mobile number',
            college: 'Please select your college',
            major: 'Please enter your major'
        };
        
        // Validate each required field
        for (const [fieldId, errorMsg] of Object.entries(requiredFields)) {
            const element = document.getElementById(fieldId);
            const value = element.value.trim();
            
            if (!value || (fieldId === 'college' && value === 'Select College')) {
                alert(errorMsg);
                return false;
            }
            
            // Special validation for student ID
            if (fieldId === 'studentId' && !/^\d{8,9}$/.test(value)) {
                alert(errorMsg);
                return false;
            }
            
            // Special validation for email
            if (fieldId === 'studentEmail' && !validateEmail(value, document.getElementById('studentId').value.trim())) {
                return false;
            }
        }
        
        return true;
    }
    
    function validateItemDetails() {
        const itemName = document.getElementById('itemName');
        const itemType = document.getElementById('itemType');
        const itemBrief = document.getElementById('itemBrief');
        const itemPrice = document.getElementById('itemPrice');
        const itemQuantity = document.getElementById('itemQuantity');
        const itemImage = document.getElementById('itemImage');
        
        // Validate text fields
        if (!itemName.value.trim()) {
            alert('Please enter the item name');
            return false;
        }
        
        if (!itemType.value.trim()) {
            alert('Please select the item type');
            return false;
        }
        
        if (!itemBrief.value.trim()) {
            alert('Please enter a brief description');
            return false;
        }
        
        // Validate price
        const price = parseFloat(itemPrice.value);
        if (isNaN(price) || price <= 0) {
            alert('Please enter a valid price (greater than 0)');
            return false;
        }
        
        // Validate quantity
        const quantity = parseInt(itemQuantity.value);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity (greater than 0)');
            return false;
        }
        
        // Validate image
        if (!itemImage.files || itemImage.files.length === 0) {
            alert('Please upload an image of the item');
            return false;
        }
        
        const imageFile = itemImage.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        
        if (!validTypes.includes(imageFile.type)) {
            alert('Only JPG, PNG, and GIF images are allowed');
            return false;
        }
        
        if (imageFile.size > maxSize) {
            alert('Image size must be less than 2MB');
            return false;
        }
        
        return true;
    }
    
    function validateEmail(email, studentId) {
        const uobEmailPattern = /^(\d{8,9})@stu\.uob\.edu\.bh$/;
        const match = email.match(uobEmailPattern);
        
        if (!match) {
            alert('Please use your UOB student email (format: studentID@stu.uob.edu.bh)\nWhere studentID is your 8-9 digit ID');
            return false;
        }
        
        if (match[1] !== studentId) {
            alert('The ID in your email does not match your Student ID');
            return false;
        }
        
        return true;
    }
});