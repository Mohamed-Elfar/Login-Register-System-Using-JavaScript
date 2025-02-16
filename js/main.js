const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const userNameInput = document.getElementById("registerName");
const userEmailInput = document.getElementById("registerEmail");
const userPasswordInput = document.getElementById("registerPassword");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

let userList = JSON.parse(localStorage.getItem("userList")) || [];

const generateToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=";
  const length = 32;
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = userNameInput.value;
    const email = userEmailInput.value;
    const password = userPasswordInput.value;

    nameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    nameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";

    if (name.trim() === "") {
      nameError.innerHTML = "Please enter your name.";
      nameError.style.display = "block";
      return;
    }

    if (!emailRegex.test(email)) {
      emailError.innerHTML = "Please enter a valid email address.";
      emailError.style.display = "block";
      return;
    }

    if (!passwordRegex.test(password)) {
      passwordError.innerHTML =
        "Password must contain at least one letter, one number, one special character, and be at least 8 characters long.";
      passwordError.style.display = "block";
      return;
    }

    const emailExists = userList.some((user) => user.Email === email);
    if (emailExists) {
      emailError.innerHTML =
        "Email already registered. Please use a different email.";
      emailError.style.display = "block";
      return;
    }

    const newUser = { Name: name, Email: email, Password: password };
    userList.push(newUser);

    localStorage.setItem("userList", JSON.stringify(userList));
    registerForm.reset();

    alert("Registration successful! Please log in.");
    window.location.href = "./login.html";
  });
}

const userEmailLogin = document.getElementById("loginEmail");
const userPasswordLogin = document.getElementById("loginPassword");
const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = userEmailLogin.value;
    const password = userPasswordLogin.value;

    loginEmailError.innerHTML = "";
    loginPasswordError.innerHTML = "";

    const user = userList.find((user) => user.Email === email);

    if (!user) {
      loginEmailError.innerHTML = "Email does not exist.";
      loginEmailError.style.display = "block";
      return;
    }

    if (user.Password !== password) {
      loginPasswordError.innerHTML = "Incorrect password.";
      loginPasswordError.style.display = "block";
      return;
    }
    const newToken = generateToken();

    user.Token = newToken;

    localStorage.setItem("userList", JSON.stringify(userList));

    localStorage.setItem("token", newToken);

    loginForm.reset();

    alert("Login successful! Redirecting to profile page.");
    window.location.href = "./profile.html";
  });
}

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const userToken = localStorage.getItem("token");
const user = userList.find((user) => user.Token === userToken);
profileName.innerHTML = user.Name;
profileEmail.innerHTML = user.Email;

const logOut = document.getElementById("logOut");
if (logOut) {
  logOut.addEventListener("click", function (e) {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });
}
