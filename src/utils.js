export function createRadialGradient(x, y, startRadius, endRadius, colorStops) {
    const canvas = document.createElement('canvas');
    canvas.width = endRadius * 2;
    canvas.height = endRadius * 2;
    const context = canvas.getContext('2d');
    
    const gradient = context.createRadialGradient(x, y, startRadius, x, y, endRadius);
    
    colorStops.forEach(stop => {
        gradient.addColorStop(stop.offset, stop.color);
    });
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, endRadius * 2, endRadius * 2);
    
    return canvas;
}

export function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
