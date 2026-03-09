// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Navigate to home page with search parameter
        window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// All available videos database
const allVideos = [
    {
        id: "1",
        src: "videos/vid1.mp4",
        title: "Video 1",
        description: "Podcast teknologi."
    },
    {
        id: "2",
        src: "videos/vid2.mp4",
        title: "Video 2",
        description: "Campus news."
    },
    {
        id: "3",
        src: "videos/vid3.mp4",
        title: "Video 3",
        description: "Educational content."
    },
    {
        id: "4",
        src: "videos/vid4.mp4",
        title: "Video 4",
        description: "Entertainment series."
    },
    {
        id: "5",
        src: "videos/vid5.mp4",
        title: "Video 5",
        description: "Music and performance."
    },
    {
        id: "6",
        src: "videos/vid6.mp4",
        title: "Video 6",
        description: "Documentary feature."
    },
    {
        id: "7",
        src: "videos/vid7.mp4",
        title: "Video 7",
        description: "Sports highlights."
    },
    {
        id: "8",
        src: "videos/vid8.mp4",
        title: "Video 8",
        description: "Tutorial and how-to."
    }
];

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const currentVideoId = urlParams.get('id');
const videoSrc = urlParams.get('src');
const videoTitle = urlParams.get('title');
const videoDescription = urlParams.get('description');

// Load main video
const mainVideo = document.getElementById('main-video');
const videoSource = document.getElementById('video-source');
const titleElement = document.getElementById('video-title');
const descriptionElement = document.getElementById('video-description');

// Performance monitor elements
const currentQualityEl = document.getElementById('current-quality');
const fileNameEl = document.getElementById('file-name');
const fileSizeEl = document.getElementById('file-size');
const bandwidthEl = document.getElementById('bandwidth');
const resolutionEl = document.getElementById('resolution');
const qualityStatusEl = document.getElementById('quality-status');

let loadStartTime = 0;
let bytesLoaded = 0;

// Monitor video loading
function updatePerformanceStats(videoUrl, quality) {
    currentQualityEl.textContent = quality + 'p';
    fileNameEl.textContent = videoUrl.split('/').pop();
    
    // Fetch file size
    fetch(videoUrl, { method: 'HEAD' })
        .then(response => {
            const fileSize = parseInt(response.headers.get('content-length'));
            if (fileSize) {
                const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
                fileSizeEl.textContent = fileSizeMB + ' MB';
                
                // Estimate bandwidth based on file size and quality
                const estimatedBitrate = calculateBitrate(fileSize, quality);
                bandwidthEl.textContent = estimatedBitrate;
            } else {
                fileSizeEl.textContent = 'Unknown';
                bandwidthEl.textContent = 'Unknown';
            }
        })
        .catch(() => {
            fileSizeEl.textContent = 'Error loading';
            bandwidthEl.textContent = 'N/A';
        });
}

function calculateBitrate(fileSize, quality) {
    // Estimate bitrate in Mbps
    const fileSizeMB = fileSize / (1024 * 1024);
    const estimatedDuration = 60; // Assume 1 minute video for estimation
    const bitrateMbps = ((fileSize * 8) / (estimatedDuration * 1000000)).toFixed(2);
    return bitrateMbps + ' Mbps';
}

// Update resolution when video metadata loads
mainVideo.addEventListener('loadedmetadata', () => {
    resolutionEl.textContent = `${mainVideo.videoWidth} x ${mainVideo.videoHeight}`;
});

if (videoSrc && videoTitle) {
    videoSource.src = videoSrc;
    titleElement.textContent = videoTitle;
    descriptionElement.textContent = videoDescription || '';
    mainVideo.load();
    
    // Initialize performance monitoring
    updatePerformanceStats(videoSrc, '720');
} else {
    titleElement.textContent = 'Video not found';
    descriptionElement.textContent = 'Please return to the home page';
}

// Quality selector functionality
const qualityButtons = document.querySelectorAll('.quality-btn');
let currentQuality = '720';

qualityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const quality = btn.getAttribute('data-quality');
        
        // Save current playback position and state
        const currentTime = mainVideo.currentTime;
        const wasPlaying = !mainVideo.paused;
        
        // Update active button
        qualityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update quality indicator
        currentQualityEl.textContent = quality + 'p';
        
        // Try to find quality-specific video file
        const baseVideoPath = videoSrc.replace('.mp4', '');
        const qualityVideoPath = `${baseVideoPath}_${quality}p.mp4`;
        
        // Test if quality-specific file exists
        fetch(qualityVideoPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // Quality-specific file exists
                    videoSource.src = qualityVideoPath;
                    qualityStatusEl.textContent = 'Multi-quality enabled ✓';
                    qualityStatusEl.className = 'value status-success';
                    updatePerformanceStats(qualityVideoPath, quality);
                } else {
                    // Fallback to original
                    videoSource.src = videoSrc;
                    qualityStatusEl.textContent = `Using fallback (${quality}p file not found)`;
                    qualityStatusEl.className = 'value status-warning';
                    updatePerformanceStats(videoSrc, quality);
                }
                mainVideo.load();
                mainVideo.currentTime = currentTime;
                if (wasPlaying) {
                    mainVideo.play();
                }
            })
            .catch(() => {
                // Error or file doesn't exist - use fallback
                videoSource.src = videoSrc;
                qualityStatusEl.textContent = `Fallback mode (original file)`;
                qualityStatusEl.className = 'value status-warning';
                updatePerformanceStats(videoSrc, quality);
                mainVideo.load();
                mainVideo.currentTime = currentTime;
                if (wasPlaying) {
                    mainVideo.play();
                }
            });
        
        currentQuality = quality;
    });
});

// Load recommended videos (all videos except current one)
const recommendedContainer = document.getElementById('recommended-videos');
const recommendations = allVideos.filter(video => video.id !== currentVideoId);

recommendations.forEach(video => {
    const recCard = document.createElement('div');
    recCard.className = 'recommendation-card';
    recCard.innerHTML = `
        <video muted>
            <source src="${video.src}" type="video/mp4">
        </video>
        <div class="rec-info">
            <h4>${video.title}</h4>
            <p>${video.description}</p>
        </div>
    `;
    
    // Add click handler to load new video
    recCard.addEventListener('click', () => {
        const params = new URLSearchParams({
            id: video.id,
            src: video.src,
            title: video.title,
            description: video.description
        });
        window.location.href = `watch.html?${params.toString()}`;
    });
    
    // Hover to preview
    const recVideo = recCard.querySelector('video');
    recCard.addEventListener('mouseenter', () => {
        recVideo.play();
    });
    
    recCard.addEventListener('mouseleave', () => {
        recVideo.pause();
        recVideo.currentTime = 0;
    });
    
    recCard.style.cursor = 'pointer';
    recommendedContainer.appendChild(recCard);
});
