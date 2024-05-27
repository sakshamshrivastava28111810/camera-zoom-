async function getCameraStream() {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "environment"
      }
    };
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = document.getElementById('video');
      video.srcObject = stream;
  
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      const settings = track.getSettings();
  
      console.log('Capabilities:', capabilities);
      console.log('Settings:', settings);
  
      return { track, capabilities, settings };
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }
  
  let videoTrack;
  let capabilities;
  let settings;
  
  document.addEventListener('DOMContentLoaded', async () => {
    const camera = await getCameraStream();
    if (camera) {
      videoTrack = camera.track;
      capabilities = camera.capabilities;
      settings = camera.settings;
  
      initializeControls();
    }
  });
  
  function initializeControls() {
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    const focusNearButton = document.getElementById('focusNear');
    const focusFarButton = document.getElementById('focusFar');
    const increaseColorTempButton = document.getElementById('increaseColorTemp');
    const decreaseColorTempButton = document.getElementById('decreaseColorTemp');
    const capturePhotoButton = document.getElementById('capturePhoto');
  
    zoomInButton.addEventListener('click', () => adjustZoom(1));
    zoomOutButton.addEventListener('click', () => adjustZoom(-1));
    focusNearButton.addEventListener('click', () => adjustFocus(-1));
    focusFarButton.addEventListener('click', () => adjustFocus(1));
    increaseColorTempButton.addEventListener('click', () => adjustBrightness(10));
    decreaseColorTempButton.addEventListener('click', () => adjustBrightness(-10));
    capturePhotoButton.addEventListener('click', capturePhoto);
  }
  function adjustZoom(step) {
    if (capabilities.zoom) {
      const currentZoom = settings.zoom || capabilities.zoom.min;
      const newZoom = Math.min(Math.max(currentZoom + step, capabilities.zoom.min), capabilities.zoom.max);
      const constraints = {
        advanced: [{ zoom: newZoom }]
      };
      videoTrack.applyConstraints(constraints)
        .then(() => {
          settings.zoom = newZoom;
          console.log('Zoom adjusted to:', newZoom);
        })
        .catch((error) => {
          console.error('Error adjusting zoom:', error);
        });
    }
  }
  
  function adjustFocus(step) {
    if (capabilities.focusDistance) {
      const currentFocus = settings.focusDistance || capabilities.focusDistance.min;
      const newFocus = Math.min(Math.max(currentFocus + step, capabilities.focusDistance.min), capabilities.focusDistance.max);
      const constraints = {
        advanced: [{ focusDistance: newFocus }]
      };
      videoTrack.applyConstraints(constraints)
        .then(() => {
          settings.focusDistance = newFocus;
          console.log('Focus distance adjusted to:', newFocus);
        })
        .catch((error) => {
          console.error('Error adjusting focus distance:', error);
        });
    }
  }
  
  function adjustBrightness(step) {
    if (capabilities.brightness) {
      const currentBrightness = settings.brightness || capabilities.brightness.min;
      const newBrightness = Math.min(Math.max(currentBrightness + step, capabilities.brightness.min), capabilities.brightness.max);
      const constraints = {
        advanced: [{ brightness: newBrightness }]
      };
      videoTrack.applyConstraints(constraints)
        .then(() => {
          settings.brightness = newBrightness;
          console.log('Brightness adjusted to:', newBrightness);
        })
        .catch((error) => {
          console.error('Error adjusting brightness:', error);
        });
    }
  }
  
  
  function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(blob => {
      const downloadLink = document.getElementById('downloadLink');
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.style.display = 'block';
      downloadLink.click();
    }, 'image/jpeg');
  }