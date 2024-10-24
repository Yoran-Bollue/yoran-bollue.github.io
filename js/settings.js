setTimeout(() => {
    // event listener for resizing
    const settingsResizeHandle = document.querySelector('settings-element .resize-handle');
    console.warn(settingsResizeHandle);
    settingsResizeHandle.addEventListener('mousedown', this.handleResizeSettingsStart.bind(this));
    document.addEventListener('mouseup', this.handleResizeSettingsEnd.bind(this));
    document.addEventListener('mousemove', this.handleResizeSettings.bind(this));
}, 600);

function handleResizeSettingsStart(event) {
    event.preventDefault();
    console.warn('handleResizeSettingsStart');
    this.settingsResizable = true;
    this.settingsResizeData = {
        offsetX: event.offsetX,
        offsetY: event.offsetY
    };
}

function handleResizeSettings(event) {
    if (this.settingsResizable) {
        const width = event.clientX - document.querySelector('settings-element').getBoundingClientRect().left;
        const height = event.clientY - document.querySelector('settings-element').getBoundingClientRect().top;
        document.querySelector('settings-element .window').style.width = width + 'px';
        document.querySelector('settings-element .window').style.height = height + 'px';
    }
}

function handleResizeSettingsEnd() {
    this.settingsResizable = false;
}