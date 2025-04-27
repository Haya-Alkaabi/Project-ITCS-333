//form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Validate personal data
        if (!validatePersonalData()) {
            return;
        }
        
        // Validate item details
        if (!validateItemDetails()) {
            return;
        }
        
        // If all validations pass, submit the form
        alert('Form submitted successfully!');
        // form.submit(); // Uncomment this to actually submit the form
    });
    
    function validatePersonalData() {
        // Get form elements with null checks
        const fullNameEl = document.getElementById('fullName');
        const idEl = document.getElementById('studentId');
        const emailEl = document.getElementById('studentEmail');
        const mobileEl = document.getElementById('mobileNumber');
        const collegeEl = document.getElementById('college');
        const majorEl = document.getElementById('major');

        // Verify elements exist before accessing values
        if (!fullNameEl || !idEl || !emailEl || !mobileEl || !collegeEl || !majorEl) {
        console.error('One or more form elements not found');
            return false;
        }

        // Get trimmed values
        const fullName = fullNameEl.value.trim();
        const id = idEl.value.trim();
        const email = emailEl.value.trim();
        const mobile = mobileEl.value.trim();
        const college = collegeEl.value;
        const major = majorEl.value.trim();
        
        // Validate Full Name
        if (fullName === '') {
            alert('Please enter your full name');
            return false;
        }
        
        // Validate ID
        if (id === '') {
            alert('Please enter your ID');
            return false;
        }
        if (!/^\d{8,9}$/.test(id)) {
            alert('Student ID must be exactly 8 or 9 digits');
            return false;
        }
        
        // Validate Email
        if (email === '') {
            alert('Please enter your email');
            return false;
        }
        if (!validateEmail(email,id)) {
            return false;
        }
        
        // Validate Mobile Number
        if (mobile === '') {
            alert('Please enter your mobile number');
            return false;
        }
        if (isNaN(mobile)) {
            alert('Mobile number must be a number');
            return false;
        }
        
        // Validate College
        if (college === null || college === 'Select College') {
            alert('Please select your college');
            return false;
        }
        
        // Validate Major
        if (major === '') {
            alert('Please enter your major');
            return false;
        }
        
        return true;
    }
    
    function validateItemDetails() {
        const itemName = document.getElementById('itemName').value.trim();
        const type = document.getElementById('itemType').value.trim();
        const brief = document.getElementById('itemBrief').value.trim();
        const price = document.getElementById('itemPrice').value.trim();
        const quantity = document.getElementById('itemQuantity').value.trim();
        const itemImage = document.getElementById('itemImage');
        
        // Validate Item Name
        if (itemName === '') {
            alert('Please enter the item name');
            return false;
        }
        
        // Validate Type
        if (type === '') {
            alert('Please enter the item type');
            return false;
        }
        
        // Validate Brief
        if (brief === '') {
            alert('Please enter a brief description');
            return false;
        }
        
        // Validate Price
        if (price === '') {
            alert('Please enter the price');
            return false;
        }
        if (isNaN(price)) {
            alert('Price must be a number');
            return false;
        }
        if (parseFloat(price) <= 0) {
            alert('Price must be greater than 0');
            return false;
        }
        
        // Validate Quantity
        if (quantity === '') {
            alert('Please enter the available quantity');
            return false;
        }
        if (isNaN(quantity)) {
            alert('Quantity must be a number');
            return false;
        }
        if (parseInt(quantity) <= 0) {
            alert('Quantity must be greater than 0');
            return false;
        }
        // Validate image upload
        if (!itemImage.files || itemImage.files.length === 0) {
            alert('Please upload an image of the item');
            return false;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(itemImage.files[0].type)) {
            alert('Only JPG, PNG, and GIF images are allowed');
            return false;
        }
    
        // Check file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (itemImage.files[0].size > maxSize) {
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
    
        // 2. Extract ID from email and compare with entered ID
        const emailId = match[1]; // The captured group from the regex
    
        if (emailId !== studentId) {
            alert('The ID in your email (' + emailId + ') does not match the Student ID you entered (' + studentId + ')');
            return false;
        }
    
        return true;
    }
});