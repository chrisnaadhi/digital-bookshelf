const STORAGE_KEY = "BOOK_SHELF";

let books = [];

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    } 
    return true;
}

function saveBook() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    let content = JSON.parse(serializedData);
    
    if(content !== null)
        books = content;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if(isStorageExist())
        saveBook();
}

function createBookObject(title, author, year, isCompleted, isIncompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted,
        isIncompleted
    }
}

function findBook(bookId) {
    for(book of books) {
        if(book.id === bookId)
            return book;
    }

    return null
}

function findBookIndex(bookId) {
    let index = 0;
    for (book of books) {
        if (book.id === bookId) 
            return index;
        
        index++;
    }

    return -1;
}