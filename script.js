let dailyPlans = {};
let weeklyPlans = {};

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

    document.getElementById('prevDay').addEventListener('click', () => navigateDay(-1));
    document.getElementById('nextDay').addEventListener('click', () => navigateDay(1));
    document.getElementById('prevWeek').addEventListener('click', () => navigateWeek(-1));
    document.getElementById('nextWeek').addEventListener('click', () => navigateWeek(1));

    function navigateDay(delta) {
        currentDate.setDate(currentDate.getDate() + delta);
        updateDayLabel();
    }

    function navigateWeek(delta) {
        currentDate.setDate(currentDate.getDate() + (delta * 7));
        updateWeekLabel();
    }

    function updateDayLabel() {
        const options = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };
        const dateStr = currentDate.toLocaleDateString(undefined, options);
        document.getElementById('dayLabel').textContent = `Daily Plan - ${dateStr}`;
        
        const dailyKey = currentDate.toISOString().split('T')[0];
        const dailyTextarea = document.getElementById('dailyPlanner');
        dailyTextarea.value = dailyPlans[dailyKey] || '';
        
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