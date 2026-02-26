// Canvas and Image Management
const canvas = document.getElementById('vision-board');
const ctx = canvas.getContext('2d');

let images = []; // Loaded images
let activeImage = null; // Selected image
let isResizing = false; // Resizing state

// Load Images
document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    for (let file of files) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            images.push({
                image: img,
                x: 100,
                y: 100,
                width: 200,
                height: 150,
                resizingHandle: { x: 300, y: 250 }, // Bottom-right corner
                isSelected: false,
            });
            drawCanvas();
        };
    }
});

// Draw Canvas
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    images.forEach((img) => {
        ctx.drawImage(img.image, img.x, img.y, img.width, img.height);

        // Draw highlight around selected image
        if (img.isSelected) {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.strokeRect(img.x, img.y, img.width, img.height);
            ctx.setLineDash([]);
        }

        // Draw resizing handle
        ctx.fillStyle = 'red';
        ctx.fillRect(img.resizingHandle.x - 5, img.resizingHandle.y - 5, 10, 10);
    });
}

// Image Selection and Dragging/Resizing
canvas.addEventListener('mousedown', (e) => {
    const startX = e.offsetX;
    const startY = e.offsetY;

    activeImage = images.find((img) =>
        startX >= img.x &&
        startX <= img.x + img.width &&
        startY >= img.y &&
        startY <= img.y + img.height
    );

    images.forEach((img) => (img.isSelected = false)); // Deselect all
    if (activeImage) {
        activeImage.isSelected = true;

        const handle = activeImage.resizingHandle;
        if (
            startX >= handle.x - 5 &&
            startX <= handle.x + 5 &&
            startY >= handle.y - 5 &&
            startY <= handle.y + 5
        ) {
            isResizing = true;
            canvas.style.cursor = 'nwse-resize'; // Resize cursor
        } else {
            activeImage.offsetX = startX - activeImage.x;
            activeImage.offsetY = startY - activeImage.y;
            canvas.style.cursor = 'move'; // Move cursor
        }
    } else {
        canvas.style.cursor = 'default'; // Default cursor
    }
    drawCanvas();
});

// Dragging or Resizing
canvas.addEventListener('mousemove', (e) => {
    if (activeImage) {
        if (isResizing) {
            const newWidth = e.offsetX - activeImage.x;
            const newHeight = e.offsetY - activeImage.y;
            activeImage.width = Math.max(newWidth, 20); // Minimum size
            activeImage.height = Math.max(newHeight, 20);
            activeImage.resizingHandle.x = activeImage.x + activeImage.width;
            activeImage.resizingHandle.y = activeImage.y + activeImage.height;
        } else {
            activeImage.x = e.offsetX - activeImage.offsetX;
            activeImage.y = e.offsetY - activeImage.offsetY;
            activeImage.resizingHandle.x = activeImage.x + activeImage.width;
            activeImage.resizingHandle.y = activeImage.y + activeImage.height;
        }
        drawCanvas();
    }
});

// End Dragging or Resizing
canvas.addEventListener('mouseup', () => {
    activeImage = null;
    isResizing = false;
    canvas.style.cursor = 'default'; // Reset cursor
});

// Delete Image (Delete Key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && images.some((img) => img.isSelected)) {
        images = images.filter((img) => !img.isSelected); // Remove selected image
        activeImage = null;
        drawCanvas();
    }
});

// Delete Image (Right-Click)
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Disable default context menu
    const startX = e.offsetX;
    const startY = e.offsetY;

    const rightClickedImage = images.find((img) =>
        startX >= img.x &&
        startX <= img.x + img.width &&
        startY >= img.y &&
        startY <= img.y + img.height
    );

    if (rightClickedImage) {
        if (confirm('Do you want to delete this image?')) {
            images = images.filter((img) => img !== rightClickedImage);
            drawCanvas();
        }
    }
});

// Resize Canvas
function resizeCanvas() {
    canvas.width = document.getElementById('canvas-width').value;
    canvas.height = document.getElementById('canvas-height').value;
    drawCanvas();
}

// Change Theme
function changeTheme() {
    const themeColor = document.getElementById('theme-selector').value;
    document.body.style.setProperty('--bg-color', themeColor);
    document.body.style.setProperty('--canvas-bg', themeColor);
}

// Save Canvas
function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'vision-board.png';
    link.href = canvas.toDataURL();
    link.click();
}



