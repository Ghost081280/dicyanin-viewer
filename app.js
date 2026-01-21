/**
 * Dicyanin Viewer - Authentic Kilner Screen Replication
 * 
 * Based on Dr. Walter J. Kilner's 1911 research "The Human Atmosphere"
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Removed live watermark during recording (was causing lag)
 * - Watermark added only to final output
 * - Reduced canvas resolution option for slower devices
 * - iOS-specific MP4 handling for camera roll saving
 */

class DicyaninViewer {
    constructor() {
        // DOM Elements
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        this.loadingScreen = document.getElementById('loading-screen');
        this.viewer = document.getElementById('viewer');
        this.errorScreen = document.getElementById('error-screen');
        
        this.intensitySlider = document.getElementById('intensity');
        this.intensityValue = document.getElementById('intensity-value');
        this.flipBtn = document.getElementById('flip-btn');
        this.captureBtn = document.getElementById('capture-btn');
        this.recordBtn = document.getElementById('record-btn');
        this.shareBtn = document.getElementById('share-btn');
        
        this.captureModal = document.getElementById('capture-modal');
        this.captureCanvas = document.getElementById('capture-canvas');
        this.captureCtx = this.captureCanvas.getContext('2d');
        this.closeModalBtn = document.getElementById('close-modal');
        this.downloadBtn = document.getElementById('download-btn');
        this.shareCaptureBtn = document.getElementById('share-capture-btn');
        
        this.retryBtn = document.getElementById('retry-btn');
        this.topBar = document.getElementById('top-bar');
        this.infoBadge = this.topBar.querySelector('.info-badge');
        
        // Recording elements
        this.recordingIndicator = document.getElementById('recording-indicator');
        this.recordingTime = document.getElementById('recording-time');
        
        // Video preview modal elements
        this.videoModal = document.getElementById('video-modal');
        this.videoPreview = document.getElementById('video-preview');
        this.closeVideoModalBtn = document.getElementById('close-video-modal');
        this.downloadVideoBtn = document.getElementById('download-video-btn');
        this.shareVideoBtn = document.getElementById('share-video-btn');
        
        // State
        this.stream = null;
        this.facingMode = 'environment';
        this.intensity = 0.85;
        this.isProcessing = false;
        this.animationId = null;
        this.filterEnabled = true;
        
        // Recording state
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingStartTime = null;
        this.recordingTimerInterval = null;
        this.maxRecordingDuration = 30000; // 30 seconds max
        this.recordedBlob = null;
        
        // Store blobs
        this.currentImageBlob = null;
        this.currentVideoUrl = null;
        
        // App URL for sharing
        this.appUrl = 'https://ghost081280.github.io/dicyanin-viewer/';
        
        // Platform detection
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        
        // Bind methods
        this.processFrame = this.processFrame.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Initialize
        this.init();
    }
    
    async init() {
        this.bindEvents();
        await this.startCamera();
        window.addEventListener('resize', this.handleResize);
    }
    
    bindEvents() {
        this.intensitySlider.addEventListener('input', (e) => {
            this.intensity = e.target.value / 100;
            this.intensityValue.textContent = `${e.target.value}%`;
        });
        
        this.flipBtn.addEventListener('click', () => this.flipCamera());
        this.captureBtn.addEventListener('click', () => this.captureImage());
        this.recordBtn.addEventListener('click', () => this.toggleRecording());
        this.shareBtn.addEventListener('click', () => this.shareApp());
        
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.downloadBtn.addEventListener('click', () => this.saveImage());
        this.shareCaptureBtn.addEventListener('click', () => this.shareImage());
        
        // Video modal events
        this.closeVideoModalBtn.addEventListener('click', () => this.closeVideoModal());
        this.downloadVideoBtn.addEventListener('click', () => this.saveVideo());
        this.shareVideoBtn.addEventListener('click', () => this.shareVideo());
        
        this.retryBtn.addEventListener('click', () => this.startCamera());
        
        // Tap canvas to toggle filter
        this.canvas.addEventListener('click', () => this.toggleFilter());
        
        // Close modals on backdrop click
        this.captureModal.addEventListener('click', (e) => {
            if (e.target === this.captureModal) this.closeModal();
        });
        this.videoModal.addEventListener('click', (e) => {
            if (e.target === this.videoModal) this.closeVideoModal();
        });
    }
    
    async startCamera() {
        try {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
            
            // Use lower resolution on mobile for better performance
            const isMobile = this.isIOS || this.isAndroid;
            const constraints = {
                video: {
                    facingMode: this.facingMode,
                    width: { ideal: isMobile ? 1280 : 1920 },
                    height: { ideal: isMobile ? 720 : 1080 }
                },
                audio: false
            };
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            this.video.onloadedmetadata = () => {
                this.video.play();
                this.handleResize();
                this.showViewer();
                this.startProcessing();
            };
            
        } catch (error) {
            console.error('Camera error:', error);
            this.showError();
        }
    }
    
    handleResize() {
        this.canvas.width = this.video.videoWidth || 1280;
        this.canvas.height = this.video.videoHeight || 720;
    }
    
    showViewer() {
        this.loadingScreen.classList.add('hidden');
        this.errorScreen.classList.add('hidden');
        this.viewer.classList.remove('hidden');
    }
    
    showError() {
        this.loadingScreen.classList.add('hidden');
        this.viewer.classList.add('hidden');
        this.errorScreen.classList.remove('hidden');
    }
    
    startProcessing() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.processFrame();
    }
    
    stopProcessing() {
        this.isProcessing = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    /**
     * AUTHENTIC KILNER DICYANIN FILTER
     * 
     * Based on scientific testing of actual dicyanin screens:
     * Source: 1917 Bureau of Standards paper & spectral analysis
     * 
     * SPECTRAL TRANSMISSION:
     * - PASSES: Blue/Violet (380-500nm) - high transmission
     * - BLOCKS: Green (500-570nm) - almost complete absorption  
     * - BLOCKS: Yellow (570-590nm) - almost complete absorption
     * - PASSES: Deep Red/Near-IR (650-750nm+) - partial transmission
     */
    applyDicyaninFilter(imageData) {
        const data = imageData.data;
        const intensity = this.intensity;
        
        const redTransmission = 0.25;
        const greenTransmission = 0.05;
        const blueTransmission = 0.95;
        const darknessFactor = 0.55;
        const violetMix = 0.18;
        const contrastBoost = 1.2;
        const contrastMidpoint = 128;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            let filteredR = r * redTransmission;
            let filteredG = g * greenTransmission;
            let filteredB = (b * blueTransmission) + (r * violetMix);
            
            filteredR *= darknessFactor;
            filteredG *= darknessFactor;
            filteredB *= darknessFactor;
            
            filteredR = ((filteredR - contrastMidpoint) * contrastBoost) + contrastMidpoint;
            filteredG = ((filteredG - contrastMidpoint) * contrastBoost) + contrastMidpoint;
            filteredB = ((filteredB - contrastMidpoint) * contrastBoost) + contrastMidpoint;
            
            data[i] = Math.max(0, Math.min(255, r * (1 - intensity) + filteredR * intensity));
            data[i + 1] = Math.max(0, Math.min(255, g * (1 - intensity) + filteredG * intensity));
            data[i + 2] = Math.max(0, Math.min(255, b * (1 - intensity) + filteredB * intensity));
        }
        
        return imageData;
    }
    
    processFrame() {
        if (!this.isProcessing) return;
        
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        if (this.filterEnabled && this.intensity > 0) {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const filtered = this.applyDicyaninFilter(imageData);
            this.ctx.putImageData(filtered, 0, 0);
        }
        
        // NO live watermark during recording - it causes lag
        // Watermark is added to final output only
        
        this.animationId = requestAnimationFrame(this.processFrame);
    }
    
    toggleFilter() {
        this.filterEnabled = !this.filterEnabled;
        const badge = this.infoBadge;
        
        if (this.filterEnabled) {
            badge.innerHTML = '<span class="badge-dot"></span>DICYANIN FILTER ACTIVE';
        } else {
            badge.innerHTML = '<span class="badge-dot" style="background: var(--danger); box-shadow: 0 0 8px var(--danger);"></span>FILTER DISABLED';
        }
    }
    
    async flipCamera() {
        this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
        await this.startCamera();
    }
    
    // ==================== IMAGE CAPTURE ====================
    
    captureImage() {
        this.captureCanvas.width = this.canvas.width;
        this.captureCanvas.height = this.canvas.height;
        
        // Copy current frame
        this.captureCtx.drawImage(this.canvas, 0, 0);
        
        // Add watermark
        this.addWatermark(this.captureCtx, this.captureCanvas.width, this.captureCanvas.height);
        
        // Generate blob immediately
        this.captureCanvas.toBlob((blob) => {
            this.currentImageBlob = blob;
        }, 'image/png');
        
        // Show modal
        this.captureModal.classList.remove('hidden');
    }
    
    addWatermark(ctx, width, height) {
        // Top watermark bar
        const topBarHeight = Math.max(60, height * 0.06);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, width, topBarHeight);
        
        // Top border glow
        const topGradient = ctx.createLinearGradient(0, topBarHeight - 2, 0, topBarHeight);
        topGradient.addColorStop(0, 'rgba(74, 58, 255, 0.8)');
        topGradient.addColorStop(1, 'rgba(74, 58, 255, 0)');
        ctx.fillStyle = topGradient;
        ctx.fillRect(0, topBarHeight - 2, width, 4);
        
        // "DICYANIN FILTER ACTIVATED" text
        const fontSize = Math.max(16, width / 30);
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(74, 58, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#8b7aff';
        ctx.fillText('DICYANIN FILTER ACTIVATED', width / 2, topBarHeight / 2);
        ctx.shadowBlur = 0;
        
        // Bottom watermark bar
        const bottomBarHeight = Math.max(50, height * 0.05);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, height - bottomBarHeight, width, bottomBarHeight);
        
        // Bottom border glow
        const bottomGradient = ctx.createLinearGradient(0, height - bottomBarHeight, 0, height - bottomBarHeight + 2);
        bottomGradient.addColorStop(0, 'rgba(74, 58, 255, 0)');
        bottomGradient.addColorStop(1, 'rgba(74, 58, 255, 0.8)');
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(0, height - bottomBarHeight - 2, width, 4);
        
        // Website/branding
        const smallFontSize = Math.max(12, width / 45);
        ctx.font = `600 ${smallFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('ghost081280.github.io/dicyanin-viewer', width / 2, height - bottomBarHeight / 2);
    }
    
    closeModal() {
        this.captureModal.classList.add('hidden');
    }
    
    /**
     * Save image - uses native share sheet on mobile (best way to save to camera roll)
     */
    async saveImage() {
        try {
            let blob = this.currentImageBlob;
            if (!blob) {
                blob = await new Promise(resolve => {
                    this.captureCanvas.toBlob(resolve, 'image/png');
                });
            }
            
            if (!blob) {
                alert('Could not generate image. Please try again.');
                return;
            }
            
            const filename = `dicyanin-scan-${Date.now()}.png`;
            const file = new File([blob], filename, { type: 'image/png' });
            
            // Use native share sheet - this is the BEST way to save to camera roll on mobile
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file] });
                    return; // Success - user can choose "Save Image" from share sheet
                } catch (err) {
                    if (err.name === 'AbortError') return; // User cancelled
                    console.log('Share failed, trying fallback');
                }
            }
            
            // Desktop fallback - direct download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save image. Please try again.');
        }
    }
    
    /**
     * Share image - opens native share sheet
     * Note: X/Twitter web intents DO NOT support image upload
     * The only way to share with media is via native share sheet
     */
    async shareImage() {
        try {
            let blob = this.currentImageBlob;
            if (!blob) {
                blob = await new Promise(resolve => {
                    this.captureCanvas.toBlob(resolve, 'image/png');
                });
            }
            
            if (!blob) {
                this.shareApp();
                return;
            }
            
            const file = new File([blob], 'dicyanin-scan.png', { type: 'image/png' });
            
            // Native share sheet - the ONLY way to share actual media to X/Twitter
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Dicyanin Filter Scan',
                        text: 'DICYANIN FILTER ACTIVATED - See what others cannot. What do you see?\n' + this.appUrl
                    });
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return;
                }
            }
            
            // Fallback: save image then show instructions
            await this.saveImage();
            alert('Image saved! To share on X/Twitter:\n1. Open X app\n2. Create new post\n3. Attach the saved image');
            
        } catch (error) {
            console.error('Share error:', error);
            this.shareApp();
        }
    }
    
    // ==================== VIDEO RECORDING ====================
    
    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }
    
    startRecording() {
        try {
            // Get canvas stream - lower framerate for better performance
            const canvasStream = this.canvas.captureStream(24); // 24 FPS is smoother than 30
            
            // Get the correct mime type - iOS ONLY supports MP4
            const mimeType = this.getRecordingMimeType();
            if (!mimeType) {
                alert('Video recording is not supported on this browser.');
                return;
            }
            
            const options = { mimeType };
            
            // Lower bitrate on mobile for better performance
            if (this.isIOS || this.isAndroid) {
                options.videoBitsPerSecond = 2500000; // 2.5 Mbps
            } else {
                options.videoBitsPerSecond = 5000000; // 5 Mbps
            }
            
            this.mediaRecorder = new MediaRecorder(canvasStream, options);
            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };
            
            // Start recording - collect data every 500ms (less frequent = less overhead)
            this.mediaRecorder.start(500);
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            
            // Update UI
            this.recordBtn.classList.add('recording');
            this.recordBtn.querySelector('span').textContent = 'Stop';
            this.recordingIndicator.classList.remove('hidden');
            
            // Start timer
            this.updateRecordingTimer();
            this.recordingTimerInterval = setInterval(() => {
                this.updateRecordingTimer();
            }, 100);
            
            // Auto-stop after max duration
            setTimeout(() => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            }, this.maxRecordingDuration);
            
        } catch (error) {
            console.error('Recording error:', error);
            alert('Failed to start recording. Please try again.');
        }
    }
    
    getRecordingMimeType() {
        // iOS Safari ONLY supports MP4 with H.264
        // This is critical for saving to camera roll
        if (this.isIOS) {
            if (MediaRecorder.isTypeSupported('video/mp4')) {
                return 'video/mp4';
            }
            return null; // iOS requires MP4
        }
        
        // Other browsers - try formats in order of preference
        const types = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
            'video/mp4'
        ];
        
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return null;
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            // Update UI
            this.recordBtn.classList.remove('recording');
            this.recordBtn.querySelector('span').textContent = 'Record';
            this.recordingIndicator.classList.add('hidden');
            
            // Stop timer
            if (this.recordingTimerInterval) {
                clearInterval(this.recordingTimerInterval);
                this.recordingTimerInterval = null;
            }
        }
    }
    
    updateRecordingTimer() {
        if (!this.recordingStartTime) return;
        
        const elapsed = Date.now() - this.recordingStartTime;
        const seconds = Math.floor(elapsed / 1000);
        const ms = Math.floor((elapsed % 1000) / 100);
        
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        this.recordingTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
        
        if (elapsed >= this.maxRecordingDuration) {
            this.stopRecording();
        }
    }
    
    async processRecording() {
        const mimeType = this.getRecordingMimeType();
        this.recordedBlob = new Blob(this.recordedChunks, { type: mimeType });
        
        // For the final video, we need to add watermark
        // This requires re-encoding which is complex, so for now we'll skip it
        // The watermark can be added in a future version using WebCodecs
        
        // Clean up old URL
        if (this.currentVideoUrl) {
            URL.revokeObjectURL(this.currentVideoUrl);
        }
        
        // Create preview URL
        this.currentVideoUrl = URL.createObjectURL(this.recordedBlob);
        this.videoPreview.src = this.currentVideoUrl;
        
        // Show modal
        this.videoModal.classList.remove('hidden');
    }
    
    closeVideoModal() {
        this.videoModal.classList.add('hidden');
        this.videoPreview.pause();
    }
    
    /**
     * Save video - uses native share sheet on mobile
     * This is the ONLY reliable way to save video to camera roll on iOS
     */
    async saveVideo() {
        if (!this.recordedBlob) {
            alert('No video recorded.');
            return;
        }
        
        try {
            const isMP4 = this.recordedBlob.type.includes('mp4');
            const extension = isMP4 ? 'mp4' : 'webm';
            const filename = `dicyanin-scan-${Date.now()}.${extension}`;
            const file = new File([this.recordedBlob], filename, { type: this.recordedBlob.type });
            
            // Use native share sheet - ONLY reliable way to save video to camera roll on iOS
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file] });
                    return; // User can choose "Save Video" from share sheet
                } catch (err) {
                    if (err.name === 'AbortError') return;
                    console.log('Share failed, trying fallback');
                }
            }
            
            // Desktop fallback
            const url = URL.createObjectURL(this.recordedBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save video. Please try again.');
        }
    }
    
    /**
     * Share video - opens native share sheet
     */
    async shareVideo() {
        if (!this.recordedBlob) {
            alert('No video recorded.');
            return;
        }
        
        try {
            const isMP4 = this.recordedBlob.type.includes('mp4');
            const extension = isMP4 ? 'mp4' : 'webm';
            const file = new File([this.recordedBlob], `dicyanin-scan.${extension}`, { 
                type: this.recordedBlob.type 
            });
            
            // Native share sheet
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Dicyanin Filter Scan',
                        text: 'DICYANIN FILTER ACTIVATED - See what others cannot. What do you see?\n' + this.appUrl
                    });
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return;
                }
            }
            
            // Fallback
            await this.saveVideo();
            alert('Video saved! To share on X/Twitter:\n1. Open X app\n2. Create new post\n3. Attach the saved video');
            
        } catch (error) {
            console.error('Share error:', error);
            this.shareApp();
        }
    }
    
    // ==================== APP SHARING ====================
    
    /**
     * Share the app link
     * Note: X web intents only support text/URL, not media files
     */
    shareApp() {
        const text = "See what others can't. The legendary Kilner dicyanin filter - what will you see?";
        
        // Try native share first
        if (navigator.share) {
            navigator.share({
                title: 'Dicyanin Viewer',
                text: text,
                url: this.appUrl
            }).catch(() => {
                // Fallback to X intent
                this.openXIntent(text);
            });
        } else {
            this.openXIntent(text);
        }
    }
    
    openXIntent(text) {
        const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.appUrl)}`;
        window.open(xShareUrl, '_blank', 'width=550,height=420');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DicyaninViewer();
});
