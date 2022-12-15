import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRIuh5ai7pqHl2vzdn3GuIgSrCPp8cF_s",
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
        let welcome = `Bienvenido ${user.email}`;
        showMsgAuth('ok', welcome);
        modalInstance.hide();
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = getErrorMsg(errorCode);
        showMsgAuth('error', errorMessage);
    });
}

const btnIsLogOut = document.querySelectorAll('.logged-out');
const btnIsLogIn = document.querySelectorAll('.logged-in');

function checkSession() {
  //verificamos si tiene sesion activa
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(JSON.stringify(user));
      btnIsLogOut.forEach( btn => btn.style.display = 'none');
      btnIsLogIn.forEach( btn => btn.style.display = 'block');
    } else {
      console.log('no logueado');
      btnIsLogOut.forEach( btn => btn.style.display = 'block');
      btnIsLogIn.forEach( btn => btn.style.display = 'none');
    }
  });
}
checkSession();

function login(email, password){
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // mostrariamos la interfaz de usuario logueado
    console.log(user);
    let welcome = `Bienvenido de nuevo ${user.email}`;
    showMsgAuth('ok', welcome);
    modalInstance.hide();
  })
  .catch((error) => {
    console.log(error);
    const errorCode = error.code;
    const errorMessage = getErrorMsg(errorCode);
    showMsgAuth('error', errorMessage);

  });
}

function logout() {
  signOut(auth).then(() => {
    showMsgAuth('info', 'Hasta luego...😀');
  }).catch(error => {
    console.log('Fallo al cerrar sesion');
  })
}

document.getElementById('btn-logout').addEventListener('click', logout);

function showError(err) {
  let inputsError = document.querySelectorAll('.form-control-auth');
  //forma declarativa
  inputsError.forEach(element => {
    element.classList.add('error-input');
  });

  document.querySelector('#error-auth').innerHTML = getErrorMsg(err);
  //vamos colorear en rojo los input
}

function showMsgAuth(status = 'info' ,msg ='Error en Autenticación'){
  let bgCustom = '#3498db';
  
  switch (status) {
    case 'error':
      bgCustom = '#ff4d4f';
      break;
    case 'ok':
      bgCustom = '#2ecc71';
      break;
    case 'warning':
      bgCustom = '#ffc107';
      break;
    case 'info':
    default:
      bgCustom = '#3498db';
      break;
  }


  Toastify({
    text: msg,
    duration: 3000,
    destination: "https://incone.edu.ar",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: bgCustom,
    },
    onClick: function(){} // Callback after click
  }).showToast();
}

function getErrorMsg(code) {
  let msg;

  switch (code) {
    case 'auth/user-not-found':
      msg = 'Usuario no registrado';
      break;
    case 'auth/wrong-password':
      msg = 'Credenciales inválidas';
      break;
    case 'auth/missing-app-credential':
    default:
      msg = 'Fallo en Autenticación';
  }
  return msg;
}

function validateField(field = '', type){
  let status = false,
      msg = '';
  const rules = /^[A-Za-z0-9_.-]*$/;
  const rulesMail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  let input = field.trim();
  switch (type) {
    case 'password':
      if ( input.length > 5 && rules.test(input) ){
        status = true;
      } else {
        msg = 'La contraseña debe tener al menos 5 caracteres. Solo se permiten letras, números, -_ y .'
      }
      break;
    case 'email':
      if(rulesMail.test(input)) {
        status = true;
      } else {
        msg = 'La dirección de correo electrónico no es válida.';
      }
      break;
    default:
      //nunca este vacio
      if(input.length > 3) {
        status = true;
      } else {
        msg = 'Ingrese más de 3 caracteres';
      }
      break;
  }

  return {status, msg};
}
const modalAuth = document.getElementById('modalAuth');
const modalInstance = new bootstrap.Modal(modalAuth);
const btnAction = modalAuth.querySelector('#btn-action');
let action = null;
modalAuth.addEventListener('show.bs.modal', (event) =>{
  const button = event.relatedTarget;
  action = button.getAttribute('data-action-form');

  const modalTitle = modalAuth.querySelector('.modal-title');
  modalTitle.textContent = action === 'login' ? 'Ingresar' : 'Registrarse';

  btnAction.innerHTML = action === 'login' ? 'Ingresar' : 'Registrarse';
});

//SCOPE
btnAction.addEventListener('click', (event) => {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  
  let validateMail = validateField(email, 'email');
  let validatePassword = validateField(password, 'password');
  if( validateMail.status && validatePassword.status ){
    //esto paso la validacion
    sendRequest(email, password);
  } else {
    console.log('fallo validacion '+ validateMail.msg + validatePassword.msg);
    let msj = validateMail.msg + validatePassword.msg;
    showMsgAuth('error', msj);
  }

})

function sendRequest(email, password) {
  if (action === 'login'){
    //llamamos la funcion login
    login( email, password);
  } else {
    //llamamos al register
    registerUser(email, password);
  }
}


