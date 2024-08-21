// todoFunctions.js
(function() {
    let sortable;

    function initSortable() {
        var el = document.getElementById('todoList');
        sortable = Sortable.create(el, {
            animation: 150,
            ghostClass: 'blue-background-class'
        });
    }

    function addTodo() {
        var input = document.getElementById("newTodo");
        var todoText = input.value.trim();
        
        if (todoText !== "") {
            var li = createTodoItem(todoText);
            document.getElementById("todoList").appendChild(li);
            input.value = "";

            // Reinitialize Sortable after adding a new item
            sortable.destroy();
            initSortable();
        }
    }

    function createTodoItem(text) {
        var li = document.createElement("li");
        li.className = 'todo-item-wrapper';

        var mainDiv = document.createElement("div");
        mainDiv.className = 'todo-main';

        var dropdownButton = createButton("▼", function() {
            var subContainer = li.querySelector('.subitem-container');
            if (subContainer) {
                subContainer.style.display = subContainer.style.display === 'none' ? 'block' : 'none';
                this.textContent = subContainer.style.display === 'none' ? '▼' : '▲';
            }
        });
        dropdownButton.classList.add('dropdown-btn');
        dropdownButton.style.display = 'none';  // Initially hidden
        mainDiv.appendChild(dropdownButton);

        var todoSpan = document.createElement("span");
        todoSpan.textContent = text;
        todoSpan.classList.add('todo-text');
        mainDiv.appendChild(todoSpan);

        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "todo-buttons";

        var addSubitemButton = createButton("+", function() {
            var subContainer = li.querySelector('.subitem-container') || createSubitemContainer();
            var subItemInput = createSubitemInput();
            subContainer.appendChild(subItemInput);
            if (!li.contains(subContainer)) {
                li.appendChild(subContainer);
            }
            dropdownButton.style.display = 'inline';  // Show dropdown button
            dropdownButton.textContent = '▲';  // Show as expanded
            subContainer.style.display = 'block';
            subItemInput.focus();
        });
        addSubitemButton.classList.add('add-subitem-btn');

        var deleteButton = createButton("−", function() {
            li.remove();
        });
        deleteButton.classList.add('delete-btn');

        var checkButton = createButton("✓", function() {
            li.classList.toggle('completed');
            var subContainer = li.querySelector('.subitem-container');
            if (subContainer) {
                subContainer.classList.toggle('completed');
            }
        });
        checkButton.classList.add('check-btn');

        buttonsDiv.appendChild(addSubitemButton);
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(checkButton);
        mainDiv.appendChild(buttonsDiv);

        li.appendChild(mainDiv);

        return li;
    }

    function createSubitemContainer() {
        var subContainer = document.createElement('div');
        subContainer.className = 'subitem-container';
        return subContainer;
    }

    function createSubitemInput() {
        var inputWrapper = document.createElement('div');
        inputWrapper.className = 'subitem-input-wrapper';

        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'subitem-input';
        input.placeholder = 'Enter new subitem';

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                var subitem = createSubitem(this.value.trim());
                inputWrapper.parentNode.insertBefore(subitem, inputWrapper);
                this.value = '';
            }
        });

        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                inputWrapper.remove();
            }
        });

        inputWrapper.appendChild(input);
        return inputWrapper;
    }

    function createSubitem(text) {
        var subitem = document.createElement("div");
        subitem.className = 'subitem';

        var subitemSymbol = document.createElement("span");
        subitemSymbol.textContent = "◦";
        subitemSymbol.classList.add('subitem-symbol');
        subitem.appendChild(subitemSymbol);

        var subitemSpan = document.createElement("span");
        subitemSpan.textContent = text;
        subitemSpan.classList.add('subitem-text');
        subitem.appendChild(subitemSpan);

        var deleteButton = createButton("−", function() {
            subitem.remove();
            // Remove subitem container if it's empty
            var subContainer = this.closest('.subitem-container');
            if (subContainer && subContainer.children.length === 0) {
                subContainer.remove();
                // Hide dropdown button if no subitems left
                var dropdownBtn = this.closest('.todo-item-wrapper').querySelector('.dropdown-btn');
                if (dropdownBtn) {
                    dropdownBtn.style.display = 'none';
                }
            }
        });
        deleteButton.classList.add('delete-btn');
        subitem.appendChild(deleteButton);

        return subitem;
    }

    function createButton(text, onclick) {
        var button = document.createElement("button");
        button.textContent = text;
        button.onclick = onclick;
        return button;
    }

    // Initialize Sortable when the page loads
    document.addEventListener('DOMContentLoaded', function() {
        initSortable();
        
        // Move the new todo input to the bottom
        var todoList = document.getElementById('todoList');
        var newTodoInput = document.getElementById('newTodo');
        var addTodoButton = document.getElementById('todoAddButton');
        
        // Create a new container for the input and button
        var inputContainer = document.createElement('div');
        inputContainer.className = 'new-todo-container';
        inputContainer.appendChild(newTodoInput);
        inputContainer.appendChild(addTodoButton);
        
        // Insert the container after the todo list
        todoList.parentNode.insertBefore(inputContainer, todoList.nextSibling);
    });

    // Expose functions that need to be accessed from outside
    window.todoFunctions = {
        addTodo: addTodo
    };
})();