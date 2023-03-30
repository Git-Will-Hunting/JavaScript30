// get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progressBar = player.querySelector('.progress');
const progressFilled = player.querySelector('.progress__filled');
const playToggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen');

// build out functions

// let isPlaying = false;
// function togglePlay() {
// isPlaying = !isPlaying;
// if(isPlaying) {
//     video.pause();
// } else {
//     video.play();
// };
// 
// };
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function updateButton(){
    const icon = this.paused ? '►' : '❚ ❚';
    playToggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressFilled.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
    video.currentTime = scrubTime
}

function openFullScreen() {
    if (video.requestFullscreen()){
        video.requestFullscreen();
    } else if(video.webkitRequestFullscreen()){
        video.webkitRequestFullscreen()
    } else if(video.msRequestFullscreen()){
        video.msRequestFullscreen()
    }
    
}

// hook up event listeners
playToggle.addEventListener('click', togglePlay);

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

skipButtons.forEach( button => button.addEventListener('click', skip));

ranges.forEach( slider => slider.addEventListener('change', handleRangeUpdate));
ranges.forEach( slider => slider.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progressBar.addEventListener('click', scrub);
progressBar.addEventListener('mousemove', (e) => mousedown && scrub(e));
progressBar.addEventListener('mousedown', () => mousedown = true);
progressBar.addEventListener('mouseup', () => mousedown = false);

fullscreen.addEventListener('click', openFullScreen);
