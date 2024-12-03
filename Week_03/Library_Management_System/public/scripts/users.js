const registerBtn = document.querySelector(".user--submit");
const loginBtn = document.querySelector(".user--login");
const logoutBtn = document.querySelector(".logout--btn");

const createUser = async () => {
  const name = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
  const role = document.querySelector("#role").value;
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirmPassword").value;

  if (!name || !email || !phone || !role || !password || !confirmPassword) {
    showAlert("error", "All fields are required");
    return;
  }

  const user = {
    name,
    email,
    phone,
    role,
    password,
    confirmPassword,
  };

  await fetch("/api/v1/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        showAlert("success", "User created successfully");
      } else if (data.status === "failed") {
        showAlert("error", data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const login = async () => {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  if (!email || !password) {
    showAlert("error", "All fields are required");
    return;
  }

  const user = {
    email,
    password,
  };

  await fetch("/api/v1/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        showAlert("success", "User logged in successfully");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        showAlert("error", data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//logout user
const logout = async () => {
  await fetch("/api/v1/users/logout", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        showAlert("success", "User logged out successfully");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        showAlert("error", "an error occurred while loggin out");
      }
    })
    .catch((err) => console.log(err));
};

//event listener for creating a new user
if (registerBtn) {
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createUser();
  });
}

//event listener for logging in a user
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    login();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    logout();
  });
}
