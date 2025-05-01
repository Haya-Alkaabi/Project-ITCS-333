document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const MAX_VISIBLE_CHARS = 30;
    
    // DOM Elements
    const commentsContainer = document.getElementById('commentsContainer');
    const commentInput = document.getElementById('commentInput');
    const postButton = document.getElementById('postComment');
    
    // Track which comments have been liked to prevent multiple increments
    const likedComments = new Set();
    
    // Initialize existing comments
    initExistingComments();
    
    // Event Listeners
    postButton.addEventListener('click', addNewComment);
    commentInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewComment();
    });
    
    // Functions
    function initExistingComments() {
        // Initialize "Read more" functionality for existing comments
        const comments = commentsContainer.querySelectorAll('[id^="comment-"]');
        comments.forEach(comment => {
            const commentId = comment.id.split('-')[1];
            const textElement = document.getElementById(`comment-${commentId}-text`);
            const fullText = textElement.textContent;
            
            if (fullText.length > MAX_VISIBLE_CHARS) {
                textElement.dataset.fullText = fullText;
                textElement.textContent = truncateText(fullText, MAX_VISIBLE_CHARS);
                
                // Add event listener to "Read more" button
                const readMoreBtn = document.getElementById(`comment-${commentId}-read-more`);
                readMoreBtn.addEventListener('click', function() {
                    toggleReadMore(commentId);
                });
            } else {
                // Hide "Read more" button if not needed
                const readMoreBtn = document.getElementById(`comment-${commentId}-read-more`);
                readMoreBtn.style.visibility = 'hidden';
            }
            
            // Add event listener to "Like" button
            const likeBtn = document.getElementById(`comment-${commentId}-like`);
            likeBtn.addEventListener('click', function() {
                if (!likedComments.has(commentId)) {
                    likeComment(commentId);
                    likedComments.add(commentId);
                }
            });
            
            // Add event listener to "Reply" button
            const replyBtn = document.getElementById(`comment-${commentId}-reply`);
            replyBtn.addEventListener('click', function() {
                replyToComment(commentId);
            });
        });
    }
    
    function addNewComment() {
        const commentText = commentInput.value.trim();
        if (!commentText) return;
        
        // Create unique ID for new comment
        const commentId = Date.now();
        const now = new Date();
        const timeString = formatTimeAgo(now);
        const randomUserId = '2022' + Math.floor(Math.random() * 90000 + 10000).toString();
        
        // Create comment HTML
        const commentHTML = `
            <div class="mb-1 mt-4" id="comment-${commentId}">
                <div class="flex items-start mx-auto">
                    <img src="../Images/pfp.png" class="w-8 h-8 rounded-full object-cover mr-3 mt-1">
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h3 class="text-[0.87em] text-[black]" id="comment-${commentId}-user">${randomUserId}</h3>
                            <span class="text-xs text-[#bda887]" id="comment-${commentId}-time">${timeString}</span>
                        </div>
                        <p class="mt-0.59 text-[black] text-[0.8em]" id="comment-${commentId}-text">${truncateText(commentText, MAX_VISIBLE_CHARS)}</p>
                        <div class="flex justify-between items-center mt-2">
                            <div class="flex items-center">
                                <button class="flex items-center text-xs text-[#04437e] hover:text-[#C80000] mr-3" id="comment-${commentId}-like">
                                    <svg class="w-3.5 h-3.5 mr-1 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 21s-6-5.5-9-9c-2.5-3.5-1.5-7.5 2-9 2.5-1.5 5.5-.5 7 2 1.5-2.5 4.5-3.5 7-2 3.5 1.5 4.5 5.5 2 9-3 3.5-9 9-9 9z"></path>
                                    </svg>
                                    <span class="text-[#C80000]"><small id="comment-${commentId}-like-count">0</small></span>
                                </button>
                                <button class="text-xs text-[#bda887] hover:text-[#C80000]" id="comment-${commentId}-reply">
                                    Reply
                                </button>
                            </div>
                            ${commentText.length > MAX_VISIBLE_CHARS ? 
                                `<button class="text-xs text-[#bda887] hover:text-[#C80000]" id="comment-${commentId}-read-more">
                                    Read more
                                </button>` : 
                                `<button class="text-xs text-[#bda887] hover:text-[#C80000] opacity-0 cursor-default" id="comment-${commentId}-read-more" style="visibility: hidden;">
                                    Read more
                                </button>`}
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-t border-black my-2"></div>
        `;
        
        // Insert new comment before the input area
        const inputContainer = document.getElementById('commentsContainer');
        inputContainer.insertAdjacentHTML('beforeend', commentHTML);
        
        // Store full text if truncated
        if (commentText.length > MAX_VISIBLE_CHARS) {
            const textElement = document.getElementById(`comment-${commentId}-text`);
            textElement.dataset.fullText = commentText;
            
            // Add event listener to "Read more" button
            const readMoreBtn = document.getElementById(`comment-${commentId}-read-more`);
            readMoreBtn.addEventListener('click', function() {
                toggleReadMore(commentId);
            });
        }
        
        // Add event listener to "Like" button
        const likeBtn = document.getElementById(`comment-${commentId}-like`);
        likeBtn.addEventListener('click', function() {
            if (!likedComments.has(commentId)) {
                likeComment(commentId);
                likedComments.add(commentId);
            }
        });
        
        // Add event listener to "Reply" button
        const replyBtn = document.getElementById(`comment-${commentId}-reply`);
        replyBtn.addEventListener('click', function() {
            replyToComment(commentId);
        });
        
        // Clear input and scroll to new comment
        commentInput.value = '';
        commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }
    
    function toggleReadMore(commentId) {
        const textElement = document.getElementById(`comment-${commentId}-text`);
        const readMoreBtn = document.getElementById(`comment-${commentId}-read-more`);
        const fullText = textElement.dataset.fullText;
        
        if (readMoreBtn.textContent.trim() === 'Read more') {
            textElement.textContent = fullText;
            readMoreBtn.textContent = 'Read less';
            
            // Scroll to show the expanded comment
            setTimeout(() => {
                textElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 10);
        } else {
            textElement.textContent = truncateText(fullText, MAX_VISIBLE_CHARS);
            readMoreBtn.textContent = 'Read more';
        }
    }
    
    function likeComment(commentId) {
        const likeCountElement = document.getElementById(`comment-${commentId}-like-count`);
        const likeBtn = document.getElementById(`comment-${commentId}-like`);
        const heartIcon = likeBtn.querySelector('svg');
        
        let count = parseInt(likeCountElement.textContent);
        likeCountElement.textContent = count + 1; // Increment by 1 only
        
        // Change heart color to red
        heartIcon.classList.add('fill-current', 'text-[#C80000]');
        heartIcon.classList.remove('fill-none');
    }
    
    function replyToComment(commentId) {
        const username = document.getElementById(`comment-${commentId}-user`).textContent;
        commentInput.value = `@${username} `;
        commentInput.focus();
    }
    
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    function formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

});
    