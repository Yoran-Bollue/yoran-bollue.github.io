setTimeout(function () {
    // event listener for resizing
    const inboxResizeHandle = document.querySelector('inbox-element .resize-handle');
    inboxResizeHandle.addEventListener('mousedown', this.handleResizeInboxStart.bind(this));
    document.addEventListener('mouseup', this.handleResizeInboxEnd.bind(this));
    document.addEventListener('mousemove', this.handleResizeInbox.bind(this));

    //maximize window
    let inboxIsMaximized = false;
    const inboxMaxButtons = document.querySelectorAll('inbox-element .window-control');
    const inboxMaxButton = inboxMaxButtons[1];
    const inboxWindow = document.querySelector('inbox-element .window');
    inboxMaxButton.addEventListener('click', () => {
        if (!inboxIsMaximized) {
            document.querySelector('inbox-element').style.position = 'absolute';
            inboxWindow.style.width = document.querySelector('inbox-element').parentElement.parentElement.clientWidth + 'px';
            inboxWindow.style.height = document.querySelector('inbox-element').parentElement.parentElement.clientHeight + 'px';
            document.querySelector('inbox-element').style.left = '0';
            document.querySelector('inbox-element').style.top = '0';
            inboxIsMaximized = true;
        } else {
            inboxWindow.style.width = '500px';
            inboxWindow.style.height = '300px';
            inboxIsMaximized = false;
        }
    });
}, 600);

function handleResizeInboxStart(event) {
    console.warn('handleResizeInboxStart');
    event.preventDefault();
    this.inboxResizable = true;
    this.inboxResizeData = {
        offsetX: event.offsetX,
        offsetY: event.offsetY
    };
}

function handleResizeInbox(event) {
    if (this.inboxResizable) {
        const width = event.clientX - document.querySelector('inbox-element').getBoundingClientRect().left;
        const height = event.clientY - document.querySelector('inbox-element').getBoundingClientRect().top;
        document.querySelector('inbox-element .window').style.width = width + 'px';
        document.querySelector('inbox-element .window').style.height = height + 'px';
    }
}

function handleResizeInboxEnd() {
    this.inboxResizable = false;
}