const FRONT_URL = "http://localhost:5500/bibliotecaUI";
const API_URL = "http://localhost:6969";
const HTMLResponse = document.querySelector("#lienzo");
const ul = document.createElement('ul');

let user = {};

window.addEventListener('load', function() {
  console.log("Load....");
  document.querySelector("#formLogin").reset();
  if (user && user.tipo == 0 && window.location == "http://localhost:5500/bibliotecaUI/administrador.html") {    
    alertManager("success", "Bienvenidx " + res.nombreUsuario);
    console.log(user.nombre + "Admin");
    console.log("Bienvenidx " + res.nombreUsuario);
  } else if (user && user.tipo == 1 && window.location == "http://localhost:5500/bibliotecaUI/empleado.html"){
    alertManager("success", "Bienvenidx " + res.nombreUsuario);
    console.log(user.nombre + "Emple");
  }
});

/** Elementos  */

function elementosSalir(){
  user = {};
  document.getElementById("barraAdministrador").style.display = 'none';
  document.getElementById("barraUsuario").style.display = 'none';
  document.getElementById("barraSalir").style.display = 'none';
  
  //esconder elementos de listado
  
  document.getElementById("ingreso").style.display = 'inline'; 
  document.querySelector("#formLogin").reset();
  setInterval("location.reload()",10);
};

function elementosAdministrador(){
  console.log("admin....");
  document.getElementById("barraAdministrador").style.display = ''; 
  document.getElementById("barraUsuario").style.display = 'none';
  document.getElementById("barraSalir").style.display = '';
  
  //esconder elementos de listado
  
  document.getElementById("ingreso").style.display = 'none'; 
};

function elementosUsuario(){
  console.log("usuario....");
  document.getElementById("barraAdministrador").style.display = 'none'; 
  document.getElementById("barraUsuario").style.display = '';
  document.getElementById("barraSalir").style.display = '';
  
  //esconder elementos de listado
  
  document.getElementById("ingreso").style.display = 'none'; 
};

const login = () => {
  const formData = new FormData(document.querySelector("#formLogin"));
  if (!formData.get("nombre").length || !formData.get("pass").length) {
    alertManager("error",  "Llena todos los campos");
    return;
  }
  document.querySelector("#formLogin").innerHTML = "";
  const usuario = {
    Nombre: formData.get("nombre"),
    Pass: formData.get("pass"),
  };
  fetch(API_URL + "/" + usuario.Nombre + "/" + usuario.Pass, {
    method: "POST",
    //Sbody: JSON.stringify(usuario),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      alertManager("error", "Usuario o contraseña inválidos");
      document.querySelector("#formLogin").reset();
      user = {};
    })
    .then((res) => {
      user = res;      
      if (user && user.tipo == 0) {
        alertManager("success", "Bienvenidx " + res.nombreUsuario);
        elementosAdministrador();
      } else if (user && user.tipo == 1){
        alertManager("success", "Bienvenidx " + res.nombreUsuario);
        elementosUsuario();
      } else {
        alertManager("error", "Vuelva a intetarlo");
        elementosSalir();
      }
    });
};

/**Administradores */

function listarAutores(){
  fetch(API_URL + "/autores", {
    method: "GET",
    headers: {"Content-Type": "application/json",},
  })
  .then((res) => res.json())
    .catch((error) => {
      alertManager("error", "No se pudo traer datos");
    })
    .then((res) => {
      res.forEach((a) => {
        let elem = document.createElement('li');
        elem.appendChild(
          document.createTextNode(`${res.idAutor} ${res.cedula} ${res.nombreCompleto} ${res.nacionalidad}`)
        );
        ul.appendChild(elem); 
      });
      const listj = document.querySelector('#lienzo');
      console.log(listj);
      document.querySelector('#lienzo').remove;

      while (listj.hasChildNodes()) {
        listj.removeChild(listj.firstChild);
      }
      HTMLResponse.innerHTML = '';

      HTMLResponse.appendChild(ul);
    });
};

function listarLibros(){
  fetch(API_URL + "/libros", {
    method: "GET",
    headers: {"Content-Type": "application/json",},
  })
  .then((res) => res.json())
    .catch((error) => {
      alertManager("error", "No se pudo traer datos");
    })
    .then((res) => {    
      pintarLibros(res);
    });
};

function pintarLibros(datos){
  console.log(datos);
}

function listarUsuarios(){
  fetch(API_URL + "/usuarios", {
    method: "GET",
    headers: {"Content-Type": "application/json",},
  })
  .then((res) => res.json())
    .catch((error) => {
      alertManager("error", "No se pudo traer datos");
    })
    .then((res) => {    
      pintarUsuarios(res);
    });
};

function pintarUsuarios(datos){
  console.log(datos);
}

/**Usuarios */

function buscar(){
  const formDataS = new FormData(document.querySelector("#formSearch"));
  if (!formDataS.get("cc").length) {
    alertManager("error",  "Llena la barra de búsqueda");
    return;
  }
  const busqueda = formDataS.get("cc");
  fetch(API_URL + "/cedula/" + busqueda, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
    .catch((error) => {
      alertManager("error", "Autor no encontrado");
    })
    .then((res) => {
      obAutor = res;
      buscarLibros(obAutor);
    })
};

function buscarLibros(obAutor){
  fetch(API_URL + "/id_Autor/" + obAutor.idAutor, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
    .catch((error) => {
      alertManager("error", "Autor no encontrado");
    })
    .then((res) => {
      obLibros = res;
      pintarBusqueda(obAutor, obLibros);
    })
};

function pintarBusqueda(obAutor, ListLibros){
  console.log(obAutor);
  console.log(ListLibros);
};

/** ALERT */
const alertManager = (typeMsg, message) => {
  const alert = document.querySelector("#alert");

  alert.innerHTML = message || "Se produjo cambios";
  alert.classList.add(typeMsg);
  alert.style.display = "block";

  setTimeout(() => {
    alert.style.display = "none";
    alert.classList.remove(typeMsg);
  }, 3500);
};