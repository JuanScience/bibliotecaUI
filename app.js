const FRONT_URL = "http://localhost:5500/bibliotecaUI";
const API_URL = "http://localhost:6969";
const HTMLResponse = document.querySelector("#lienzo");
const titulosAutores = ['ISBN', 'Editorial', 'Género', 'Año', '', ''];

let listaAutores = [];
let user = {};

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
      listaAutores = res;
      const tableResult = document.createElement('table');
      tableResult.classList.add('table');
      tableResult.classList.add('table-borderless');
      let fila = document.createElement('tr');
      fila.classList.add('table-dark');
      titulosAutores.forEach((t) => {
        let columna = document.createElement('th');
        columna.appendChild(document.createTextNode(t));
        fila.appendChild(columna);
      });
      tableResult.appendChild(fila);
      res.forEach((author) => {
        let fila = document.createElement('tr');
        Object.values(author).forEach((i) => {
          let columna = document.createElement('td');
          columna.appendChild(document.createTextNode(i));
          fila.appendChild(columna);
        });
        columna = document.createElement('td');
        boton = document.createElement('button');
        boton.innerText = "Actualizar";
        boton.setAttribute("id", author.idAutor);
        boton.setAttribute("type", "button");
        boton.setAttribute("class", "btn");
        boton.setAttribute("class", "btn-primary");
        boton.setAttribute("data-bs-toggle", "modal");
        boton.setAttribute("data-bs-target", "#Modal");
        boton.setAttribute("onclick", "updateAuthorModal(this.id)")
        
        columna.appendChild(boton);
        fila.appendChild(columna);
        
        columna = document.createElement('td');
        boton = document.createElement('button');
        boton.innerText = "Eliminar";

        columna.appendChild(boton);
        fila.appendChild(columna);
        tableResult.appendChild(fila);

        //updateModalAutors
        
      });
      var list = document.getElementById("lienzo");     // Get the target element
      list.innerHTML = "";                            // Remove previous content
      list.appendChild(tableResult); // Append your generated UL

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

function guardarCambios(e){
  var modalElement = document.getElementById("Modal");
  console.log(modalElement);
}

function updateAuthorModal(e){
  const found = listaAutores.filter(element => element.idAutor == e);
  var list = document.getElementById("TitleModal");
  list.innerHTML = "Actualizar Autor";
  list = document.getElementById("contentModal");
  list.innerHTML = "";  
}

