// todo.js
(function() {
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

    // Expose functions that need to be accessed from outside
    window.todoFunctions = {
        addTodo: addTodo
    };
})();