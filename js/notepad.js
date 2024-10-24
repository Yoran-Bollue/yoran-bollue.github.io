setTimeout(function () {
    // event listener for resizing
    const resizeHandle = document.querySelector('notepad-element .resize-handle');
    resizeHandle.addEventListener('mousedown', this.handleResizeStart.bind(this));
    document.addEventListener('mouseup', this.handleResizeEnd.bind(this));
    document.addEventListener('mousemove', this.handleResize.bind(this));

    //maximize window
    let isMaximized = false;
    const maxButtons = document.querySelectorAll('notepad-element .window-control');
    const maxButton = maxButtons[1];
    const window = document.querySelector('notepad-element .window');
    maxButton.addEventListener('click', () => {
        if (!isMaximized) {
            document.querySelector('notepad-element').style.position = 'absolute';
            window.style.width = document.querySelector('notepad-element').parentElement.parentElement.clientWidth + 'px';
            window.style.height = document.querySelector('notepad-element').parentElement.parentElement.clientHeight + 'px';
            document.querySelector('notepad-element').style.left = '0';
            document.querySelector('notepad-element').style.top = '0';
            isMaximized = true;
        } else {
            window.style.width = '500px';
            window.style.height = '300px';
            isMaximized = false;
        }
    });
    //minimize window
    maxButtons[0].addEventListener('click', () => {
        this.style.visibility = 'hidden';
    });
}, 600);

function handleResizeStart(event) {
    event.preventDefault();
    this.resizable = true;
    this.resizeData = {
        offsetX: event.offsetX,
        offsetY: event.offsetY
    };
}

function handleResize(event) {
    if (this.resizable) {
        const width = event.clientX - document.querySelector('notepad-element').getBoundingClientRect().left;
        const height = event.clientY - document.querySelector('notepad-element').getBoundingClientRect().top;
        document.querySelector('notepad-element .window').style.width = width + 'px';
        document.querySelector('notepad-element .window').style.height = height + 'px';
    }
}

function handleResizeEnd() {
    this.resizable = false;
}