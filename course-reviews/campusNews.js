class CampusNews {
    constructor() {
        this.apiUrl = "https://680be6c92ea307e081d2a476.mockapi.io/Campus-News";
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 6;
        this.init();
    }
  
    async init() {
        this.showLoading(true);
        await this.loadData();
        this.setupEventListeners();
        this.renderNews();
        this.showLoading(false);
    }
  
    async loadData() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            this.articles = this.processArticles(data);
            this.filteredArticles = [...this.articles];
        } catch (error) {
            console.error("Error loading news:", error);
            this.showError('Failed to load news. Using sample data.');
            this.articles = this.getSampleData();
            this.filteredArticles = [...this.articles];
        }
    }
  
    processArticles(articles) {
        return articles.map(article => ({
            ...article,
            publishDate: new Date(article.publishDate).toISOString(),
            recommended: article.recommended || false
        }));
    }
  
    getSampleData() {
        return [
            {
                id: 1,
                title: "UOB Shines in Sixth Arab Youth Leaders Training Program",
                summary: "UOB Excellent Participation in Sixth Training Program for Preparing Arab Youth Leaders.",
                image: "../photos/Training Program .png",
                category: "achievements",
                author: "University of Bahrain",
                publishDate: new Date("2025-03-16").toISOString(),
                recommended: true
            },
        ];
    }
  
    renderNews() {
        const recContainer = document.getElementById('recommended-news-container');
        const regContainer = document.getElementById('regular-news-container');
        const paginationContainer = document.getElementById('pagination-container');
  
        // Clear existing content
        recContainer.innerHTML = '';
        regContainer.innerHTML = '';
        if (paginationContainer) paginationContainer.innerHTML = '';
  
        // Separate articles
        const recommended = this.filteredArticles.filter(a => a.recommended);
        const regular = this.filteredArticles.filter(a => !a.recommended);
  
        // Render recommended
        if (recommended.length > 0) {
            recommended.forEach(article => {
                recContainer.appendChild(this.createArticleCard(article, true));
            });
        } else {
            recContainer.innerHTML = '<p class="text-center py-8 text-brown">No featured news</p>';
        }
  
        // Render regular with pagination
        const paginated = this.paginateArticles(regular);
        if (paginated.length > 0) {
            paginated.forEach(article => {
                regContainer.appendChild(this.createArticleCard(article, false));
            });
            this.renderPagination(regular.length, paginationContainer);
        } else {
            regContainer.innerHTML = '<p class="text-center py-8 text-brown">No articles found</p>';
        }
    }
  
    createArticleCard(article, isRecommended) {
      const card = document.createElement('article');
      const date = new Date(article.publishDate);
      const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: isRecommended ? 'long' : 'short',
          day: 'numeric'
      });
  
      if (isRecommended) {
          // Recommended article style (matches your HTML example)
          card.className = 'recommended-news flex flex-col bg-white p-4 rounded-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-all h-full';
          card.innerHTML = `
              <img src="${article.image}" alt="${article.title}" 
                   class="w-full h-40 object-cover rounded mb-3 hover:scale-102 transition-transform"
                   onerror="this.onerror=null;this.src='../photos/uob.png'">
              <h3 class="text-red font-bold mb-2 hover:text-gold transition-colors">${article.title}</h3>
              <p class="mb-4 flex-grow">${article.summary}</p>
              <div class="text-brown text-sm mb-4">
                  <p><i class="fas fa-calendar-day mr-1"></i>${formattedDate}</p>
                  <p><i class="fas fa-user mr-1"></i>${article.author}</p>
                  ${article.category ? `<span class="inline-block mt-1 px-2 py-1 bg-gold/10 text-gold rounded-full text-xs">${article.category}</span>` : ''}
              </div>
              <a href="${article.fullArticleLink || '#'}" 
                 class="mt-auto block px-4 py-2 bg-red text-white text-center rounded hover:bg-gold transition-colors">
                  Read more
              </a>
          `;
      } else {
          // Regular article style (matches your HTML example)
          card.className = 'flex flex-col md:flex-row items-center bg-white rounded-lg p-4 shadow hover:translate-x-1 hover:shadow-md transition-all';
          card.innerHTML = `
              <div class="flex-1 min-w-0">
                  <h3 class="text-navy font-bold mb-2 truncate">${article.title}</h3>
                  <div class="flex gap-4 text-gold text-sm mb-2">
                      <time datetime="${date.toISOString()}">${formattedDate}</time>
                      <span class="author">By: ${article.author}</span>
                  </div>
                  <p class="text-gray-600">${article.summary}</p>
                  ${article.category ? `<span class="inline-block mt-1 px-2 py-1 bg-gold/10 text-gold rounded-full text-xs">${article.category}</span>` : ''}
              </div>
              <div class="flex items-center gap-4 mt-4 md:mt-0">
                  <img src="${article.image}" alt="${article.title}" 
                       class="w-32 h-20 object-cover rounded"
                       onerror="this.onerror=null;this.src='../photos/uob.png'">
                  <a href="${article.fullArticleLink || '#'}" 
                     class="px-4 py-2 bg-gold text-white rounded hover:bg-red transition-colors whitespace-nowrap">
                      Read
                  </a>
              </div>
          `;
      }
      
      return card;
  }
    paginateArticles(articles) {
        const start = (this.currentPage - 1) * this.articlesPerPage;
        return articles.slice(start, start + this.articlesPerPage);
    }
  
    renderPagination(totalItems, container) {
        const totalPages = Math.ceil(totalItems / this.articlesPerPage);
        if (totalPages <= 1) return;
  
        container.innerHTML = '';
        container.className = 'flex gap-2 justify-center my-10';
  
        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'px-4 py-2 bg-beige text-navy rounded hover:bg-gold disabled:opacity-50';
        prevBtn.innerHTML = '&laquo; Prev';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderNews();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        container.appendChild(prevBtn);
  
        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `px-4 py-2 ${this.currentPage === i ? 'bg-red text-white' : 'bg-beige text-navy hover:bg-gold'} rounded`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                this.currentPage = i;
                this.renderNews();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            container.appendChild(btn);
        }
  
        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'px-4 py-2 bg-beige text-navy rounded hover:bg-gold disabled:opacity-50';
        nextBtn.innerHTML = 'Next &raquo;';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderNews();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        container.appendChild(nextBtn);
    }
  
    setupEventListeners() {
        // Search
        document.getElementById('search-button').addEventListener('click', () => this.handleSearch());
        document.getElementById('search-bar').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
  
        // Filter and sort
        document.getElementById('filter-category').addEventListener('change', () => this.handleFilter());
        document.getElementById('sort-news').addEventListener('change', () => this.handleSort());
    }
  
    handleSearch() {
        const term = document.getElementById('search-bar').value.toLowerCase();
        this.filteredArticles = this.articles.filter(a => 
            a.title.toLowerCase().includes(term) || 
            a.summary.toLowerCase().includes(term)
        );
        this.currentPage = 1;
        this.renderNews();
        this.showNoResults(this.filteredArticles.length === 0);
    }
  
    handleFilter() {
        const category = document.getElementById('filter-category').value;
        this.filteredArticles = category === 'all' 
            ? [...this.articles] 
            : this.articles.filter(a => a.category === category);
        this.currentPage = 1;
        this.renderNews();
        this.showNoResults(this.filteredArticles.length === 0);
    }
  
    handleSort() {
        const order = document.getElementById('sort-news').value;
        this.filteredArticles.sort((a, b) => {
            const dateA = new Date(a.publishDate);
            const dateB = new Date(b.publishDate);
            return order === 'latest' ? dateB - dateA : dateA - dateB;
        });
        this.renderNews();
    }
  
    showLoading(show) {
        const loader = document.getElementById('loading-indicator');
        if (loader) loader.classList.toggle('hidden', !show);
    }
  
    showError(message) {
        const container = document.getElementById('error-message');
        if (!container) return;
  
        container.innerHTML = `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p><strong>Error:</strong> ${message}</p>
            </div>
        `;
    }
  
    showNoResults(show) {
        const noResults = document.getElementById('no-results');
        if (noResults) noResults.classList.toggle('hidden', !show);
    }
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.campusNews = new CampusNews();
  });
  
  // leave a comment validation form 
  document.addEventListener('DOMContentLoaded', function () {
      const form = document.getElementById('comment-form');
      const nameInput = document.getElementById('comment-name');
      const emailInput = document.getElementById('comment-email');
      const commentInput = document.getElementById('comment-text');
  
      form.addEventListener('submit', function (e) {
          let isValid = true;
          let messages = [];
  
          // Check Name
          if (nameInput.value.trim() === '') {
              isValid = false;
              messages.push('Name is required.');
          }
  
          // Check Email
          if (emailInput.value.trim() === '') {
              isValid = false;
              messages.push('Email is required.');
          } else if (!validateEmail(emailInput.value.trim())) {
              isValid = false;
              messages.push('Please enter a valid email address.');
          }
  
          // Check Comment
          if (commentInput.value.trim() === '') {
              isValid = false;
              messages.push('Comment cannot be empty.');
          }
  
          if (!isValid) {
              e.preventDefault(); // Prevent form from submitting
              alert(messages.join('\n')); // Show all error messages
          }
      });
  
      // Simple email pattern checker
      function validateEmail(email) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(email);
      }
  });
  
  // CommentForm.js
  
  document.addEventListener('DOMContentLoaded', function () {
      const commentForm = document.getElementById('comment-form');
  
      if (commentForm) {
          commentForm.addEventListener('submit', async function (event) {
              event.preventDefault();
  
              if (!validateForm()) {
                  showNotification('Please fix all errors before submitting your comment.', 'error');
                  return;
              }
  
              // Show loading state
              const submitBtn = commentForm.querySelector('button[type="submit"]');
              const originalBtnText = submitBtn.innerHTML;
              submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Posting...';
              submitBtn.disabled = true;
  
              try {
                  // Simulate API call (for now)
                  await new Promise(resolve => setTimeout(resolve, 1500));
  
                  // Show success message
                  showNotification('Comment posted successfully!', 'success');
  
                  // Clear form
                  commentForm.reset();
  
                  // Optional: Redirect or refresh
                  // location.reload();
  
              } catch (error) {
                  console.error('Submission error:', error);
                  showNotification('Failed to post comment.', 'error');
              } finally {
                  submitBtn.innerHTML = originalBtnText;
                  submitBtn.disabled = false;
              }
          });
  
          // Real-time validation
          document.getElementById('comment-name').addEventListener('input', validateName);
          document.getElementById('comment-email').addEventListener('input', validateEmailField);
          document.getElementById('comment-text').addEventListener('input', validateComment);
      }
  });
  
  // Notification system (like your Campus News code)
  function showNotification(message, type) {
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
  
      setTimeout(() => {
          notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
          setTimeout(() => notification.remove(), 300);
      }, 5000);
  }
  
  // Main form validation
  function validateForm() {
      const isNameValid = validateName();
      const isEmailValid = validateEmailField();
      const isCommentValid = validateComment();
  
      return isNameValid && isEmailValid && isCommentValid;
  }
  
  // Individual Field Validation
  function validateName() {
      const nameInput = document.getElementById('comment-name');
      const value = nameInput.value.trim();
  
      let errorElement = nameInput.nextElementSibling;
      if (!errorElement || !errorElement.classList.contains('error-message')) {
          errorElement = document.createElement('p');
          errorElement.className = 'error-message text-red-500 text-sm mt-1';
          nameInput.parentNode.insertBefore(errorElement, nameInput.nextSibling);
      }
  
      if (value === '') {
          errorElement.textContent = 'Name is required';
          nameInput.classList.add('border-red-500');
          nameInput.classList.remove('border-brown');
          return false;
      }
  
      errorElement.textContent = '';
      nameInput.classList.remove('border-red-500');
      nameInput.classList.add('border-brown');
      return true;
  }
  
  function validateEmailField() {
      const emailInput = document.getElementById('comment-email');
      const value = emailInput.value.trim();
  
      let errorElement = emailInput.nextElementSibling;
      if (!errorElement || !errorElement.classList.contains('error-message')) {
          errorElement = document.createElement('p');
          errorElement.className = 'error-message text-red-500 text-sm mt-1';
          emailInput.parentNode.insertBefore(errorElement, emailInput.nextSibling);
      }
  
      if (value === '') {
          errorElement.textContent = 'Email is required';
          emailInput.classList.add('border-red-500');
          emailInput.classList.remove('border-brown');
          return false;
      }
  
      if (!validateEmailFormat(value)) {
          errorElement.textContent = 'Please enter a valid email address';
          emailInput.classList.add('border-red-500');
          emailInput.classList.remove('border-brown');
          return false;
      }
  
      errorElement.textContent = '';
      emailInput.classList.remove('border-red-500');
      emailInput.classList.add('border-brown');
      return true;
  }
  
  
  //leave a comment validation form
  function validateComment() {
      const commentInput = document.getElementById('comment-text');
      const value = commentInput.value.trim();
  
      let errorElement = commentInput.nextElementSibling;
      if (!errorElement || !errorElement.classList.contains('error-message')) {
          errorElement = document.createElement('p');
          errorElement.className = 'error-message text-red-500 text-sm mt-1';
          commentInput.parentNode.insertBefore(errorElement, commentInput.nextSibling);
      }
  
      if (value === '') {
          errorElement.textContent = 'Comment cannot be empty';
          commentInput.classList.add('border-red-500');
          commentInput.classList.remove('border-brown');
          return false;
      }
  
      errorElement.textContent = '';
      commentInput.classList.remove('border-red-500');
      commentInput.classList.add('border-brown');
      return true;
  }
  
  // Email format validator
  function validateEmailFormat(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }