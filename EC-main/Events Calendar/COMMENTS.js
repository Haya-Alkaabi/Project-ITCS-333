document.addEventListener('DOMContentLoaded', function() {

    //For comments, I did not have time to add crud operations for them but I already worked on two other things like the middle section calrndar and the schedule 
    //I could not add a search functionality, but i added authentication, basic one.
    const MAX_VISIBLE_CHARS = 30;
    const commentsContainer = document.getElementById('commentsContainer');
    const commentInput = document.getElementById('commentInput');
    const postButton = document.getElementById('postComment');
    
    // Load existing comments from server
    loadComments();
    
    postButton.addEventListener('click', addNewComment);
    commentInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewComment();
    });
    
    async function loadComments() {
        try {
            const response = await fetch('includes/comments.php?action=get_comments');
            const data = await response.json();
            
            if (data.success && data.comments) {
                renderComments(data.comments);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }
    
    function renderComments(comments) {
        commentsContainer.innerHTML = '';
        
        comments.forEach(comment => {
            const isLongComment = comment.content.length > MAX_VISIBLE_CHARS;
            const displayText = isLongComment 
                ? comment.content.substring(0, MAX_VISIBLE_CHARS) + '...' 
                : comment.content;
            
            const commentHTML = `
                <div class="mb-1 mt-4" id="comment-${comment.id}">
                    <div class="flex items-start mx-auto">
                        <img src="../Images/pfp.png" class="w-8 h-8 rounded-full object-cover mr-3 mt-1">
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="text-[0.87em] text-[black]">${comment.username}</h3>
                                <span class="text-xs text-[#bda887]">${formatTimeAgo(comment.created_at)}</span>
                            </div>
                            <p class="mt-0.59 text-[black] text-[0.8em]" id="comment-text-${comment.id}">
                                ${displayText}
                            </p>
                            <div class="flex justify-between items-center mt-2">
                                <div class="flex items-center">
                                    <button class="flex items-center text-xs text-[#04437e] hover:text-[#C80000] mr-3 like-btn" data-comment-id="${comment.id}">
                                        <svg class="w-3.5 h-3.5 mr-1 ${comment.liked ? 'fill-current text-[#C80000]' : 'fill-none'} stroke-current stroke-2" viewBox="0 0 24 24">
                                            <path d="M12 21s-6-5.5-9-9c-2.5-3.5-1.5-7.5 2-9 2.5-1.5 5.5-.5 7 2 1.5-2.5 4.5-3.5 7-2 3.5 1.5 4.5 5.5 2 9-3 3.5-9 9-9 9z"></path>
                                        </svg>
                                        <span class="text-[#C80000]"><small class="like-count">${comment.like_count}</small></span>
                                    </button>
                                    <button class="text-xs text-[#bda887] hover:text-[#C80000] reply-btn" data-comment-id="${comment.id}">
                                        Reply
                                    </button>
                                </div>
                                ${isLongComment ? 
                                    `<button class="text-xs text-[#bda887] hover:text-[#C80000] read-more-btn" data-comment-id="${comment.id}" data-expanded="false">
                                        Read more
                                    </button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-black my-2"></div>
            `;
            
            commentsContainer.insertAdjacentHTML('beforeend', commentHTML);
            
            // Add event listeners
            const readMoreBtn = commentsContainer.querySelector(`.read-more-btn[data-comment-id="${comment.id}"]`);
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', () => toggleReadMore(comment.id, comment.content));
            }
            
            const likeBtn = commentsContainer.querySelector(`.like-btn[data-comment-id="${comment.id}"]`);
            likeBtn.addEventListener('click', () => likeComment(comment.id));
            
            const replyBtn = commentsContainer.querySelector(`.reply-btn[data-comment-id="${comment.id}"]`);
            replyBtn.addEventListener('click', () => replyToComment(comment.id, comment.username));
        });
    }
    
    async function addNewComment() {
        const commentText = commentInput.value.trim();
        if (!commentText) return;
        
        try {
            const response = await fetch('includes/comments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'add_comment',
                    content: commentText,
                    username: 'Anonymous'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                commentInput.value = '';
                loadComments(); // Refresh comments from server
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }
    
    async function likeComment(commentId) {
        try {
            const response = await fetch('includes/comments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'like_comment',
                    comment_id: commentId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update UI
                const likeBtn = document.querySelector(`.like-btn[data-comment-id="${commentId}"]`);
                const likeCount = likeBtn.querySelector('.like-count');
                const heartIcon = likeBtn.querySelector('svg');
                
                likeCount.textContent = data.new_count || (parseInt(likeCount.textContent) + 1);
                heartIcon.classList.add('fill-current', 'text-[#C80000]');
                heartIcon.classList.remove('fill-none');
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    }
    
    function toggleReadMore(commentId, fullText) {
        const textElement = document.getElementById(`comment-text-${commentId}`);
        const readMoreBtn = document.querySelector(`.read-more-btn[data-comment-id="${commentId}"]`);
        const isExpanded = readMoreBtn.dataset.expanded === 'true';
        
        if (isExpanded) {
            textElement.textContent = fullText.substring(0, MAX_VISIBLE_CHARS) + '...';
            readMoreBtn.textContent = 'Read more';
            readMoreBtn.dataset.expanded = 'false';
        } else {
            textElement.textContent = fullText;
            readMoreBtn.textContent = 'Read less';
            readMoreBtn.dataset.expanded = 'true';
        }
    }
    
    function replyToComment(commentId, username) {
        commentInput.value = `@${username} `;
        commentInput.focus();
    }
    
    function formatTimeAgo(timestamp) {
        const now = new Date();
        const commentDate = new Date(timestamp);
        const diff = now - commentDate;
        
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