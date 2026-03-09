# MMB Video Platform - Mini Video Distribution System

## 📚 Course Practicum: Building a YouTube-like Video Platform

Welcome to the MMB Video Platform practicum! In this course, you will learn how to build a mini video distribution system similar to YouTube.

---

## 🎯 What You'll Build

A fully functional video platform with:
- **Home Page**: Grid display of all available videos
- **Video Player Page**: Watch videos with recommendations
- **Search Feature**: Find videos by title or description
- **Quality Selector**: Switch between different video qualities (360p, 480p, 720p, 1080p)
- **Performance Monitor**: See real-time stats about video file size and bandwidth
- **Hover Preview**: Videos play automatically when you hover over them

---

## 📋 What You Need

1. A computer (Windows, Mac, or Linux)
2. A web browser (Chrome, Firefox, or Edge)
3. **VS Code** (Visual Studio Code) - Download from https://code.visualstudio.com/
4. **Live Server Extension** for VS Code (installation instructions below)
5. Video files (MP4 format) - at least 2-8 videos

---

## 🚀 How to Get Started

### Step 1: Install VS Code and Live Server

1. **Download and Install VS Code**:
   - Go to https://code.visualstudio.com/
   - Download the version for your operating system
   - Install VS Code on your computer

2. **Install Live Server Extension**:
   - Open VS Code
   - Click on the Extensions icon on the left sidebar (or press `Ctrl+Shift+X`)
   - In the search box, type: **Live Server**
   - Find "Live Server" by Ritwick Dey
   - Click the **Install** button
   - Wait for installation to complete

### Step 2: Download the Files

1. Download all the files from this repository
2. Create a new folder on your computer (example: `MyVideoProject`)
3. Copy all these files into your folder:
   - `index.html`
   - `watch.html`
   - `script.js`
   - `watch.js`
   - `style.css`

### Step 2: Add Your Videos

1. Inside your project folder, create a folder called `videos`
2. Add your video files (MP4 format) into the `videos` folder
3. Name them: `vid1.mp4`, `vid2.mp4`, `vid3.mp4`, etc.

Your folder structure should look like this:
```
MyVideoProject/
├── index.html
├── watch.html
├── script.js
├── watch.js
├── style.css
└── videos/
    ├── vid1.mp4
    ├── vid2.mp4
    ├── vid3.mp4
    └── ...
```

### Step 3: Open the Project in VS Code

1. Open VS Code
2. Click **File** → **Open Folder**
3. Select your `MyVideoProject` folder
4. You should now see all your files in the VS Code sidebar

### Step 4: Run with Live Server

1. In VS Code, right-click on `index.html` in the file explorer
2. Select **"Open with Live Server"** from the menu
3. Your default browser will automatically open with the website
4. The website will now run at: `http://127.0.0.1:5500/index.html`

**Important**: Always use Live Server to run your project. Don't just double-click the HTML file, as some features may not work properly without a server.

---

## 🎨 Features Overview

### Home Page (`index.html`)
- Displays all your videos in a 3x3 grid
- Hover over any video to preview it
- Click a video to watch it in full screen
- Use the search bar to find specific videos

### Watch Page (`watch.html`)
- Full video player with controls
- Quality selector buttons (360p - 1080p)
- Performance monitor showing file size and bandwidth
- Recommended videos sidebar
- Click on recommendations to watch more videos
- Use search bar or click "MMB Video Platform" to return home

---

## 🎓 Learning Objectives

By completing this practicum, you will learn:
1. How to structure HTML for a video platform
2. How to style web pages using CSS
3. How to add interactivity with JavaScript
4. How video streaming platforms work
5. How quality selection affects bandwidth and user experience
6. How to implement search and filtering features

---

## 🔧 Customization Tips

### Change Video Titles and Descriptions
Open `index.html` and find the video cards. Update the `data-title` and `data-description` attributes:
```html
<div class="video-card" data-video-id="1" data-video-src="videos/vid1.mp4" 
     data-title="My Cool Video" data-description="This is my amazing video">
```

Also update the same information in `watch.js` in the `allVideos` array.

### Add More Videos
1. Add more video files to the `videos` folder
2. Copy a video card section in `index.html` and update the details
3. Add the video information to the `allVideos` array in `watch.js`

### Change Colors
Open `style.css` and modify the color codes:
- Background: `#0f0f0f`
- Card background: `#181818`
- Accent color: `#3ea6ff`

---

## 💡 Quality Switching Feature

The platform supports multiple video qualities. To enable this feature:

1. For each video, create different quality versions:
   - `vid1_360p.mp4` (low quality, small file)
   - `vid1_480p.mp4` (medium quality)
   - `vid1_720p.mp4` (high quality)
   - `vid1_1080p.mp4` (highest quality, large file)

2. When users click different quality buttons, the platform will automatically switch to the appropriate file

**Note**: If you only have one version of each video, the platform will still work but will use the same file for all quality settings.

---

## 🐛 Troubleshooting

**Videos don't show up?**
- Make sure your video files are in MP4 format
- Check that the `videos` folder is in the same location as `index.html`
- Verify the file names match what's in the code (`vid1.mp4`, `vid2.mp4`, etc.)

**Videos won't play?**
- Some video codecs might not work in browsers. Try converting to H.264 codec
- Make sure you're opening the file in a modern web browser

**Search doesn't work?**
- Make sure you've properly copied the `script.js` file
- Check that the file is in the same folder as `index.html`

---

## 📝 Assignment Submission

For your practicum submission, include:
1. All HTML, CSS, and JavaScript files
2. Screenshots of your working platform (home page and video player)
3. A brief report explaining what you learned
4. Any customizations you made

---

## 👥 Credits

**MMB Video Platform** - Multimedia Broadcasting Streaming System  
Course: Video Distribution Systems  
Year: 2024

---

## 📞 Need Help?

If you encounter any issues during the practicum:
1. Check the Troubleshooting section above
2. Review the code comments in each file
3. Ask your instructor or teaching assistant

---

**Good luck with your practicum! 🚀**
