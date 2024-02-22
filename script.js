import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"; // Corrected path for auth imports

const firebaseConfig = {
  apiKey: "AIzaSyAjmOhreKLT5YdzHj7GCCk5xqSMeA8Re8c",
  authDomain: "library-58b8e.firebaseapp.com",
  projectId: "library-58b8e",
  storageBucket: "library-58b8e.appspot.com",
  messagingSenderId: "896645998223",
  appId: "1:896645998223:web:fdea8d089da294f45eb2fa",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const login = document.querySelector("#login");
const account = document.querySelector("#account");
const logout = document.querySelector("#logout");
const addBook = document.querySelector("#add-book");
const containerTwo = document.querySelector("#container-two");
const containerThree = document.querySelector("#container-three");
const overlayDiv = document.querySelector("#overlay");
const form = document.querySelector("form");
const nav = document.querySelector("#nav-container");
const accountBg = document.querySelector("#account-bg");

let myLibrary = [];
let userEmail;
let accountDone = false;

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

const getUser = () => {
  let userFromStorage = getItemsFromStorage("user");

  if (userFromStorage.length > 0) {
    login.style.display = "none";
    account.style.display = "block";
    logout.style.display = "block";
  } else {
    login.style.display = "block";
    account.style.display = "none";
    logout.style.display = "none";
  }
};

const displayBooks = () => {
  let booksFromStorage = getItemsFromStorage("books");

  booksFromStorage.forEach((book) => {
    addBookLibrary(book);
  });
};

const userSignOut = async () => {
  signOut(auth).then(() => {
    login.style.display = "block";
    account.style.display = "none";
    logout.style.display = "none";
    localStorage.removeItem("user");
  });
  googleSignInClient.signOut();
};

const getItemsFromStorage = (item) => {
  let booksFromStorage;
  if (localStorage.getItem(item) === null) {
    booksFromStorage = [];
  } else {
    booksFromStorage = JSON.parse(localStorage.getItem(item));
  }
  return booksFromStorage;
};

const loginToGoogle = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      userEmail = user.email;
      localStorage.setItem("user", JSON.stringify(userEmail));
      login.style.display = "none";
      account.style.display = "block";
      logout.style.display = "block";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

const navEvent = (e) => {
  if (e.target === logout) {
    login.style.display = "block";
    account.style.display = "none";
    logout.style.display = "none";
  } else if (e.target === account) {
    accountBg.style.display = "flex";
    if (!accountDone) {
      const acc = document.createElement("p");
      const div = document.createElement("div");
      div.classList.add("account-class");
      acc.textContent = `Logged in as: ${userEmail}`;
      div.appendChild(acc);
      accountBg.appendChild(div);
      accountDone = true;
    }
  }
};

const addBookPress = (e) => {
  if (e.target === addBook) {
    overlayDiv.style.display = "flex";
  }
};

const addBookLibrary = (book) => {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book");

  const titlePara = document.createElement("p");
  titlePara.classList.add("p");
  titlePara.textContent = `"${book.title}"`;

  const authorPara = document.createElement("p");
  authorPara.classList.add("p");
  authorPara.textContent = book.author;

  const pagesPara = document.createElement("p");
  pagesPara.classList.add("p");
  pagesPara.textContent = `${book.pages} Pages`;

  const readBtn = document.createElement("button");
  if (book.read === true) {
    readBtn.classList.add("read-btn");
    readBtn.textContent = "Read";
  } else {
    readBtn.classList.add("not-read-btn");
    readBtn.textContent = "Not read";
  }

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  bookDiv.appendChild(titlePara);
  bookDiv.appendChild(authorPara);
  bookDiv.appendChild(pagesPara);
  bookDiv.appendChild(readBtn);
  bookDiv.appendChild(removeBtn);

  containerThree.appendChild(bookDiv);

  addBookToStorage(book);
};

const addBookToStorage = (book) => {
  let storageBooks = getItemsFromStorage("books");
  storageBooks.push(book);
  localStorage.setItem("books", JSON.stringify(storageBooks));
};

const formSubmitted = (e) => {
  e.preventDefault();
  overlayDiv.style.display = "none";
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("checkbox").checked;

  const newBook = new Book(title, author, pages, read);

  myLibrary.push(newBook);

  form.reset();

  addBookLibrary(newBook);
};

const removeOverlay = (e) => {
  if (e.target === e.currentTarget) {
    overlayDiv.style.display = "none";
  }
};

const removeAcc = (e) => {
  console.log(e.target.classList);
  if (
    !e.target.classList.contains("account-class") &&
    !e.target.parentElement.classList.contains("account-class")
  ) {
    accountBg.style.display = "none";
  }
};

const bookClick = (e) => {
  if (e.target.classList.contains("read-btn")) {
    e.target.classList.remove("read-btn");
    e.target.classList.add("not-read-btn");
    updateStorageItem(e.target.parentElement);
    e.target.textContent = "Not read";
  } else if (e.target.classList.contains("not-read-btn")) {
    e.target.classList.remove("not-read-btn");
    e.target.classList.add("read-btn");
    updateStorageItem(e.target.parentElement);
    e.target.textContent = "Read";
  } else if (e.target.classList.contains("remove-btn")) {
    e.target.parentElement.remove();
    removeItemFromStorage(e.target.parentElement);
  }
};

const updateStorageItem = (book) => {
  let storageBooks = getItemsFromStorage("books");

  let objIndex = storageBooks.findIndex(
    (obj) => `"${obj.title}"` === book.firstChild.textContent
  );
  if (!storageBooks[objIndex].read) {
    storageBooks[objIndex].read = true;
  } else {
    storageBooks[objIndex].read = false;
  }
  localStorage.setItem("books", JSON.stringify(storageBooks));
};

const removeItemFromStorage = (book) => {
  let storageBooks = getItemsFromStorage("books");

  storageBooks = storageBooks.filter((i) => {
    let title = `"${i.title}"`;
    return title !== book.firstChild.textContent;
  });

  localStorage.setItem("books", JSON.stringify(storageBooks));
};

accountBg.addEventListener("click", removeAcc);
containerTwo.addEventListener("click", addBookPress);
form.addEventListener("submit", formSubmitted);
overlayDiv.addEventListener("click", removeOverlay);
login.addEventListener("click", loginToGoogle);
logout.addEventListener("click", userSignOut);
nav.addEventListener("click", navEvent);
containerThree.addEventListener("click", bookClick);
document.addEventListener("DOMContentLoaded", displayBooks);
document.addEventListener("DOMContentLoaded", getUser);
