// DOM Elements
const noteInput = document.querySelector('.note-input textarea');
const addBtn = document.querySelector('.note-actions .material-symbols-outlined:first-child');
const notesContainer = document.querySelector('.notes-container');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const navbarIcons = document.querySelectorAll('.navbar .material-symbols-outlined');


// Load notes from local storage on page load
document.addEventListener('DOMContentLoaded', displayNotes);

function setReminder() {
    const reminderTime = prompt('Set a reminder time (e.g., "2023-10-10T10:00")');
    if (reminderTime) {
        const noteText = noteInput.value.trim();
        if (noteText !== '') {
            const reminder = {
                text: noteText,
                time: new Date(reminderTime).getTime()
            };
            localStorage.setItem('reminder', JSON.stringify(reminder));
            alert(`Reminder set for ${reminderTime}`);
        }
    }
}

// Add event listeners to sidebar items
sidebarItems.forEach(item => {
    const h3Text = item.querySelector('h3');
    h3Text.style.display = 'none'; // Hide h3 text by default

    // Add mouseenter event to show h3 text when mouse hovers over the sidebar item
    item.addEventListener('mouseenter', () => {
        h3Text.style.display = 'block';
    });


    item.addEventListener('click', () => {
        const action = h3Text.textContent.toLowerCase();
        handleSidebarAction(action);
        
        // Show the h3 text
        h3Text.style.display = 'block';

        // Clear previous timeout to hide h3 text

        clearTimeout(timeoutId);

        // Set a timeout to hide the h3 text after 3 seconds of inactivity
        timeoutId = setTimeout(() => {
            h3Text.style.display = 'none';
        }, 3000);
    });

    // Add mouseleave event to hide h3 text when mouse leaves the sidebar item
    item.addEventListener('mouseleave', () => {
        h3Text.style.display = 'none';
    });

    item.addEventListener('mouseleave', () => {
        h3Text.style.display = 'none';
    });

});

let timeoutId;

// Add event listeners to navbar icons
navbarIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const action = icon.textContent;
        handleNavbarAction(action);
    });
});

// Handle sidebar actions
function handleSidebarAction(action) {    

    switch(action) {
        case 'notes':
            displayNotes();
            break;
        case 'reminders':
            setReminder();
            break;
        case 'archive':
            displayArchivedNotes();
            break;
        case 'trash':
            alert('Trash feature coming soon!');
            break;
        case 'notifications':
            alert('Notifications feature coming soon!');
            break;
        case 'labels':
            alert('Labels feature coming soon!');
            break;
        case 'create new label':
            const labelName = prompt('Enter new label name:');
            if (labelName) {
                alert(`Created new label: ${labelName}`);
            }
            break;
        case 'help':
            alert('Help feature coming soon!');
            break;
        case 'settings':
            alert('Settings feature coming soon!');
            break;
        case 'account':
            alert('Account feature coming soon!');
            break;
        case 'logout':
            if (confirm('Are you sure you want to logout?')) {
                alert('Logged out successfully!');
            }
            break;
        default:
            console.log('Unknown sidebar action:', action);
    }
}

// Handle navbar actions
function handleNavbarAction(action) {
    switch(action) {
        case 'menu':
            alert('Menu feature coming soon!');
            break;
        case 'search':
            document.querySelector('.search-bar input').focus();
            break;
        case 'refresh':
            location.reload();
            break;
        case 'settings':
            alert('Settings feature coming soon!');
            break;
        case 'account_circle':
            alert('Account feature coming soon!');
            break;
        default:
            console.log('Unknown navbar action:', action);
    }
}

// Add note event listeners
addBtn.addEventListener('click', addNote);
noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNote();
    }
});

// Add note function
function addNote() {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        // Create note element
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <p>${noteText}</p>
            <span class="material-symbols-outlined delete-btn">delete</span>
        `;
        
        // Add delete functionality
        const deleteBtn = noteElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            noteElement.remove();
            saveNotes();
        });

        // Add to container and save
        notesContainer.appendChild(noteElement);
        noteInput.value = '';
        saveNotes();
    }
}

// Display saved notes
function displayNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(noteText => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <p>${noteText}</p>
            <span class="material-symbols-outlined delete-btn">delete</span>
        `;
        
        // Add delete functionality
        const deleteBtn = noteElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            noteElement.remove();
            saveNotes();
        });

        notesContainer.appendChild(noteElement);
    });
}

// Archive note function
function archiveNote(noteElement) {
    const archivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
    const noteText = noteElement.querySelector('p').textContent;
    archivedNotes.push(noteText);
    localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
    noteElement.remove();
    saveNotes();
}

// Display archived notes
function displayArchivedNotes() {
    const archivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
    notesContainer.innerHTML = ''; // Clear current notes
    archivedNotes.forEach(noteText => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <p>${noteText}</p>
            <span class="material-symbols-outlined restore-btn">restore</span>
        `;
        
        // Add restore functionality
        const restoreBtn = noteElement.querySelector('.restore-btn');
        restoreBtn.addEventListener('click', () => {
            restoreNote(noteText);
            noteElement.remove();
        });

        notesContainer.appendChild(noteElement);
    });
}

function restoreNote(noteText) {
    const archivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
    const updatedNotes = archivedNotes.filter(note => note !== noteText);
    localStorage.setItem('archivedNotes', JSON.stringify(updatedNotes));
    addNoteToDisplay(noteText);
}

function addNoteToDisplay(noteText) {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.innerHTML = `
        <p>${noteText}</p>
        <span class="material-symbols-outlined delete-btn">delete</span>
    `;
    
    // Add delete functionality
    const deleteBtn = noteElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        noteElement.remove();
        saveNotes();
    });

    notesContainer.appendChild(noteElement);
}

// Save notes to local storage
function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note p').forEach(note => {
        notes.push(note.textContent);
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}
