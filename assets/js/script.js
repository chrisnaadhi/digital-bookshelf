document.addEventListener("DOMContentLoaded", function () {
    const submitBook = document.getElementById("form");

    submitBook.addEventListener("submit", function(event) {
        event.preventDefault();
        inputBook();
        document.getElementById("form").reset();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
})

document.addEventListener("ondatasaved", () => {
    console.log("Proses input selesai.");
})

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});

const COMPLETED_BOOK_ID = "completed-books";
const INCOMPLETED_BOOK_ID = "incompleted-books";
const BOOK_LIST_ITEM_ID = "bookItem";


function createBook(title, author, year, isCompleted, isIncompleted) {
    
    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.className = "author";
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.className = "year";
    textYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("book-content");
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("book-item")
    container.append(textContainer);

    if(isCompleted){
        container.append(
            createIncompletedButton(),
            createDeleteButton()
        );
    } else if (isIncompleted){
        container.append(
            createCompletedButton()
        );
    } else {
        console.log("Sepertinya terjadi kesalahan")
    }

    return container
}

function inputBook() {
    const incompletedBookList = document.getElementById(INCOMPLETED_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_BOOK_ID);
    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("author").value;
    const bookYear = document.getElementById("year").value;
    const bookStatusComplete = document.getElementById("isCompleted").checked;
    const bookStatusIncomplete = document.getElementById("isNotCompleted").checked;
    const bookCompleted = document.getElementById("isCompleted");
    const bookIncompleted = document.getElementById("isNotCompleted");
    const bookMsg = document.getElementById("description");

    const book = createBook(bookTitle, bookAuthor, bookYear, bookStatusComplete, bookStatusIncomplete);
    const bookObject = createBookObject(bookTitle, bookAuthor, bookYear, bookStatusComplete, bookStatusIncomplete);
    book[BOOK_LIST_ITEM_ID] = bookObject.id;
    books.push(bookObject);

    if (bookStatusComplete) {
        completedBookList.append(book);
        bookMsg.innerText = `Buku berjudul '${bookTitle}' sudah ditambahkan ke daftar ${bookCompleted.value}`;
    } else if (bookStatusIncomplete) {
        incompletedBookList.append(book);
        bookMsg.innerText = `Buku berjudul '${bookTitle}' sudah ditambahkan ke daftar ${bookIncompleted.value}`;
    } else {
        console.log("nowhere")
    }
    updateDataToStorage();
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function createDeleteButton() {
    return createButton("trash-button", function (event) {
        deleteBookFromList(event.target.parentElement);
    });
}

function createCompletedButton() {
    return createButton("check-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}

function createIncompletedButton() {
    return createButton("incomplete-button", function (event) {
        addBookToIncompleted(event.target.parentElement);
    });
}

function addBookToCompleted(bookElement) {
    const completedBook = document.getElementById(COMPLETED_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book-content > h3").innerText;
    const bookAuthor = bookElement.querySelector(".book-content > .author").innerText;
    const bookYear = bookElement.querySelector(".book-content > .year").innerText;

    const newBook = createBook(bookTitle, bookAuthor, bookYear, true, false);

    const books = findBook(bookElement[BOOK_LIST_ITEM_ID]);
    books.isCompleted = true;
    books.isIncompleted = false;
    newBook[BOOK_LIST_ITEM_ID] = books.id;

    completedBook.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function addBookToIncompleted(bookElement) {
    const incompletedBook = document.getElementById(INCOMPLETED_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book-content > h3").innerText;
    const bookAuthor = bookElement.querySelector(".book-content > .author").innerText;
    const bookYear = bookElement.querySelector(".book-content > .year").innerText;

    const newBook = createBook(bookTitle, bookAuthor, bookYear, false, true);

    const books = findBook(bookElement[BOOK_LIST_ITEM_ID]);
    books.isCompleted = false;
    books.isIncompleted = true;
    newBook[BOOK_LIST_ITEM_ID] = books.id;

    incompletedBook.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function deleteBookFromList(bookElement) {
    const bookNumber = findBookIndex(bookElement[BOOK_LIST_ITEM_ID]);
    const bookMsg = document.getElementById("description");
    books.splice(bookNumber, 1);

    bookMsg.innerHTML = `<h4 style="color: red;">Satu Buku telah dihapus dari daftar buku.</h4>`;
    bookElement.remove();
    updateDataToStorage();
    
}

function refreshDataFromBooks() {
    let incompletedBook = document.getElementById(INCOMPLETED_BOOK_ID);
    let completedBook = document.getElementById(COMPLETED_BOOK_ID);

    for (book of books) {
        const newBook = createBook(book.title, book.author, book.year, book.isCompleted, book.isIncompleted);
        newBook[BOOK_LIST_ITEM_ID] = book.id;

        if (book.isCompleted) {
            completedBook.append(newBook);
        } else if (book.isIncompleted) {
            incompletedBook.append(newBook);
        }
    }
}