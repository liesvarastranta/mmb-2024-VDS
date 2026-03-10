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

// Extract metadata from video and update card
async function loadVideoMetadata(card, videoElement) {
    return new Promise((resolve) => {
        videoElement.addEventListener('loadedmetadata', async () => {
            const videoSrc = card.getAttribute("data-video-src");
            const videoId = card.getAttribute("data-video-id");
            
            // Extract metadata
            const width = videoElement.videoWidth;
            const height = videoElement.videoHeight;
            const duration = videoElement.duration;
            
            // Store resolution in data attribute for later use
            card.setAttribute("data-resolution", height);
            
            // Try to extract title from MP4 metadata
            try {
                const metadataTitle = await extractVideoTitle(videoSrc);
                if (metadataTitle) {
                    // Update card title in UI
                    const titleElement = card.querySelector('h3');
                    if (titleElement) {
                        titleElement.textContent = metadataTitle;
                    }
                    // Update data attribute
                    card.setAttribute("data-title", metadataTitle);
                }
            } catch (e) {
                console.log('Could not extract metadata for', videoSrc);
            }
            
            resolve({
                id: videoId,
                src: videoSrc,
                width: width,
                height: height,
                duration: duration
            });
        }, { once: true });
    });
}

// Extract title from MP4 metadata
async function extractVideoTitle(videoSrc) {
    try {
        const response = await fetch(videoSrc, { method: 'GET' });
        const blob = await response.blob();
        const arrayBuffer = await blob.slice(0, 100000).arrayBuffer(); // Read first 100KB
        const uint8Array = new Uint8Array(arrayBuffer);
        const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
        
        // Look for title in MP4 metadata atoms
        const titleMatch = text.match(/©nam(.{4})(.+?)\0/);
        if (titleMatch && titleMatch[2]) {
            const metadataTitle = titleMatch[2].trim();
            if (metadataTitle && metadataTitle.length > 0 && metadataTitle.length < 200) {
                return metadataTitle;
            }
        }
    } catch (e) {
        console.log('Could not extract metadata title for', videoSrc, e);
    }
    return null;
}

// Load metadata for all videos
videoCards.forEach(card => {
    const videoElement = card.querySelector('video');
    loadVideoMetadata(card, videoElement);
});

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
        const resolution = card.getAttribute("data-resolution") || '720';
        
        // Store video data in URL parameters
        const params = new URLSearchParams({
            id: videoId,
            src: videoSrc,
            title: title,
            description: description,
            resolution: resolution
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