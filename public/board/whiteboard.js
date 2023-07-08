var io = io.connect();

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('canvas');

    if (canvas) {
        canvas.width = 0.98 * window.innerWidth;
        canvas.height = 0.98 * window.innerHeight;
    }

    let context;

    if (canvas){
        context = canvas.getContext('2d');
        context.lineCap = "round";
        context.lineWidth = 5;
    }

    let mouseX;
    let mouseY;

    let mouseDown = false;
    let tool = 'pencil';

    window.onmousedown = (e) => {
        if (tool === 'pencil') {
            context.beginPath();
            context.moveTo(mouseX-15, mouseY-50);
            io.emit('mouseDown', { x: mouseX, y: mouseY });
        }
        mouseDown = true;
    }
    window.onmouseup = (e) => {
        mouseDown = false;
    }

    io.on('onDraw', ({ x, y }) => {
        if (tool === 'pencil') {
            context.lineTo(x-15, y-50);
            context.stroke();
        }
    })

    io.on('onErase', ({ x,y }) => {
        context.clearRect(x - 30, y - 70, 30, 30);                
    })

    io.on('onDown', ({ x, y }) => {
        if (tool === 'pencil') {
            context.beginPath();
            context.moveTo(x-15, y-50);
        } else if (tool === 'eraser') {
            context.clearRect(x-30, y-70 , 30, 30);
        }
    })

    io.on('onClear', () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
    })

    window.onmousemove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (mouseDown) {
            if (tool === 'pencil') {
                io.emit('draw', { x: mouseX, y: mouseY });
                context.lineTo(mouseX-15, mouseY-50);
                context.stroke();
            } else if (tool === 'eraser') {
                io.emit('erase', { x: mouseX, y: mouseY });
                context.clearRect(mouseX - 30, mouseY - 70, 30, 30);
            }
        }

    }

    const pencilButton = document.getElementById('pencilButton');
    const eraserButton = document.getElementById('eraserButton');
    const clearButton = document.getElementById('clearButton');

    pencilButton.addEventListener('click', () => {
        tool = 'pencil';
        pencilButton.classList.add('active');
        eraserButton.classList.remove('active');
    });

    eraserButton.addEventListener('click', () => {
        tool = 'eraser';
        eraserButton.classList.add('active');
        pencilButton.classList.remove('active');
    });

    clearButton.addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        io.emit('clear')
    })

});