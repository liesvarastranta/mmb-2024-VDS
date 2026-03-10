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

// All available videos database - will be populated dynamically
const allVideos = [];

// Extract title from MP4 metadata
async function extractVideoTitle(videoSrc) {
    try {
        const response = await fetch(videoSrc);
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

// Dynamically load video metadata
async function loadAllVideosMetadata() {
    const videoFiles = [
        { id: "1", src: "videos/vid1.mp4", title: "Video 1", description: "Podcast teknologi." },
        { id: "2", src: "videos/vid2.mp4", title: "Video 2", description: "Campus news." },
        { id: "3", src: "videos/vid3.mp4", title: "Video 3", description: "Educational content." },
        { id: "4", src: "videos/vid4.mp4", title: "Video 4", description: "Entertainment series." },
        { id: "5", src: "videos/vid5.mp4", title: "Video 5", description: "Music and performance." },
        { id: "6", src: "videos/vid6.mp4", title: "Video 6", description: "Documentary feature." },
        { id: "7", src: "videos/vid7.mp4", title: "Video 7", description: "Sports highlights." },
        { id: "8", src: "videos/vid8.mp4", title: "Video 8", description: "Tutorial and how-to." }
    ];
    
    // Extract metadata from each video
    for (const videoInfo of videoFiles) {
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        
        const metadataPromise = new Promise((resolve) => {
            tempVideo.addEventListener('loadedmetadata', async () => {
                videoInfo.width = tempVideo.videoWidth;
                videoInfo.height = tempVideo.videoHeight;
                videoInfo.duration = tempVideo.duration;
                
                // Try to extract title from metadata
                const metadataTitle = await extractVideoTitle(videoInfo.src);
                if (metadataTitle) {
                    videoInfo.title = metadataTitle;
                }
                
                resolve(videoInfo);
            }, { once: true });
        });
        
        tempVideo.src = videoInfo.src;
        allVideos.push(await metadataPromise);
    }
    
    // After all videos loaded, populate recommendations
    populateRecommendations();
}

// Populate recommendation videos
function populateRecommendations() {
    const recommendedContainer = document.getElementById('recommended-videos');
    if (!recommendedContainer) return;
    
    const recommendations = allVideos.filter(video => video.id !== currentVideoId);
    
    recommendations.forEach(video => {
        const recCard = document.createElement('div');
        recCard.className = 'recommendation-card';
        recCard.innerHTML = `
            <video muted preload="metadata">
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
                description: video.description,
                resolution: video.height || '720'
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
}

// Initialize metadata loading
loadAllVideosMetadata();

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const currentVideoId = urlParams.get('id');
const videoSrc = urlParams.get('src');
const videoTitle = urlParams.get('title');
const videoDescription = urlParams.get('description');
const videoResolution = urlParams.get('resolution');

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
let detectedResolution = 720; // Default fallback

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
    
    // Detect actual video resolution dynamically
    const height = mainVideo.videoHeight;
    if (height >= 1080) {
        detectedResolution = 1080;
    } else if (height >= 720) {
        detectedResolution = 720;
    } else if (height >= 480) {
        detectedResolution = 480;
    } else {
        detectedResolution = 360;
    }
    
    // Set initial quality to detected resolution
    setInitialQuality(detectedResolution);
    
    // Update quality comparison chart
    updateQualityComparison(detectedResolution);
});

function setInitialQuality(resolution) {
    // Remove all active classes
    qualityButtons.forEach(b => b.classList.remove('active'));
    
    // Find and activate the button matching detected resolution
    const targetBtn = document.querySelector(`.quality-btn[data-quality="${resolution}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
        currentQualityEl.textContent = resolution + 'p';
        currentQuality = resolution.toString();
        updatePerformanceStats(videoSrc, resolution.toString());
    }
}

if (videoSrc && videoTitle) {
    videoSource.src = videoSrc;
    // Set initial title (will be updated from metadata if available)
    titleElement.textContent = videoTitle;
    descriptionElement.textContent = videoDescription || '';
    mainVideo.load();
    
    // Initialize performance monitoring
    // Will be updated after metadata loads
    const initialQuality = videoResolution || '720';
    updatePerformanceStats(videoSrc, initialQuality);
    
    // Extract metadata title and update if available
    extractVideoTitle(videoSrc).then(metadataTitle => {
        if (metadataTitle) {
            titleElement.textContent = metadataTitle;
        }
    });
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

// Update quality comparison based on detected resolution
function updateQualityComparison(baseResolution) {
    const comparisonGrid = document.querySelector('.comparison-grid');
    if (comparisonGrid) {
        const qualityData = {
            360: { size: '~5-10 MB', bitrate: '~0.5-1 Mbps' },
            480: { size: '~15-25 MB', bitrate: '~1.5-2.5 Mbps' },
            720: { size: '~40-60 MB', bitrate: '~4-6 Mbps' },
            1080: { size: '~100-150 MB', bitrate: '~8-12 Mbps' }
        };
        
        let html = '';
        for (const [res, data] of Object.entries(qualityData)) {
            const isCurrent = parseInt(res) === baseResolution;
            const marker = isCurrent ? ' ⬅️ Base' : '';
            html += `<div class="comp-item${isCurrent ? ' current-base' : ''}">${res}p: ${data.size}${marker}</div>`;
        }
        comparisonGrid.innerHTML = html;
    }
}
