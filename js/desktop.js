this.programs = [];

this.loadingScreen();

setTimeout(() => {
    // Call updateTime() initially to set the time immediately
    this.updateTime();
    // Update the time every second
    setInterval(() => {
        document.querySelector('.time .dots').style.visibility = 'hidden';
        setTimeout(() => {
            this.updateTime();
            document.querySelector('.time .dots').style.visibility = 'visible';
        }, 1000);
    }, 2000);

    // await customElements.whenDefined('inbox-X');

    // Add event listener for the contextmenu event
    // document.addEventListener('contextmenu', (event) => {
    //     // Prevent the default context menu from appearing
    //     event.preventDefault();
    // });

    this.setTaskbar();

    this.arrangeWindows(10, 20);

    const startButton = document.querySelector('.start');
    const startMenu = document.querySelector('.startmenu');
    startButton.addEventListener('click', () => {
        startMenu.style.bottom = (document.body.getBoundingClientRect().bottom - startButton.getBoundingClientRect().top - 1) + 'px';
        startMenu.style.visibility = startMenu.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    this.setProgramsListener();

    const cascadeButton = document.querySelector('.cascade-button');
    cascadeButton.addEventListener('click', () => {
        this.arrangeWindows(10, 20);
        for (let i = 0; i < document.querySelector('.desktop').children.length; i++) {
            document.querySelector('.desktop').children[i].style.zIndex = 0;
            if (!this.programs[i].isClosed) {
                document.querySelector('.desktop').children[i].style.visibility = 'visible';
            }
        }
    });

    const desktopButton = document.querySelector('.desktop-button');
    desktopButton.addEventListener('click', () => {
        const desktop = document.querySelector('.desktop');
        for (let i = 0; i < desktop.children.length; i++) {
            desktop.children[i].style.zIndex = 0;
            desktop.children[i].style.visibility = 'hidden';
        }
    });

    // open settings window
    const settingsButton = document.querySelector('.settings-button');
    settingsButton.addEventListener('click', () => {
        const desktop = document.querySelector('.desktop');
        const index = this.programs.findIndex((program) => program.tagname === 'SETTINGS-ELEMENT');
        this.windowVisibility(index, false);
        this.programs[index].isClosed = false;
    });
}, 600);

function loadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.style.position = 'absolute';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.left = 0;
    loadingScreen.style.top = 0;
    loadingScreen.style.backgroundColor = 'white';
    loadingScreen.style.color = 'white';
    loadingScreen.style.zIndex = 1000;
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.innerHTML = "<img src='../assets/desktop/loading.gif' style='height: 200px;'>"
    document.body.appendChild(loadingScreen);

    setTimeout(() => {
        loadingScreen.remove();
    }, 700);
}

function setProgramsListener() {
    const programsItemsElement = document.querySelector('.programs');
    const programsButtonElement = document.querySelector('.programs-button');

    this.isHoveringOverButton = false;
    this.isHoveringOverItems = false;

    programsButtonElement.addEventListener('mouseover', () => {
        this.isHoveringOverButton = true;
        programsItemsElement.style.bottom = (document.body.getBoundingClientRect().bottom - programsButtonElement.getBoundingClientRect().bottom) + 'px';
        programsItemsElement.style.left = (programsButtonElement.getBoundingClientRect().right - document.body.getBoundingClientRect().left) + 'px';
        programsItemsElement.style.visibility = 'visible';
    });
    programsButtonElement.addEventListener('mouseleave', () => {
        this.isHoveringOverButton = false;
        if (!this.isHoveringOverItems) {
            programsItemsElement.style.visibility = 'hidden';
        }
    });

    programsItemsElement.addEventListener('mouseover', () => {
        this.isHoveringOverItems = true;
        programsItemsElement.style.visibility = 'visible';
    });
    programsItemsElement.addEventListener('mouseleave', () => {
        this.isHoveringOverItems = false;
        if (!this.isHoveringOverButton) {
            programsItemsElement.style.visibility = 'hidden';
        }
    });


}

function setTaskbar() {
    const desktop = document.querySelector('.desktop');
    const tasksContainer = document.querySelector('.tasks');
    const pictogramsContainer = document.querySelector('.pictograms');
    const programsElement = document.querySelector('.programs-inner');

    // Clear existing taskbar buttons
    tasksContainer.innerHTML = '';

    // Clear existing pictograms
    pictogramsContainer.innerHTML = '';

    // Clear existing programs
    programsElement.innerHTML = '';

    // Iterate over each child element of .desktop
    for (let i = 0; i < desktop.children.length; i++) {
        const desktopItem = desktop.children[i];
        const taskTitlePre = desktopItem.tagName.split("-")[0]; // Example: inbox-X -> inbox
        const taskTitle = taskTitlePre.split("_")[0]; // Example: blocks_component -> blocks
        const CapTaskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1).toLowerCase();
        const fileTitle = taskTitlePre.toLowerCase();

        // Append program to programs list
        this.programs.push({
            tagname: desktopItem.tagName,
            isClosed: true,
        });
        desktopItem.style.visibility = 'hidden';

        // Append a taskbar button for each desktop item
        tasksContainer.innerHTML += `
            <div class="task outer-border-button">
                <div class="inner-border-button">
                    <img class="task-icon" src="../assets/${fileTitle}/logo.png" style="width: 16px; height: 16px;">
                    <div class="task-title">${CapTaskTitle}</div>
                </div>
            </div>`;

        if (this.programs[i].isClosed) {
            tasksContainer.children[i].style.display = 'none';
        }

        // Append a pictogram for each desktop item
        pictogramsContainer.innerHTML += `
            <div class="pictogram">
                <img class="pictogram-logo" src="../assets/${fileTitle}/logo.png" draggable="false">
                <div class="pictogram-title">${CapTaskTitle}</div>
            </div>`;

        if (CapTaskTitle === 'Settings') {
            pictogramsContainer.children[i].style.display = 'none';
        }

        // Append program button for each desktop item
        programsElement.innerHTML += `
            <div class="startmenu-item">
                <img class="task-icon" src="../assets/${fileTitle}/logo.png">
                <div class="task-title
                ">${CapTaskTitle}</div>
            </div>`;

        // Add foreground mechanism
        desktopItem.style.zIndex = 0;
        desktopItem.addEventListener('mousedown', () => {
            this.setForegroundApp(i);
            this.updateTaskbar();
        });

        // Add window minimizing
        const minimizeButton = desktopItem.querySelector('.window-control:first-child');
        minimizeButton.addEventListener('click', () => {
            desktopItem.style.visibility = 'hidden';
        });
    }

    for (let i = 0; i < desktop.children.length; i++) {
        this.addTaskEventListener(tasksContainer.children[i], i);
        this.addPictogramEventListener(pictogramsContainer.children[i], i);
        this.addProgramEventListener(programsElement.children[i], i);

        // close window
        const closeButton = desktop.children[i].querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.closeWindow(i);
            this.updateTaskbar();
        });
    }

    // selected pictogram resetter
    document.addEventListener('click', (e) => {
        const isPictogram = e.target.closest('.pictogram');
        if (!isPictogram) {
            for (let i = 0; i < pictogramsContainer.children.length; i++) {
                pictogramsContainer.children[i].querySelector('.pictogram-title').style.backgroundColor = 'transparent';
                pictogramsContainer.children[i].style.border = 'none';
            }
        }

        // exit start menu if clicked anywhere else
        const isStartMenu = e.target.closest('.startmenu') || e.target.closest('.start') || e.target.closest('.programs');
        if (!isStartMenu) {
            document.querySelector('.startmenu').style.visibility = 'hidden';
            document.querySelector('.programs').style.visibility = 'hidden';
        }

        this.updateTaskbar();
    });

    this.setWindowDragging();
}

function windowOutOfBoundsCorrector(desktopItem) {
    const desktop = document.querySelector('.desktop');
    const desktopWidth = document.querySelector('.homescreen').clientWidth;
    const desktopItemWidth = desktopItem.querySelector('.window').clientWidth;
    const desktopItemHeight = desktopItem.querySelector('.window').clientHeight;

    if (parseInt(desktopItem.style.left) < (- desktopItemWidth / 3)) {
        desktopItem.style.left = (- desktopItemWidth / 3) + 'px';
    } else if (parseInt(desktopItem.style.left) > (desktopWidth - (desktopItemWidth * 2 / 3))) {
        desktopItem.style.left = desktopWidth - (desktopItemWidth * 2 / 3) + 'px';
    }
    if (desktopItem.style.top.includes('-')) {
        desktopItem.style.top = 0;
    } else if (parseInt(desktopItem.style.top) > (desktop.clientHeight - (desktopItemHeight / 2))) {
        desktopItem.style.top = desktop.clientHeight - (desktopItemHeight / 2) + 'px';
    }
}

function setForegroundApp(index) {
    const desktop = document.querySelector('.desktop');
    const desktopItem = desktop.children[index];
    for (let j = 0; j < desktop.children.length; j++) {
        desktop.children[j].style.zIndex = 0;
    }
    desktopItem.style.zIndex = 1;
}

function addTaskEventListener(taskElement, index) {
    taskElement.addEventListener('click', () => {
        this.windowVisibility(index, true);
    });
}

function addPictogramEventListener(pictogramElement, index) {
    pictogramElement.addEventListener('click', () => {
        this.pictogramTitleColor(index);
    });
    pictogramElement.addEventListener('dblclick', () => {
        this.windowVisibility(index, false);
        this.updateTaskbar();
    });
}

function addProgramEventListener(programElement, index) {
    programElement.addEventListener('click', () => {
        this.windowVisibility(index, false);
        document.querySelector('.programs').style.visibility = 'hidden';
        document.querySelector('.startmenu').style.visibility = 'hidden';
    });
}

function updateTaskbar() {
    const tasks = document.querySelector('.tasks').children;
    for (let i = 0; i < tasks.length; i++) {
        const window = document.querySelector('.desktop').children[i];
        const task = tasks[i];
        if (window.style.visibility === 'hidden') {
            task.classList.remove('selected-task');
            task.style.backgroundColor = 'var(--medium-grey-color)';
            task.style.backgroundImage = 'none';
        } else if (window.style.zIndex === '1') {
            task.classList.add('selected-task');
            task.style.backgroundImage = '';
            task.style.backgroundColor = '';
        } else {
            task.classList.remove('selected-task');
            task.style.backgroundColor = '';
        }
    }
}

function windowVisibility(i, allowHiding = true) {
    const desktop = document.querySelector('.desktop');
    const tasksContainer = document.querySelector('.tasks');
    if (desktop.children[i].style.visibility !== 'hidden' && allowHiding && desktop.children[i].style.zIndex === '1') {
        desktop.children[i].style.visibility = 'hidden';
    } else {
        desktop.children[i].style.visibility = 'visible';
        tasksContainer.children[i].style.display = '';
        this.programs[i].isClosed = false;
        this.setForegroundApp(i);
    }
}

function closeWindow(i) {
    const desktop = document.querySelector('.desktop');
    const tasksContainer = document.querySelector('.tasks');
    desktop.children[i].style.visibility = 'hidden';
    tasksContainer.children[i].style.display = 'none';
    this.programs[i].isClosed = true;
}

function pictogramTitleColor(i) {
    const pictogramsContainer = document.querySelector('.pictograms');
    for (let j = 0; j < pictogramsContainer.children.length; j++) {
        pictogramsContainer.children[j].querySelector('.pictogram-title').style.backgroundColor = 'transparent';
        pictogramsContainer.children[j].style.border = 'none';
    }
    pictogramsContainer.children[i].querySelector('.pictogram-title').style.backgroundColor = 'var(--windows-purple)';
    pictogramsContainer.children[i].style.border = '1px dotted var(--light-grey-color)';
}

function arrangeWindows(margin_in_px, spacing_in_px) {
    let x = margin_in_px;
    let y = margin_in_px;
    for (let i = 0; i < document.querySelector('.desktop').children.length; i++) {
        const desktopItem = document.querySelector('.desktop').children[i];
        desktopItem.style.position = 'absolute';
        desktopItem.style.left = x + 'px';
        desktopItem.style.top = y + 'px';
        x += spacing_in_px;
        y += spacing_in_px;
        if (x + desktopItem.clientWidth > window.innerWidth || y + desktopItem.clientHeight > window.innerHeight) {
            x = margin_in_px;
            y = margin_in_px;
            y += spacing_in_px;
        }
    }
}

function setWindowDragging() {
    const desktop = document.querySelector('.desktop');
    for (let i = 0; i < desktop.children.length; i++) {
        const desktopItem = desktop.children[i];
        desktopItem.draggable = false;
        desktopItem.dragData = {};

        const titlebar = desktopItem.querySelector('.window-title-bar');
        titlebar.addEventListener('mousedown', (event) => {
            event.preventDefault();
            const isWindowControl = event.target.closest('.window-controls');

            if (!isWindowControl) {
                desktopItem.draggable = true;
                desktopItem.dragData = {
                    offsetX: event.offsetX + desktopItem.parentElement.parentElement.getBoundingClientRect().left,
                    offsetY: event.offsetY + desktopItem.parentElement.parentElement.getBoundingClientRect().top
                };
            };
        });
        document.addEventListener('mouseup', () => {
            desktopItem.draggable = false;
            this.windowOutOfBoundsCorrector(desktopItem);
        });
        document.addEventListener('mousemove', (event) => {
            const window = desktopItem.querySelector('.window');

            if (desktopItem.draggable) {
                const x = event.clientX - desktopItem.dragData.offsetX;
                const y = event.clientY - desktopItem.dragData.offsetY;
                desktopItem.style.position = 'absolute';
                if (x >= (- window.clientWidth / 3) && x <= (document.body.offsetWidth - (window.clientWidth * 2 / 3))) {
                    desktopItem.style.left = x + 'px';
                }
                if (y >= 0 && y <= (document.querySelector('.homescreen').offsetHeight - (window.clientHeight / 2))) {
                    desktopItem.style.top = y + 'px';
                }

            }
        });
    }

}

function updateTime() {
    const timeElement = document.querySelector('.time');
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    // Update the content of the .time element with the current time
    timeElement.children[0].textContent = hours;
    timeElement.children[2].textContent = minutes;
}