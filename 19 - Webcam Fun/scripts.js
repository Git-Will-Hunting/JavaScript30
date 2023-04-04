const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const redShift = document.querySelector('.redShift');
const pSplit = document.querySelector('.pSplit');
const pAlpha = document.querySelector('.pAlpha');
const noFilterButton = document.querySelector('.noFilter');

function getVideo() {
    const constraints ={
        video: {
            width: {exact: 640},
            height: {exact: 480}
        },
        audio: false
    };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(localMediaStream => {
        console.log(localMediaStream);
        // video.src = window.URL.createObjectURL(localMediaStream);
        video.srcObject = localMediaStream;
        video.play();

    })
    .catch(err => {
        console.error('Webcam not available');
        alert('Webcam not available');
    });
}

let lastFilter = 'noFilter'
let currentFilter = 'noFilter'

function noFilter(pixels, lastFilter) {
    if (lastFilter === 'redEffect') {
        // Reverse redEffect
        for(let i = 0; i <pixels.data.length; i+=4) {
            pixels.data[i +0] = pixels.data[i + 0] - 100; // Red
            pixels.data[i +1] = pixels.data[i + 1] + 50; // Green
            pixels.data[i +2] = pixels.data[i + 2] * 2; // Blue
        }
    } else if (lastFilter === 'rgbSplit') {
        // Reverse rgbSplit
        for(let i = 0; i <pixels.data.length; i+=4) {
            pixels.data[i - 400] = pixels.data[i + 0]; // Red
            pixels.data[i + 100] = pixels.data[i + 1]; // Green
            pixels.data[i + 600] = pixels.data[i + 2]; // Blue
        }
    } else if (lastFilter === 'greenScreen'){
        // Reverse green screen
        for (i = 0; i <pixels.data.length; i+=4) {
            pixels.data[i + 3] = 255;
    }
}
return pixels
}

function redEffect(pixels){
    for(let i = 0; i <pixels.data.length; i+=4) {
        pixels.data[i +0] = pixels.data[i + 0] + 100; // Red
        pixels.data[i +1] = pixels.data[i + 1] - 50; // Green
        pixels.data[i +2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels
}

function rgbSplit(pixels){
    for(let i = 0; i <pixels.data.length; i+=4) {
        pixels.data[i - 400] = pixels.data[i + 0]; // Red
        pixels.data[i + 100] = pixels.data[i + 1]; // Green
        pixels.data[i + 600] = pixels.data[i + 2]; // Blue
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i <pixels.data.length; i+=4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if(red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red >= levels.rmax
            && green >= levels.gmax
            && blue >= levels.bmax) {
                // take it out
                pixels.data[i + 3] = 0;
            }
    }
    return pixels;
}

function addNoFilter(){
    lastFilter = currentFilter;
    currentFilter = 'noFilter';
}

function addRedShift(){
    currentFilter = 'redEffect';
}

function addPSplit(){
    currentFilter = 'rgbSplit';
}

function addPAlpha(){
    currentFilter = 'greenScreen';
}


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        if (currentFilter === 'redEffect') {
            pixels = redEffect(pixels);
        } else if (currentFilter === 'rgbSplit') {
            pixels = rgbSplit(pixels);
        } else if (currentFilter === 'greenScreen') {
            pixels = greenScreen(pixels);
        } else if (currentFilter === 'noFilter') {
            pixels = noFilter(pixels, lastFilter);
        }
        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    //play sound
    snap.currentTime = 0;
    snap.play();
    // take data out of canvas
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'capture');
    link.innerHTML = `<img src="${data}" alt="capture"/>`;
    strip.insertBefore(link, strip.firstChild);  
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
redShift.addEventListener('click', addRedShift);
pSplit.addEventListener('click', addPSplit);
pAlpha.addEventListener('click', addPAlpha);
noFilterButton.addEventListener('click', addNoFilter);