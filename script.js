//Get DOM elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('taskCounter');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let currentFilter = 'all'; // default to show all

// Load tasks from localStorage or initialize with empty array
let tasks= JSON.parse(localStorage.getItem('tasks')) || [];

// Function to render tasks to the screen
function renderTasks(){
    taskList.innerHTML = '';
let filteredTasks = tasks;
if (currentFilter === 'active') {
  filteredTasks = tasks.filter(task => !task.completed);
} else if (currentFilter === 'completed') {
  filteredTasks = tasks.filter(task => task.completed);
}

filteredTasks.forEach(task => {
    const index = tasks.indexOf(task);

    const li = document.createElement('li');
    
      const activeCount = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
// Checkbox for marking task as completed
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveAndRender();
    };   

// Span for task text
    const span = document.createElement('span');
    span.textContent = task.text;

// Apply completed style
    if (task.completed) {
      span.style.textDecoration = 'line-through';
      span.style.opacity = '0.6';
    }
  // Enable inline editing on double-click
span.addEventListener('dblclick', () => {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = task.text;
  input.className = 'edit-input';  
  
    // Replace span with input
  li.replaceChild(input, span);
  input.focus();

  // Save on blur or Enter key
  const saveEdit = () => {
    const newText = input.value.trim();
    if (newText) {
      task.text = newText;
      saveAndRender();
    } else {
      // Cancel if input is empty
      saveAndRender();
    }
  };

  input.addEventListener('blur', saveEdit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  });
});
    // Delete button
const delBtn = document.createElement('button');
delBtn.textContent = '❌';
 delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveAndRender();
    };

   // Append elements to the list item
li.appendChild(checkbox);
li.appendChild(span);     
li.appendChild(delBtn);
    taskList.appendChild(li);
});
}

// Save tasks to localStorage and re-render
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Add button click handler
addBtn.addEventListener('click', () => {
  const task = taskInput.value.trim();
  if (task) {
    tasks.push({ text: task, completed: false });
    taskInput.value = '';
    saveAndRender();
  }
});

//filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter');
    renderTasks();
  });
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Change button text accordingly
  if(document.body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = '☀️ Light Mode';
  } else {
    darkModeToggle.textContent = '🌙 Dark Mode';
  }
});

//Initial render
renderTasks();



