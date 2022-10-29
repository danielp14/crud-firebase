import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "-----",
  authDomain: "crud-incone-22.firebaseapp.com",
  projectId: "crud-incone-22",
  storageBucket: "crud-incone-22.appspot.com",
  messagingSenderId: "119875482209",
  appId: "1:119875482209:web:0533536ff3ad0fe3857020"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function registerUser( email, password){
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

//const btnRegister = document.getElementById('btn-register');
/*btnRegister.addEventListener('click', ()=>{
  let useremail = document.getElementById('emailRegister').value;
  let password = document.getElementById('passwordRegister').value;

  if(useremail.length > 0 && password.length > 0){
    registerUser(useremail, password);
  } else {
    console.log('uno de los campos esta vacio');
  }


});*/

function checkSession() {
  //verificamos si tiene sesion activa
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(JSON.stringify(user));
    } else {
      console.log('no logueado');
    }
  });
}

function login(email, password){
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // mostrariamos la interfaz de usuario logueado
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });
}

const modalAuth = document.getElementById('modalAuth');
modalAuth.addEventListener('show.bs.modal', (event) =>{
  const button = event.relatedTarget;
  const action = button.getAttribute('data-action-form');
  console.log('>>>'+action);

  const modalTitle = modalAuth.querySelector('.modal-title');
  modalTitle.textContent = action === 'login' ? 'Ingresar' : 'Registrarse';

  const btnAction = modalAuth.querySelector('#btn-action');
  btnAction.innerHTML = action === 'login' ? 'Ingresar' : 'Registrarse';

});
