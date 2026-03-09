const videos = document.querySelectorAll("video");
const videoCards = document.querySelectorAll(".video-card");
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Check if there's a search query in URL
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');
if (searchQuery) {
    searchInput.value = searchQuery;
    filterVideos(searchQuery);
}

// Hover to preview video
videos.forEach(video => {
    video.addEventListener("mouseover", () => {
        video.play();
    });

    video.addEventListener("mouseout", () => {
        video.pause();
        video.currentTime = 0;
    });
});

// Click to open video player page
videoCards.forEach(card => {
    card.addEventListener("click", () => {
        const videoId = card.getAttribute("data-video-id");
        const videoSrc = card.getAttribute("data-video-src");
        const title = card.getAttribute("data-title");
        const description = card.getAttribute("data-description");
        
        // Store video data in URL parameters
        const params = new URLSearchParams({
            id: videoId,
            src: videoSrc,
            title: title,
            description: description
        });
        
        // Navigate to watch page
        window.location.href = `watch.html?${params.toString()}`;
    });
    
    // Add cursor pointer style
    card.style.cursor = "pointer";
});

// Search functionality
function filterVideos(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    videoCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const description = card.getAttribute('data-description').toLowerCase();
        
        if (title.includes(term) || description.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Real-time search as user types
searchInput.addEventListener('input', (e) => {
    filterVideos(e.target.value);
});

// Search button click
searchBtn.addEventListener('click', () => {
    filterVideos(searchInput.value);
});

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        filterVideos(searchInput.value);
    }
});