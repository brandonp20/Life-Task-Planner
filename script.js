let dailyPlans = {};
let weeklyPlans = {};
let monthlyPlans = {};
let quarterlyPlans = {};
let yearlyPlans = {};

document.addEventListener('DOMContentLoaded', function() {
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    darkModeToggle.addEventListener('click', function() {
        htmlElement.classList.toggle('dark-mode');

        const savedDailyPlans = localStorage.getItem('dailyPlans');
        const savedWeeklyPlans = localStorage.getItem('weeklyPlans');
        
        if (savedDailyPlans) {
            dailyPlans = JSON.parse(savedDailyPlans);
        }
        
        if (savedWeeklyPlans) {
            weeklyPlans = JSON.parse(savedWeeklyPlans);
        }

        updateDayLabel();
        updateWeekLabel();
        updateMonthLabel();
        updateQuarterLabel();
        updateYearLabel();
        
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
    let currentDate = new Date();
    updateDayLabel();
    updateWeekLabel();
    updateMonthLabel();
    updateQuarterLabel();
    updateYearLabel();

    document.getElementById('prevDay').addEventListener('click', () => navigateDay(-1));
    document.getElementById('nextDay').addEventListener('click', () => navigateDay(1));
    document.getElementById('prevWeek').addEventListener('click', () => navigateWeek(-1));
    document.getElementById('nextWeek').addEventListener('click', () => navigateWeek(1));
    document.getElementById('prevMonth').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => navigateMonth(1));
    document.getElementById('prevQuarter').addEventListener('click', () => navigateQuarter(-1));
    document.getElementById('nextQuarter').addEventListener('click', () => navigateQuarter(1));
    document.getElementById('prevYear').addEventListener('click', () => navigateYear(-1));
    document.getElementById('nextYear').addEventListener('click', () => navigateYear(1));

    function navigateDay(delta) {
        currentDate.setDate(currentDate.getDate() + delta);
        updateDayLabel();
    }

    function navigateWeek(delta) {
        currentDate.setDate(currentDate.getDate() + (delta * 7));
        updateWeekLabel();
    }

    function navigateMonth(delta) {
        currentDate.setMonth(currentDate.getMonth() + delta);
        updateMonthLabel();
    }
    
    function navigateYear(delta) {
        currentDate.setFullYear(currentDate.getFullYear() + delta);
        updateYearLabel();
    }
    
    function navigateQuarter(delta) {
        currentDate.setMonth(currentDate.getMonth() + (delta * 3));
        updateQuarterLabel();
    }

    function updateDayLabel() {
        const options = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };
        const dateStr = currentDate.toLocaleDateString(undefined, options);
        document.getElementById('dayLabel').textContent = `Daily Plan - ${dateStr}`;
        
        const dailyKey = currentDate.toISOString().split('T')[0];
        const dailyTextarea = document.getElementById('dailyPlanner');
        dailyTextarea.value = dailyPlans[dailyKey] || '';
        console.log(dailyKey);
        console.log(dailyTextarea.value);
        
        dailyTextarea.onchange = function() {
            dailyPlans[dailyKey] = this.value;
            localStorage.setItem('dailyPlans', JSON.stringify(dailyPlans));
        };
    }
    
    function updateWeekLabel() {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const options = { month: '2-digit', day: '2-digit', year: '2-digit' };
        const startStr = startOfWeek.toLocaleDateString(undefined, options);
        document.getElementById('weekLabel').textContent = `Weekly Plan - ${startStr}`;
        
        const weeklyKey = startOfWeek.toISOString().split('T')[0];
        const weeklyTextarea = document.getElementById('weeklyPlanner');
        weeklyTextarea.value = weeklyPlans[weeklyKey] || '';
        
        weeklyTextarea.onchange = function() {
            weeklyPlans[weeklyKey] = this.value;
            localStorage.setItem('weeklyPlans', JSON.stringify(weeklyPlans));
        };
    }

    function updateYearLabel() {
        const year = currentDate.getFullYear();
        document.getElementById('yearLabel').textContent = `Annual Plan - ${year}`;
        
        const yearlyKey = year.toString();
        const yearlyTextarea = document.getElementById('yearlyPlanner');
        yearlyTextarea.value = yearlyPlans[yearlyKey] || '';
        
        yearlyTextarea.onchange = function() {
            yearlyPlans[yearlyKey] = this.value;
            localStorage.setItem('yearlyPlans', JSON.stringify(yearlyPlans));
        };
    }
    
    function updateQuarterLabel() {
        const year = currentDate.getFullYear();
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        document.getElementById('quarterLabel').textContent = `Quarterly Plan - Q${quarter} ${year}`;
        
        const quarterlyKey = `${year}-Q${quarter}`;
        const quarterlyTextarea = document.getElementById('quarterlyPlanner');
        quarterlyTextarea.value = quarterlyPlans[quarterlyKey] || '';
        
        quarterlyTextarea.onchange = function() {
            quarterlyPlans[quarterlyKey] = this.value;
            localStorage.setItem('quarterlyPlans', JSON.stringify(quarterlyPlans));
        };
    }
    
    function updateMonthLabel() {
        const options = { year: 'numeric', month: '2-digit' };
        const monthStr = currentDate.toLocaleDateString(undefined, options);
        document.getElementById('monthLabel').textContent = `Monthly Plan - ${monthStr}`;
        
        const monthlyKey = currentDate.toISOString().slice(0, 7); // YYYY-MM format
        const monthlyTextarea = document.getElementById('monthlyPlanner');
        monthlyTextarea.value = monthlyPlans[monthlyKey] || '';
        
        monthlyTextarea.onchange = function() {
            monthlyPlans[monthlyKey] = this.value;
            localStorage.setItem('monthlyPlans', JSON.stringify(monthlyPlans));
        };
    }
});

function addTodo() {
    var input = document.getElementById("newTodo");
    var todoText = input.value.trim();
    
    if (todoText !== "") {
        var li = document.createElement("li");
        var todoSpan = document.createElement("span");
        todoSpan.textContent = todoText;
        todoSpan.classList.add('todo-text');
        li.appendChild(todoSpan);
        
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function() {
            li.remove();
        };
        
        li.appendChild(deleteButton);
        document.getElementById("todoList").appendChild(li);
        input.value = "";
    }
}

// Allow adding a todo by pressing Enter
document.getElementById("newTodo").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// Slide-out functionality
document.addEventListener('DOMContentLoaded', function() {
    const monthlyToggle = document.getElementById('monthly-toggle');
    const slideOut = document.querySelector('.slide-out');
    const arrow = monthlyToggle.querySelector('.arrow');

    monthlyToggle.addEventListener('click', function() {
        slideOut.classList.toggle('active');
        monthlyToggle.classList.toggle('active');
        arrow.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.login-button');
    const loginOverlay = document.querySelector('.login-container');
    const mainContainer = document.querySelector('.container');
    const loginCloseButton = document.querySelector('.login-container-close-button');

    if (!loginButton || !loginOverlay || !mainContainer || !loginCloseButton) {
        console.error('One or more required elements are missing');
        return;
    }

    function showLogin() {
        loginOverlay.style.display = 'flex';
        mainContainer.style.opacity = '0.25';
        mainContainer.style.pointerEvents = 'none';
    }

    function hideLogin() {
        loginOverlay.style.display = 'none';
        mainContainer.style.opacity = '1';
        mainContainer.style.pointerEvents = 'auto';
    }

    loginButton.addEventListener('click', showLogin);
    loginCloseButton.addEventListener('click', hideLogin);
});