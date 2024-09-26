// Função para carregar todas as listas salvas do LocalStorage
function loadShoppingLists() {
    const savedLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
    savedLists.forEach(list => {
        addNewListToDOM(list.name, list.date, list.items);
    });
}

// Função para salvar todas as listas no LocalStorage
function saveShoppingLists() {
    const lists = [];
    document.querySelectorAll('.list').forEach(list => {
        const listName = list.querySelector('.list-header h2').textContent;
        const listDate = list.querySelector('.list-header .date').textContent;
        const items = [];
        list.querySelectorAll('ul li').forEach(li => {
            items.push(li.firstChild.textContent);
        });
        lists.push({ name: listName, date: listDate, items });
    });
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
}

// Função para adicionar nova lista no DOM e no LocalStorage
function addNewListToDOM(name, date, items = []) {
    const listsContainer = document.getElementById('lists-container');

    const listDiv = document.createElement('div');
    listDiv.classList.add('list');
    listDiv.innerHTML = `
        <div class="list-header">
            <h2>${name}</h2>
            <span class="date">${date}</span>
        </div>
        <ul></ul>
        <div class="input-container">
            <input type="text" placeholder="Adicione um item">
            <button>Adicionar</button>
        </div>
    `;

    const ul = listDiv.querySelector('ul');
    items.forEach(item => {
        addItemToList(ul, item);
    });

    const addButton = listDiv.querySelector('.input-container button');
    const inputField = listDiv.querySelector('.input-container input');

    // Evento para adicionar itens à lista
    addButton.addEventListener('click', function() {
        if (inputField.value !== '') {
            addItemToList(ul, toTitleCase(inputField.value));
            inputField.value = '';
            saveShoppingLists();
        }
    });

    // Evento de adicionar item ao pressionar Enter
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && inputField.value !== '') {
            addItemToList(ul, toTitleCase(inputField.value));
            inputField.value = '';
            saveShoppingLists();
        }
    });

    listsContainer.appendChild(listDiv);
    saveShoppingLists();
}

// Função para converter texto para formato de título (ex: "Maçãs Verdes")
function toTitleCase(text) {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Função para adicionar item à lista
function addItemToList(ul, itemText) {
    const li = document.createElement('li');
    li.textContent = itemText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remover';
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveShoppingLists();
    });

    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

// Evento para criar uma nova lista de compras
document.getElementById('create-list-btn').addEventListener('click', function() {
    const listNameInput = document.getElementById('new-list-input');
    const listName = listNameInput.value;
    if (listName) {
        const currentDate = new Date().toLocaleDateString();
        addNewListToDOM(listName, currentDate);
        listNameInput.value = '';
    }
});

// Carrega todas as listas ao carregar a página
window.addEventListener('load', loadShoppingLists);
