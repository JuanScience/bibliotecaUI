const API_URL = 'http://localhost:6969';
let libros = [];
let deleteId = null;

const login = () => {
    const formData = new FormData(document.querySelector('#formLogin'));    
    if(!formData.get('nombre').length || !formData.get('pass').length ) {
      document.querySelector('#formLogin').innerHTML = '* Llena todos los campos';
      return;
    }    
    document.querySelector('#formLogin').innerHTML = '';    
    const usuario = {
      Nombre: formData.get('nombre'),
      Pass: formData.get('pass')
    }  
    fetch(API_URL + "/index.html/" + usuario.Nombre + "/" + usuario.Pass, {
      method: 'POST',
      Sbody: JSON.stringify(usuario),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .catch(error => {
      alertManager('error', error);
      document.querySelector('#formLogin').reset();
    })
    .then(response => {
      alertManager('success', response.Nombre)
      console.log(res)
    })
  }


/** ALERT */
const alertManager = (typeMsg, message) => {
  const alert = document.querySelector('#alert');

  alert.innerHTML = message || 'Se produjo cambios';
  alert.classList.add(typeMsg);
  alert.style.display = 'block';

  setTimeout(() => {
    alert.style.display = 'none';
    alert.classList.remove(typeMsg);
  }, 3500);

}