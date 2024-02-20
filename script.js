addBook = document.querySelector("#add-book");
containerTwo = document.querySelector("#container-two");
overlayDiv = document.querySelector("#overlay");
form = document.querySelector("form");

const myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

const addBookLibrary = () => {
  myLibrary.forEach((book) => {});
};

const addBookPress = (e) => {
  if (e.target === addBook) {
    overlayDiv.style.display = "flex";
  }
};

const formSubmitted = () => {
  overlayDiv.style.display = "none";
};

const removeOverlay = (e) => {
  if (e.target === e.currentTarget) {
    overlayDiv.style.display = "none";
  }
};

containerTwo.addEventListener("click", addBookPress);
form.addEventListener("submit", formSubmitted);
overlayDiv.addEventListener("click", removeOverlay);
