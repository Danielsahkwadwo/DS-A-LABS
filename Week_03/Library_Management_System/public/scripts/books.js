const bookSubmit = document.querySelector(".book--submit");
const editSubmit = document.querySelector(".edit--submit");
const cancelBtn = document.querySelector(".cancel-button");

// Function to show the popover
let deleteId;
function showDeleteModal(id) {
  deleteId = id;
  console.log(id);
  const popover = document.querySelector(".popover--container");
  if (popover) {
    popover.style.display = "block";
  }
}

if (cancelBtn) {
  cancelBtn.onclick = () => {
    const popover = document.querySelector(".popover--container");
    if (popover) {
      popover.style.display = "none";
    }
  };
}

//creating a new book
const creteBook = () => {
  const title = document.querySelector("#title").value;
  const genreID = document.querySelector("#genreID").value;
  const author = document.querySelector("#author").value;
  const publisher = document.querySelector("#publisher").value;
  const yearPublished = document.querySelector("#yearPublished").value;
  const copies = document.querySelector("#copies").value;
  const description = document.querySelector("#description").value;

  if (
    !title ||
    !genreID ||
    !author ||
    !publisher ||
    !yearPublished ||
    !copies ||
    !description
  ) {
    showAlert("error", "All fields are required");
    return;
  }

  const book = {
    title,
    genreID,
    author,
    publisher,
    yearPublished,
    copies,
    description,
  };
  console.log(book);

  fetch("/api/v1/books/create-book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        showAlert("success", "Book created successfully");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
      if (data.status === "fail") {
        showAlert("error", "an error occured while adding book");
      }
    })
    .catch((err) => console.log(err));
};

//modifying a book
const modifyBook = () => {
  const title = document.querySelector("#title").value;
  const genreID = document.querySelector("#genreID").value;
  const author = document.querySelector("#author").value;
  const publisher = document.querySelector("#publisher").value;
  const yearPublished = document.querySelector("#yearPublished").value;
  const copies = document.querySelector("#copies").value;
  const description = document.querySelector("#description").value;

  if (
    !title ||
    !genreID ||
    !author ||
    !publisher ||
    !yearPublished ||
    !copies ||
    !description
  ) {
    showAlert("error", "All fields are required");
    return;
  }

  const book = {
    title,
    genreID,
    author,
    publisher,
    yearPublished,
    copies,
    description,
  };
  console.log(book);
  const id = new URL(window.location.href).pathname.split("/")[2];
  fetch(`/api/v1/books/edit-book/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        showAlert("success", "Book modified successfully");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
      if (data.status === "failed") {
        showAlert("error", "an error occured while modifying book");
      }
    })
    .catch((err) => console.log(err));
};

//deleting a book
const deleteBook = async () => {
  await fetch(`/api/v1/books/delete-book/${deleteId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        showAlert("success", "Book deleted successfully");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
      if (data.status === "failed") {
        showAlert("error", "an error occured while deleting book");
      }
    })
    .catch((err) => console.log(err));
};

//borrow book and make transaction
const borrowBook = async (id) => {
  await fetch(`/api/v1/transactions/create-transaction/${id}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        showAlert("success", "Book borrowed successfully");
      }
      if (data.status === "failed") {
        showAlert("error", "an error occured while borrowing book");
      }
    })
    .catch((err) => console.log(err));
};

if (bookSubmit) {
  bookSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    creteBook();
  });
}

if (editSubmit) {
  editSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    modifyBook();
  });
}
