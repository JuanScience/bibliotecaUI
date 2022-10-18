const FRONT_URL = "http://localhost:5500/bibliotecaUI";
const API_URL = "http://localhost:6969";
const HTMLResponse = document.querySelector("#lienzo");

const encabezadosAutores = ['ID', 'Cédula', 'Nombre Completo', 'Nacionalidad', '', ''];
const encabezadosLibros = ['ID', 'ISBN', 'Editorial', 'Género', 'Fecha Publicación', 'ID Autor', '', ''];
const encabezadosUsuarios = ['ID', 'Nombre de Usuario', 'Contraseña', 'tipo', '', ''];

let listaAutores = [];
let listaLibros = [];
let listaUsuarios = [];
let user = {};

let authorFound = {};

/** Elementos  */

function elementosSalir() {
  user = {};
  document.getElementById("barraAdministrador").style.display = 'none';
  document.getElementById("barraUsuario").style.display = 'none';
  document.getElementById("barraSalir").style.display = 'none';  
  document.getElementById("lienzoAccion").style.display = 'none';
  document.getElementById("ingreso").style.display = 'inline';
  document.querySelector("#formLogin").reset();
  window.location.reload();
};

function elementosAdministrador() {
  document.getElementById("barraAdministrador").style.display = '';
  document.getElementById("barraUsuario").style.display = 'none';
  document.getElementById("barraSalir").style.display = '';
  document.getElementById("ingreso").style.display = 'none';
};

function elementosUsuario() {
  console.log("usuario....");
  document.getElementById("barraAdministrador").style.display = 'none';
  document.getElementById("barraUsuario").style.display = '';
  document.getElementById("barraSalir").style.display = '';
  document.getElementById("ingreso").style.display = 'none';
  document.getElementById("lienzoAccion").style.display = 'none';
};

function login() {
  user = {};
  var formData = new FormData(document.querySelector("#formLogin"));
  if (!formData.get("nombre").length || !formData.get("pass").length) {
    alertManager("error", "Llena todos los campos");
    return;
  }
  document.querySelector("#formLogin").innerHTML = "";
  var usuario = {
    Nombre: formData.get("nombre"),
    Pass: formData.get("pass"),
  };
  fetch(API_URL + "/" + usuario.Nombre + "/" + usuario.Pass, {
    method: "POST",
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
      } else if (user && user.tipo == 1) {
        alertManager("success", "Bienvenidx " + res.nombreUsuario);
        elementosUsuario();
      } else {
        alertManager("error", "Vuelva a intetarlo");
        elementosSalir();
        user = {};
      }
    });
};

/**Administradores */

function listarAutores() {
  fetch(API_URL + "/autores", {
    method: "GET",
    headers: { "Content-Type": "application/json", },
  })
    .then((res) => res.json())
    .catch((error) => {
      alertManager("error", "No se pudo traer datos");
    })
    .then((res) => {
      listaAutores = res;
      var tableResult = document.createElement('table');
      tableResult.classList.add('table');
      tableResult.classList.add('table-borderless');
      let fila = document.createElement('tr');
      fila.classList.add('table-dark');
      encabezadosAutores.forEach((t) => {
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
        boton.setAttribute("id", author.idAutor);
        boton.setAttribute("onclick", "deleteAuthor(this.id)")

      });
      var list = document.getElementById("lienzo");     // Get the target element
      list.innerHTML = "";                            // Remove previous content
      list.appendChild(tableResult); // Append your generated UL

      var botonLienzo = document.getElementById("lienzoAccion");
      botonLienzo.style.display = '';
      botonLienzo.setAttribute("onclick", "crearAuthorModal()");
      botonLienzo.setAttribute("data-bs-toggle", "modal");
      botonLienzo.setAttribute("data-bs-target", "#Modal");
      botonLienzo.innerHTML="Crear Autor";
    });
};

function listarLibros() {
  fetch(API_URL + "/libros", {
    method: "GET",
    headers: { "Content-Type": "application/json", },
  })
    .then((res) => res.json())
    .catch((error) => {
      alertManager("error", "No se pudo traer datos");
    })
    .then((res) => {
      listaLibros = res;
      var tableResult = document.createElement('table');
      tableResult.classList.add('table');
      tableResult.classList.add('table-borderless');
      let fila = document.createElement('tr');
      fila.classList.add('table-dark');
      encabezadosLibros.forEach((t) => {
        let columna = document.createElement('th');
        columna.appendChild(document.createTextNode(t));
        fila.appendChild(columna);
      });
      tableResult.appendChild(fila);
      res.forEach((book) => {
        let fila = document.createElement('tr');
        Object.values(book).forEach((i) => {
          let columna = document.createElement('td');
          columna.appendChild(document.createTextNode(i));
          fila.appendChild(columna);
        });
        columna = document.createElement('td');
        boton = document.createElement('button');
        boton.innerText = "Actualizar";
        boton.setAttribute("id", book.idLibro);
        boton.setAttribute("type", "button");
        boton.setAttribute("class", "btn");
        boton.setAttribute("class", "btn-primary");
        boton.setAttribute("data-bs-toggle", "modal");
        boton.setAttribute("data-bs-target", "#Modal");
        boton.setAttribute("onclick", "updateBookModal(this.id)")

        columna.appendChild(boton);
        fila.appendChild(columna);

        columna = document.createElement('td');
        boton = document.createElement('button');
        boton.innerText = "Eliminar";

        columna.appendChild(boton);
        fila.appendChild(columna);
        tableResult.appendChild(fila);
        boton.setAttribute("id", book.idLibro);
        boton.setAttribute("onclick", "deleteBook(this.id)")
      });
      var list = document.getElementById("lienzo");
      list.innerHTML = "";
      list.appendChild(tableResult);

      var botonLienzo = document.getElementById("lienzoAccion");
      botonLienzo.style.display = '';
      botonLienzo.setAttribute("onclick", "crearBookModal()");
      botonLienzo.setAttribute("data-bs-toggle", "modal");
      botonLienzo.setAttribute("data-bs-target", "#Modal");
      botonLienzo.innerHTML="Crear Libro";
    });
};

function listarUsuarios() {
  fetch(API_URL + "/usuarios", {
    method: "GET",
    headers: { "Content-Type": "application/json", },
  })
    .then((res) => res.json())
    .catch((error) => {
      alertManager("error", "No se pudo traer datos");
    })
    .then((res) => {
      listaUsuarios = res;
      var tableResult = document.createElement('table');
      tableResult.classList.add('table');
      tableResult.classList.add('table-borderless');
      let fila = document.createElement('tr');
      fila.classList.add('table-dark');
      encabezadosUsuarios.forEach((t) => {
        let columna = document.createElement('th');
        columna.appendChild(document.createTextNode(t));
        fila.appendChild(columna);
      });
      tableResult.appendChild(fila);
      res.forEach((user) => {
        let fila = document.createElement('tr');
        Object.values(user).forEach((i) => {
          let columna = document.createElement('td');
          columna.appendChild(document.createTextNode(i));
          fila.appendChild(columna);
        });
        columna = document.createElement('td');
        boton = document.createElement('button');
        boton.innerText = "Actualizar";
        boton.setAttribute("id", user.idUsuario);
        boton.setAttribute("type", "button");
        boton.setAttribute("class", "btn");
        boton.setAttribute("class", "btn-primary");
        boton.setAttribute("data-bs-toggle", "modal");
        boton.setAttribute("data-bs-target", "#Modal");
        boton.setAttribute("onclick", "updateUserModal(this.id)")

        columna.appendChild(boton);
        fila.appendChild(columna);

        columna = document.createElement('td');
        boton = document.createElement('button');
        boton.innerText = "Eliminar";

        columna.appendChild(boton);
        fila.appendChild(columna);
        tableResult.appendChild(fila);
        boton.setAttribute("id", user.idUsuario);
        boton.setAttribute("onclick", "deleteUser(this.id)")////////////////

      });
      var list = document.getElementById("lienzo");
      list.innerHTML = "";
      list.appendChild(tableResult);

      var botonLienzo = document.getElementById("lienzoAccion");
      botonLienzo.style.display = '';
      botonLienzo.setAttribute("onclick", "crearUserModal()");
      botonLienzo.setAttribute("data-bs-toggle", "modal");
      botonLienzo.setAttribute("data-bs-target", "#Modal");
      botonLienzo.innerHTML="Crear Usuario";
    });
};

/**Usuarios */


function buscar() {
  var busqueda = API_URL + "/cedula/" + document.getElementById("textcc").value;
  console.log(busqueda);
  if (busqueda === undefined) {
    alertManager("error", "Ingrese la cédula");
  }
  else {
    fetch(busqueda, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
        .catch((error) => {
        alertManager("error", "Falla en la búsqueda");
      }).then((res) => {
        if (!res) {
          console.log(res, "Autor no encontrado");
        }else{
          console.log(res, "Primero");
          alertManager("error", "Greatttttttt");
        }
        elementosUsuario();
          
        //obAutor = res;
        
        //buscarLibros(obAutor);        
        
      })
  }

};

function buscarLibros(obAutor) {
  fetch(API_URL + "/id_Autor/" + obAutor.idAutor, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
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

function pintarBusqueda(obAutor, ListLibros) {
  console.log(obAutor);
  console.log(ListLibros);
};

/** ALERT */
var alertManager = (typeMsg, message) => {
  var alert = document.querySelector("#alert");

  alert.innerHTML = message || "Se produjo cambios";
  alert.classList.add(typeMsg);
  alert.style.display = "block";

  setTimeout(() => {
    alert.style.display = "none";
    alert.classList.remove(typeMsg);
  }, 3500);
};

/** Modal */

function updateAuthorModal(id) {
  var found = listaAutores.find(element => element.idAutor == id);
  var titleModal = document.getElementById("TitleModal");
  titleModal.innerHTML = "Actualizar Autor";

  var contentModal = document.getElementById("contentModal");
  contentModal.innerHTML = "";

  var formulario = document.createElement('form');
  formulario.setAttribute("id", "formActualizar");
  formulario.setAttribute("class", "form-group");

  var idLabel = document.createElement('label');
  idLabel.innerHTML = "ID: ";
  formulario.appendChild(idLabel);
  var idInput = document.createElement('input');
  idInput.setAttribute("id", "idInput");
  idInput.disabled = true;
  idInput.value = found.idAutor;
  formulario.appendChild(idInput);

  var ccLabel = document.createElement('label');
  ccLabel.innerHTML = "Cédula: ";
  formulario.appendChild(ccLabel);
  var ccInput = document.createElement('input');
  ccInput.setAttribute("id", "ccInput");
  ccInput.value = found.cedula;
  ccInput.required = true;
  formulario.appendChild(ccInput);

  var nombreLabel = document.createElement('label');
  nombreLabel.innerHTML = "Nombre Completo: ";
  formulario.appendChild(nombreLabel);
  var nombreInput = document.createElement('input');
  nombreInput.setAttribute("id", "nombreInput");
  nombreInput.value = found.nombreCompleto;
  nombreInput.required = true;
  formulario.appendChild(nombreInput);

  var nacionLabel = document.createElement('label');
  nacionLabel.innerHTML = "Nacionalidad: ";
  formulario.appendChild(nacionLabel);
  var nacionInput = document.createElement('input');
  nacionInput.setAttribute("id", "nacionInput");
  nacionInput.value = found.nacionalidad;
  nacionInput.required = true;
  formulario.appendChild(nacionInput);

  contentModal.appendChild(formulario);

  document.getElementById("ccInput").required = true;

  var boton = document.getElementById("modalButton");
  boton.innerHTML = "Actualizar";
  boton.setAttribute("onclick", "updateAuthor()");
}

function updateBookModal(id) {
  var found = listaLibros.find(element => element.idLibro == id);
  var titleModal = document.getElementById("TitleModal");
  titleModal.innerHTML = "Actualizar Libro";

  var contentModal = document.getElementById("contentModal");
  contentModal.innerHTML = "";

  var formulario = document.createElement('form');
  formulario.setAttribute("id", "formActualizar");
  formulario.setAttribute("class", "form-group");

  var idLabel = document.createElement('label');
  idLabel.innerHTML = "ID: ";
  formulario.appendChild(idLabel);
  var idInput = document.createElement('input');
  idInput.setAttribute("id", "idInput");
  idInput.disabled = true;
  idInput.value = found.idLibro;
  formulario.appendChild(idInput);

  var isbnLabel = document.createElement('label');
  isbnLabel.innerHTML = "ISBN: ";
  formulario.appendChild(isbnLabel);
  var isbnInput = document.createElement('input');
  isbnInput.setAttribute("id", "isbnInput");
  isbnInput.value = found.isbn;
  isbnInput.required = true;
  formulario.appendChild(isbnInput);

  var editorialLabel = document.createElement('label');
  editorialLabel.innerHTML = "Editorial: ";
  formulario.appendChild(editorialLabel);
  var editorialInput = document.createElement('input');
  editorialInput.setAttribute("id", "editorialInput");
  editorialInput.value = found.editorial;
  editorialInput.required = true;
  formulario.appendChild(editorialInput);

  var generoLabel = document.createElement('label');
  generoLabel.innerHTML = "Género: ";
  formulario.appendChild(generoLabel);
  var generoInput = document.createElement('input');
  generoInput.setAttribute("id", "generoInput");
  generoInput.value = found.genero;
  generoInput.required = true;
  formulario.appendChild(generoInput);

  var yearLabel = document.createElement('label');
  yearLabel.innerHTML = "Fecha Publicación: ";
  formulario.appendChild(yearLabel);
  var yearInput = document.createElement('input');
  yearInput.setAttribute("id", "yearInput");
  yearInput.value = found.year;
  yearInput.required = true;
  formulario.appendChild(yearInput);

  var idAutorLabel = document.createElement('label');
  idAutorLabel.innerHTML = "ID Autor: ";
  formulario.appendChild(idAutorLabel);
  var idAutorInput = document.createElement('input');
  idAutorInput.setAttribute("id", "idAutorInput");
  idAutorInput.value = found.idAutor;
  idAutorInput.required = true;
  formulario.appendChild(idAutorInput);

  contentModal.appendChild(formulario);

  var boton = document.getElementById("modalButton");
  boton.innerHTML = "Actualizar";
  boton.setAttribute("onclick", "updateBook()");
}

function updateUserModal(id) {
  var found = listaUsuarios.find(element => element.idUsuario == id);
  var titleModal = document.getElementById("TitleModal");
  titleModal.innerHTML = "Actualizar Usuario";

  var contentModal = document.getElementById("contentModal");
  contentModal.innerHTML = "";

  var formulario = document.createElement('form');
  formulario.setAttribute("id", "formActualizar");
  formulario.setAttribute("class", "form-group");

  var idLabel = document.createElement('label');
  idLabel.innerHTML = "ID: ";
  formulario.appendChild(idLabel);
  var idInput = document.createElement('input');
  idInput.setAttribute("id", "idInput");
  idInput.disabled = true;
  idInput.value = found.idUsuario;
  formulario.appendChild(idInput);

  var nombreLabel = document.createElement('label');
  nombreLabel.innerHTML = "Nombre de Usuario: ";
  formulario.appendChild(nombreLabel);
  var nombreInput = document.createElement('input');
  nombreInput.setAttribute("id", "nombreInput");
  nombreInput.value = found.nombreUsuario;
  nombreInput.required = true;
  formulario.appendChild(nombreInput);

  var passLabel = document.createElement('label');
  passLabel.innerHTML = "Contraseña: ";
  formulario.appendChild(passLabel);
  var passInput = document.createElement('input');
  passInput.setAttribute("id", "passInput");
  passInput.value = found.password;
  passInput.required = true;
  formulario.appendChild(passInput);

  var tipoLabel = document.createElement('label');
  tipoLabel.innerHTML = "Tipo Usuario: ";
  formulario.appendChild(tipoLabel);
  var tipoInput = document.createElement('input');
  tipoInput.setAttribute("id", "tipoInput");
  tipoInput.value = found.tipo;
  tipoInput.required = true;
  formulario.appendChild(tipoInput);

  contentModal.appendChild(formulario);

  var boton = document.getElementById("modalButton");
  boton.innerHTML = "Actualizar";
  boton.setAttribute("onclick", "updateUser()");
}

function updateAuthor() {
  var idAuthor = document.getElementById("idInput").value;
  var cedula = document.getElementById("ccInput").value;
  var nombre = document.getElementById("nombreInput").value;
  var nacion = document.getElementById("nacionInput").value;

  var objetoAutor = { idAutor: idAuthor, cedula, nombreCompleto: nombre, nacionalidad: nacion };

  console.log(objetoAutor);

  fetch(API_URL + "/autor/update", {
    method: "PUT",
    body: JSON.stringify(objetoAutor),
    headers: {
      "Content-Type": "application/json",
      "tipo": user.tipo
    },
  }).then((res) => res.json())
    .then((res) => {
      console.log(res);
      listarAutores();
    })
    .catch((error) => {
      alertManager("error", "Autor no encontrado");
      console.log(error);
    })
}

function updateBook() {
  var idBook = document.getElementById("idInput").value;
  var isbn = document.getElementById("isbnInput").value;
  var editorial = document.getElementById("editorialInput").value;
  var genero = document.getElementById("generoInput").value;
  var year = document.getElementById("yearInput").value;
  var id_Autor = document.getElementById("idAutorInput").value;

  var objetoLibro = { idLibro: idBook, isbn, editorial, genero, year, idAutor: id_Autor };

  fetch(API_URL + "/libro/update", {
    method: "PUT",
    body: JSON.stringify(objetoLibro),
    headers: {
      "Content-Type": "application/json",
      "tipo": user.tipo
    },
  }).then((res) => res.json())
    .then((res) => {
      console.log(res);
      listarLibros();
    })
    .catch((error) => {
      alertManager("error", "Libro no encontrado");
      console.log(error);
    })
}

function updateUser() {
  var idUsuario = document.getElementById("idInput").value;
  var nombreUsuario = document.getElementById("nombreInput").value;
  var password = document.getElementById("passInput").value;
  var tipo = document.getElementById("tipoInput").value;

  var objetoUsuario = { idUsuario, nombreUsuario, password, tipo };

  fetch(API_URL + "/usuario/update", {
    method: "PUT",
    body: JSON.stringify(objetoUsuario),
    headers: {
      "Content-Type": "application/json",
      "tipo": user.tipo
    },
  }).then((res) => res.json())
    .then((res) => {
      console.log(res);
      listarUsuarios();
    })
    .catch((error) => {
      alertManager("error", "Usuario no encontrado");
      console.log(error);
    })
}

function deleteAuthor(id) {
  fetch(API_URL + "/autor/delete/" + id, {
      method: "DELETE",
      headers: {
        "tipo": user.tipo
      }
    }).then((resp) => {
      if (resp && resp.ok) {
        console.log(resp);
        alertManager("success", "Autor borrado");
        listarAutores();
      }
    }).catch((e) => {
      console.log(e);
      alertManager("error", "Autor no borrado");
    })
}

function deleteBook(id) {
  fetch(API_URL + "/id/" + id, {
      method: "DELETE",
      headers: {
        "tipo": user.tipo
      }
    }).then((resp) => {
      if (resp && resp.ok) {
        console.log(resp);
        alertManager("success", "Libro borrado");
        listarLibros();
      }
    }).catch((e) => {
      console.log(e);
      alertManager("error", "Libro no borrado");
    })
}

function deleteUser(id) {
  fetch(API_URL + "/usuario/delete/" + id, {
      method: "DELETE",
      headers: {
        "tipo": user.tipo
      }
    }).then((resp) => {
      if (resp && resp.ok) {
        console.log(resp);
        alertManager("success", "Usuario borrado");
        listarUsuarios();
      }
    }).catch((e) => {
      console.log(e);
      alertManager("error", "Usuario no borrado");
    })
}

function crearAuthorModal() {
  var titleModal = document.getElementById("TitleModal");
  titleModal.innerHTML = "Actualizar Autor";

  var contentModal = document.getElementById("contentModal");
  contentModal.innerHTML = "";

  var formulario = document.createElement('form');
  formulario.setAttribute("id", "formActualizar");
  formulario.setAttribute("class", "form-group");

  var ccLabel = document.createElement('label');
  ccLabel.innerHTML = "Cédula: ";
  formulario.appendChild(ccLabel);
  var ccInput = document.createElement('input');
  ccInput.setAttribute("id", "ccInput");
  ccInput.required = true;
  formulario.appendChild(ccInput);

  var nombreLabel = document.createElement('label');
  nombreLabel.innerHTML = "Nombre Completo: ";
  formulario.appendChild(nombreLabel);
  var nombreInput = document.createElement('input');
  nombreInput.setAttribute("id", "nombreInput");
  nombreInput.required = true;
  formulario.appendChild(nombreInput);

  var nacionLabel = document.createElement('label');
  nacionLabel.innerHTML = "Nacionalidad: ";
  formulario.appendChild(nacionLabel);
  var nacionInput = document.createElement('input');
  nacionInput.setAttribute("id", "nacionInput");
  nacionInput.required = true;
  formulario.appendChild(nacionInput);

  contentModal.appendChild(formulario);

  var boton = document.getElementById("modalButton");
  boton.innerHTML = "Crear";
  boton.setAttribute("onclick", "crearAuthor()");
}

function crearBookModal() {
  var titleModal = document.getElementById("TitleModal");
  titleModal.innerHTML = "Actualizar Libros";

  var contentModal = document.getElementById("contentModal");
  contentModal.innerHTML = "";

  var formulario = document.createElement('form');
  formulario.setAttribute("id", "formActualizar");
  formulario.setAttribute("class", "form-group");

  var isbnLabel = document.createElement('label');
  isbnLabel.innerHTML = "ISBN: ";
  formulario.appendChild(isbnLabel);
  var isbnInput = document.createElement('input');
  isbnInput.setAttribute("id", "isbnInput");
  isbnInput.required = true;
  formulario.appendChild(isbnInput);

  var editorialLabel = document.createElement('label');
  editorialLabel.innerHTML = "Editorial: ";
  formulario.appendChild(editorialLabel);
  var editorialInput = document.createElement('input');
  editorialInput.setAttribute("id", "editorialInput");
  editorialInput.required = true;
  formulario.appendChild(editorialInput);

  var generoLabel = document.createElement('label');
  generoLabel.innerHTML = "Género: ";
  formulario.appendChild(generoLabel);
  var generoInput = document.createElement('input');
  generoInput.setAttribute("id", "generoInput");
  generoInput.required = true;
  formulario.appendChild(generoInput);

  var yearLabel = document.createElement('label');
  yearLabel.innerHTML = "Fecha Publicación: ";
  formulario.appendChild(yearLabel);
  var yearInput = document.createElement('input');
  yearInput.setAttribute("id", "yearInput");
  yearInput.required = true;
  formulario.appendChild(yearInput);

  var idAutorLabel = document.createElement('label');
  idAutorLabel.innerHTML = "ID Autor: ";
  formulario.appendChild(idAutorLabel);
  var idAutorInput = document.createElement('input');
  idAutorInput.setAttribute("id", "idAutorInput");
  idAutorInput.required = true;
  formulario.appendChild(idAutorInput);

  contentModal.appendChild(formulario);

  var boton = document.getElementById("modalButton");
  boton.innerHTML = "Crear";
  boton.setAttribute("onclick", "crearBook()");
}

function crearUserModal() {
  var titleModal = document.getElementById("TitleModal");
  titleModal.innerHTML = "Actualizar Usuarios";

  var contentModal = document.getElementById("contentModal");
  contentModal.innerHTML = "";

  var formulario = document.createElement('form');
  formulario.setAttribute("id", "formActualizar");
  formulario.setAttribute("class", "form-group");

  var nombreLabel = document.createElement('label');
  nombreLabel.innerHTML = "Nombre de Usuario: ";
  formulario.appendChild(nombreLabel);
  var nombreInput = document.createElement('input');
  nombreInput.setAttribute("id", "nombreInput");
  nombreInput.required = true;
  formulario.appendChild(nombreInput);

  var passLabel = document.createElement('label');
  passLabel.innerHTML = "Contraseña: ";
  formulario.appendChild(passLabel);
  var passInput = document.createElement('input');
  passInput.setAttribute("id", "passInput");
  passInput.required = true;
  formulario.appendChild(passInput);

  var tipoLabel = document.createElement('label');
  tipoLabel.innerHTML = "Tipo Usuario: ";
  formulario.appendChild(tipoLabel);
  var tipoInput = document.createElement('input');
  tipoInput.setAttribute("id", "tipoInput");
  tipoInput.required = true;
  formulario.appendChild(tipoInput);

  contentModal.appendChild(formulario);

  var boton = document.getElementById("modalButton");
  boton.innerHTML = "Crear";
  boton.setAttribute("onclick", "crearUser()");
}

function crearAuthor(){
  var cedula = document.getElementById("ccInput").value;
  var nombre = document.getElementById("nombreInput").value;
  var nacion = document.getElementById("nacionInput").value;
  console.log(cedula, nombre, nacion);
  fetch(`${API_URL}/autor/create/${nombre}/${nacion}/${cedula}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "tipo": user.tipo
    },
  }).then((res) => res.json())
    .then((res) => {
      alertManager("success", "Autor creado");
      console.log(res);
      listarAutores();
    })
    .catch((error) => {
      alertManager("error", "Autor no creado");
      console.log(error);
    })

}

function crearBook(){
  var isbn = document.getElementById("isbnInput").value;
  var editorial = document.getElementById("editorialInput").value;
  var genero = document.getElementById("generoInput").value;
  var year = document.getElementById("yearInput").value;
  var id_Autor = document.getElementById("idAutorInput").value;

  fetch(`${API_URL}/libro/create/${genero}/${editorial}/${isbn}/${year}/${id_Autor}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "tipo": user.tipo
    },
  }).then((res) => res.json())
    .then((res) => {
      alertManager("success", "Libro creado");
      console.log(res);
      listarLibros();
    })
    .catch((error) => {
      alertManager("error", "Libro no creado");
      console.log(error);
    })
}

function crearUser(){
  var nombreUsuario = document.getElementById("nombreInput").value;
  var password = document.getElementById("passInput").value;
  var tipo = document.getElementById("tipoInput").value;

  fetch(`${API_URL}/usuario/create/${nombreUsuario}/${password}/${tipo}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "tipo": user.tipo
    },
  }).then((res) => res.json())
    .then((res) => {
      alertManager("success", "Usuario creado");
      console.log(res);
      listarUsuarios();
    })
    .catch((error) => {
      alertManager("error", "Usuario no creado");
      console.log(error);
    })

}
