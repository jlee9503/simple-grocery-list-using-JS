// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const item = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const list = document.querySelector('.grocery-list');
const container = document.querySelector(".grocery-container");

// edit option
let editFlag = false;   // default
let editElement;
let editID = '';

// ****** EVENT LISTENERS **********
// submit form, reset the default submit action 
form.addEventListener('submit', addItems);
// clear items
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setItems);

// ****** FUNCTIONS **********
// display alert (message, action)
// remove alert (setTimeout(function(){ }, ms))
// create element and add class
// add dataset ID dynamically
// Adding Items: values, unique IDs for each item you added
// set back to default -> remove item value to the empty string each time after user submit 1 item

function addItems(event) {
    event.preventDefault();
    // creating value
    const value = item.value;
    // create id number
    const productID = new Date().getTime().toString();  // has to be string when you assign to the data-id attribute

    // Options can have:
    // empty value
    // adding value
    // editing value
    if (value !== '' && editFlag === false) {
        
        createItems(productID, value);
        // display alert and show grocery list
        displayAlert('Item added','success');
        container.classList.add('show-container');

        addLocalStorage(productID, value);
        setBackToDefault();

    } else if (value !== '' && editFlag === true) {
        editElement.innerHTML = value;
        displayAlert('Item changed', 'success');

        editLocalStorage(editID, value);

        setBackToDefault();
    } else {
        displayAlert('Please enter the item', 'danger');
    }
};

function displayAlert (message, action) {
    //alert.innerHTML = `<p class="alert-${action}">${message}</p>`;
    alert.textContent = message;
    alert.classList.add(`alert-${action}`);

    setTimeout( () => {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000);
};

function setBackToDefault() {
    item.value = '';
    editFlag = false;   // default
    editID = '';
    submitBtn.textContent = 'submit';
};

// clear items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0) {
        items.forEach(function(item) {
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert('Items removed', 'danger');
    localStorage.removeItem('list');
    setBackToDefault();
};

// delete item function
// delete button clicked -> access to the grocery item -> remove from grocery list
function deleteItems(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    // grocery-list.children.length = grocery-items.length
    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }
    displayAlert('Item deleted from the list', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
};


// edit item function
function editItems(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    
    // value
    grocery.value = editElement.innerHTML;
    // value id
    editID = element.dataset.id;
    // editflag
    editFlag = true;
    submitBtn.textContent = 'edit';
};


// ****** LOCAL STORAGE **********
// localstorage API
// setItem
    // localStorage.setItem('string',JSON.stringify(['item','item2']));
// getItem
    // const string = JSON.parse(localStorage.getItem('string'));
// edit item in the storage
    // map the item list -> item id match -> change the value
// removeItem
    // localStorage.removeItem('string');
    // filter the item list -> item id not match -> return the remaing items
// save as strings

function addLocalStorage (id, value) {
    // set an new object
    const grocery = {id, value};
    
    // get item from the local storage
    let items = getLocalStorage();

    // add item to the storage
    items.push(grocery);

    // set item to the local storage
    localStorage.setItem('list',JSON.stringify(items));
};

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });
    // set item list again
    localStorage.setItem('list',JSON.stringify(items));
};

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function(item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });

    localStorage.setItem('list',JSON.stringify(items));
};

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
};
// ****** SETUP ITEMS **********
function setItems () {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createItems(item.id, item.value);
        });
        container.classList.add('show-container');
    }
};

function createItems (productID, value) {
    // create element
    const element = document.createElement('article');
    element.classList.add('grocery-item');

    // create attribute
    let attr = document.createAttribute('data-id');
    attr.value = productID;        
    element.setAttributeNode(attr);

    // apply to HTML
    element.innerHTML = 
        `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    
    // add edit and delete button event listener here since they are added dynamically
    // delete items
    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItems);

    // edit items
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItems);

    // add element to the grocery list (parent element)
    list.appendChild(element);
};