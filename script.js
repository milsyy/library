import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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

const login = document.querySelector("#login");
const account = document.querySelector("#account");
const logout = document.querySelector("#logout");
const addBook = document.querySelector("#add-book");
const containerTwo = document.querySelector("#container-two");
const containerThree = document.querySelector("#container-three");
const overlayDiv = document.querySelector("#overlay");
const form = document.querySelector("form");
const nav = document.querySelector("#nav-container");

let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

const loginToGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
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
    getUser();
  }
};

const getUser = async () => {
  try {
    const loginData = await fetch("");
  } catch {}
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

containerTwo.addEventListener("click", addBookPress);
form.addEventListener("submit", formSubmitted);
overlayDiv.addEventListener("click", removeOverlay);
login.addEventListener("click", loginToGoogle);
nav.addEventListener("click", navEvent);
