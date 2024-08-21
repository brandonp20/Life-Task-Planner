// todoFunctions.js
(function() {
    let mainSortable, subitemSortables = [];

    function initSortable() {
        var el = document.getElementById('actual-todo-item-list');
        mainSortable = Sortable.create(el, {
            animation: 150,
            ghostClass: 'blue-background-class'
        });
        initSubitemSortables();
    }

    function initSubitemSortables() {
        subitemSortables.forEach(s => s.destroy());
        subitemSortables = [];

        document.querySelectorAll('.subitem-container').forEach(function(el) {
            subitemSortables.push(Sortable.create(el, {
                animation: 150,
                ghostClass: 'blue-background-class',
                group: el.dataset.groupId,
                handle: '.subitem-handle'
            }));
        });
    }

    function addTodo() {
        var input = document.getElementById("new-todo-item-input");
        var todoText = input.value.trim();
        
        if (todoText !== "") {
            var li = createTodoItem(todoText);
            document.getElementById("actual-todo-item-list").appendChild(li);
            input.value = "";
            initSubitemSortables();
        }
    }

    function createTodoItem(text) {
        var li = document.createElement("li");
        li.className = 'todo-item-wrapper';
    
        var mainDiv = document.createElement("div");
        mainDiv.className = 'todo-main';
    
        var dropdownButton = createButton("▼", toggleSubitems);
        dropdownButton.classList.add('dropdown-btn');
        mainDiv.appendChild(dropdownButton);
    
        var todoSpan = document.createElement("span");
        todoSpan.textContent = text;
        todoSpan.classList.add('todo-text');
        mainDiv.appendChild(todoSpan);
    
        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "todo-buttons";
    
        var deleteButton = createButton("−", function() {
            li.remove();
            initSubitemSortables();
            updateMainItemsVisibility();
        });
        deleteButton.classList.add('delete-btn');
    
        var checkButton = createButton("✓", function() {
            toggleItemCompletion(li);  // Pass 'li' as an argument here
        });
        checkButton.classList.add('check-btn');
    
        var dueDateButton = createButton("📅", function() {
            setDueDate(li);
        });
        dueDateButton.classList.add('due-date-btn');
    
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(checkButton);
        buttonsDiv.appendChild(dueDateButton);
        mainDiv.appendChild(buttonsDiv);
    
        li.appendChild(mainDiv);
    
        var subContainer = createSubitemContainer();
        ensureSubitemInput(subContainer);
        li.appendChild(subContainer);
    
        return li;
    }

    function toggleItemCompletion(item) {
        if (!item) {
            console.error('Item is undefined in toggleItemCompletion');
            return;
        }
        item.classList.toggle('completed');
        var todoList = document.getElementById('actual-todo-item-list');
        var completedList = document.getElementById('completed-todo-item-list');
        
        if (item.classList.contains('completed')) {
            completedList.appendChild(item);
        } else {
            todoList.appendChild(item);
        }
        
        var subContainer = item.querySelector('.subitem-container');
        if (subContainer) {
            updateSubitemsVisibility(subContainer);
        }
    }

    function toggleSubitems() {
        var li = this.closest('.todo-item-wrapper');
        var subContainer = li.querySelector('.subitem-container');
        if (subContainer) {
            subContainer.style.display = subContainer.style.display === 'none' ? 'block' : 'none';
            this.textContent = subContainer.style.display === 'none' ? '▼' : '▲';
            
            if (subContainer.style.display === 'block') {
                ensureSubitemToggle(subContainer);
            }
        }
    }

    function createSubitemContainer() {
        var subContainer = document.createElement('div');
        subContainer.className = 'subitem-container';
        subContainer.style.display = 'none';
        subContainer.dataset.groupId = 'group-' + Date.now();
        return subContainer;
    }

    function ensureSubitemInput(subContainer) {
        if (!subContainer.querySelector('.subitem-input-wrapper')) {
            var subItemInput = createSubitemInput();
            subContainer.appendChild(subItemInput);
        }
    }

    function ensureSubitemToggle(subContainer) {
        if (!subContainer.querySelector('.subitem-toggle')) {
            var toggleButton = createButton(
                "Hide Completed",
                function() { toggleCompletedSubitems(subContainer); }
            );
            toggleButton.className = 'subitem-toggle';
            subContainer.insertBefore(toggleButton, subContainer.firstChild);
        }
    }

    function createSubitemInput() {
        var inputWrapper = document.createElement('div');
        inputWrapper.className = 'subitem-input-wrapper';

        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'subitem-input';
        input.placeholder = 'Add a subtask...';

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                var subitem = createSubitem(this.value.trim());
                var subContainer = this.closest('.subitem-container');
                subContainer.insertBefore(subitem, this.parentNode);
                this.value = '';
                initSubitemSortables();
                updateSubitemsVisibility(subContainer);
            }
        });

        inputWrapper.appendChild(input);
        return inputWrapper;
    }

    function createSubitem(text) {
        var subitem = document.createElement("div");
        subitem.className = 'subitem';

        var subitemHandle = document.createElement("span");
        subitemHandle.textContent = "☰";
        subitemHandle.className = 'subitem-handle';
        subitem.appendChild(subitemHandle);

        var subitemSymbol = document.createElement("span");
        subitemSymbol.textContent = "◦";
        subitemSymbol.classList.add('subitem-symbol');
        subitem.appendChild(subitemSymbol);

        var subitemSpan = document.createElement("span");
        subitemSpan.textContent = text;
        subitemSpan.classList.add('subitem-text');
        subitem.appendChild(subitemSpan);

        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "subitem-buttons";

        var deleteButton = createButton("−", function() {
            subitem.remove();
            initSubitemSortables();
            updateSubitemsVisibility(subitem.closest('.subitem-container'));
        });
        deleteButton.classList.add('delete-btn');

        var checkButton = createButton("✓", function() {
            subitem.classList.toggle('completed');
            updateSubitemsVisibility(subitem.closest('.subitem-container'));
        });
        checkButton.classList.add('check-btn');

        var dueDateButton = createButton("📅", function() {
            setDueDate(subitem);
        });
        dueDateButton.classList.add('due-date-btn');

        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(checkButton);
        buttonsDiv.appendChild(dueDateButton);
        subitem.appendChild(buttonsDiv);

        return subitem;
    }

    function createButton(text, onclick) {
        var button = document.createElement("button");
        button.textContent = text;
        button.onclick = onclick;
        return button;
    }

    function setDueDate(element) {
        var currentDate = element.dataset.dueDate ? new Date(element.dataset.dueDate) : new Date();
        var dueDateInput = document.createElement('input');
        dueDateInput.type = 'date';
        dueDateInput.value = currentDate.toISOString().split('T')[0];
        
        dueDateInput.onchange = function() {
            element.dataset.dueDate = this.value;
            updateDueDateDisplay(element);
            this.remove();
        };
        
        element.appendChild(dueDateInput);
        dueDateInput.showPicker();
    }

    function updateDueDateDisplay(element) {
        var existingDisplay = element.querySelector('.due-date-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        if (element.dataset.dueDate) {
            var display = document.createElement('span');
            display.className = 'due-date-display';
            display.textContent = ' Due: ' + new Date(element.dataset.dueDate).toLocaleDateString();
            element.querySelector('.todo-text, .subitem-text').appendChild(display);
        }
    }

    function toggleCompletedSubitems(subContainer) {
        subContainer.classList.toggle('hide-completed-subitems');
        updateSubitemsVisibility(subContainer);
        var toggleButton = subContainer.querySelector('.subitem-toggle');
        toggleButton.textContent = subContainer.classList.contains('hide-completed-subitems') 
            ? "Show Completed" 
            : "Hide Completed";
    }

    function updateSubitemsVisibility(subContainer) {
        var hideCompleted = subContainer.classList.contains('hide-completed-subitems');
        subContainer.querySelectorAll('.subitem').forEach(function(subitem) {
            if (hideCompleted && subitem.classList.contains('completed')) {
                subitem.style.display = 'none';
            } else {
                subitem.style.display = '';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        initSortable();
        
        var todoList = document.getElementById('actual-todo-item-list');
        var newTodoInput = document.getElementById('new-todo-item-input');
        var addTodoButton = document.getElementById('new-todo-add-button');
        
        var inputContainer = document.createElement('div');
        inputContainer.className = 'add-new-todo-item-container';
        inputContainer.appendChild(newTodoInput);
        inputContainer.appendChild(addTodoButton);
        
        todoList.parentNode.insertBefore(inputContainer, todoList);
    });

    window.todoFunctions = {
        addTodo: addTodo,
        initSortable: initSortable
    };
})();