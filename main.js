// main.js
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    darkModeToggle.addEventListener('click', function() {
        htmlElement.classList.toggle('dark-mode');

        const savedDailyPlans = localStorage.getItem('dailyPlans');
        const savedWeeklyPlans = localStorage.getItem('weeklyPlans');
        
        if (savedDailyPlans) {
            dateFunctions.dailyPlans = JSON.parse(savedDailyPlans);
        }
        
        if (savedWeeklyPlans) {
            dateFunctions.weeklyPlans = JSON.parse(savedWeeklyPlans);
        }

        dateFunctions.updateDayLabel();
        dateFunctions.updateWeekLabel();
        dateFunctions.updateMonthLabel();
        dateFunctions.updateQuarterLabel();
        dateFunctions.updateYearLabel();
        
        // Save the user's preference
        if (htmlElement.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        htmlElement.classList.add('dark-mode');
    }

    // Day and Week navigation
    dateFunctions.updateDayLabel();
    dateFunctions.updateWeekLabel();
    dateFunctions.updateMonthLabel();
    dateFunctions.updateQuarterLabel();
    dateFunctions.updateYearLabel();

    document.getElementById('prevDay').addEventListener('click', () => dateFunctions.navigateDay(-1));
    document.getElementById('nextDay').addEventListener('click', () => dateFunctions.navigateDay(1));
    document.getElementById('prevWeek').addEventListener('click', () => dateFunctions.navigateWeek(-1));
    document.getElementById('nextWeek').addEventListener('click', () => dateFunctions.navigateWeek(1));
    document.getElementById('prevMonth').addEventListener('click', () => dateFunctions.navigateMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => dateFunctions.navigateMonth(1));
    document.getElementById('prevQuarter').addEventListener('click', () => dateFunctions.navigateQuarter(-1));
    document.getElementById('nextQuarter').addEventListener('click', () => dateFunctions.navigateQuarter(1));
    document.getElementById('prevYear').addEventListener('click', () => dateFunctions.navigateYear(-1));
    document.getElementById('nextYear').addEventListener('click', () => dateFunctions.navigateYear(1));

    // Allow adding a todo by pressing Enter
    document.getElementById("new-todo-item-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            todoFunctions.addTodo();
        }
    });

    document.getElementById("new-todo-add-button").addEventListener('click', function() {
        todoFunctions.addTodo();
    });

    // Slide-out functionality
    const monthlyToggle = document.getElementById('monthly-toggle');
    const slideOut = document.querySelector('.slide-out');
    const arrow = monthlyToggle.querySelector('.arrow');

    monthlyToggle.addEventListener('click', function() {
        slideOut.classList.toggle('active');
        monthlyToggle.classList.toggle('active');
        arrow.classList.toggle('active');
    });

    // Login functionality
    const loginButton = document.querySelector('.login-button');
    const loginOverlay = document.querySelector('.login-container');
    const mainContainer = document.querySelector('.container');
    const loginCloseButton = document.querySelector('.login-container-close-button');

    // Initialize login functions
    if (!loginFunctions.initialize(loginOverlay, mainContainer)) {
        console.error('Failed to initialize login functions');
        return;
    }

    loginButton.addEventListener('click', loginFunctions.showLogin);
    loginCloseButton.addEventListener('click', loginFunctions.hideLogin);

    // Initialize todo functionality
    todoFunctions.initSortable();
    
    const todoList = document.getElementById('actual-todo-item-list');
    const newTodoInput = document.getElementById('new-todo-item-input');
    const addTodoButton = document.getElementById('new-todo-add-button');
    
    // Note: The following lines are not needed if your HTML already includes these elements
    // const inputContainer = document.createElement('div');
    // inputContainer.className = 'add-new-todo-item-container';
    // inputContainer.appendChild(newTodoInput);
    // inputContainer.appendChild(addTodoButton);
    // todoList.parentNode.insertBefore(inputContainer, todoList);

    const completedItemsHeader = document.getElementById('completed-items-header');
    const completedList = document.getElementById('completed-todo-item-list');
    const dropdownArrow = completedItemsHeader.querySelector('.dropdown-arrow');

    completedItemsHeader.addEventListener('click', function() {
        const isHidden = completedList.style.display === 'none';
        completedList.style.display = isHidden ? 'block' : 'none';
        dropdownArrow.textContent = isHidden ? '▲' : '▼';
    });
});