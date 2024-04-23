// Selectores
const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita');
const formularioInput = document.querySelector('#formulario-cita input[type="submit"]')
const contenedorCitas = document.querySelector('#citas');

// Eventos
pacienteInput.addEventListener('input', datosCita);
propietarioInput.addEventListener('input', datosCita);
emailInput.addEventListener('input', datosCita);
fechaInput.addEventListener('input', datosCita);
sintomasInput.addEventListener('input', datosCita);

formulario.addEventListener('submit', submitCita)

let editando = false;

//Objeto Cita
const citaObj = {
    id: generarId(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: ''
}

class Notification  {
    constructor({texto, tipo}) {
        this.texto = texto,
        this.tipo = tipo

        this.mostrar()
    
    }
    
    mostrar() {

        //Crear la notificación
        const alerta = document.createElement('DIV')
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert',
        'uppercase', 'font-bold', 'text-sm');

        // Eliminar alertas duplicadas
        const alertaPrevia = document.querySelector('.alert')
        // Optional Chaning para simplificar un condicional if
        alertaPrevia?.remove(); // Si existe el elemento entonces ejecuta el código del lado derecho del signo
        
        //Si es de tipo error, agrega una clase
        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500')

        //Mensaje de error
        alerta.textContent = this.texto

        //Insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario);

        //Quitar después de 5 segundos
        setTimeout(() => {
            alerta.remove()
        }, 3000)
        
    }
    
}

class AdminCitas {
    constructor() {
        this.citas = []

        console.log(this.citas);
    }

    agregar(cita) {
         this.citas = [...this.citas, cita];
         
    }

    editar(citaActuaizada) {
        //Identifica la cita que deseamos actualizar mediante la iteración con map, y el nuevo objeto reescribe el anterior
        this.citas = this.citas.map( cita => cita.id === citaActuaizada.id ? citaActuaizada : cita)
        this.mostrar(); //Renderiza el código con la cita actualizada
    }
           
    eliminar(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.mostrar(); // Para actualizar de nuevo nuestro código HTML 
    }

    mostrar() {
        
        //Limpiar el HTML
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }

        // Comprobando si el contenedorCitas está vacío
        if(this.citas.length === 0) {
            contenedorCitas.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>'
            return
        }

        // Generando las citas
        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');
        
            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;
        
            const propietario = document.createElement('p');
            propietario.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;
        
            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;
        
            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;
        
            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;
        

            // Botón de Editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'btn-editar');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            const clone = structuredClone(cita) // Toma una copia del objeto 'cita' hace lo mismo que un spread operator
            btnEditar.onclick = () => {
                cargarEdicion(clone)
            }

            // Botón de Eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnEliminar.onclick = () => this.eliminar(cita.id);

            // Creando el contenedor para agregar los botones
            const contenedorBotones = document.createElement('DIV');
            contenedorBotones.classList.add('flex', 'justify-between', 'mt-10' )

            // Agregar los botones en el contenedor
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);


            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(contenedorBotones);

            contenedorCitas.appendChild(divCita);

        });    
    }
}


function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
    
}

const citas = new AdminCitas();

function submitCita(e) {
    e.preventDefault();

    if(Object.values(citaObj).some(value => value.trim() === '')) {
        new Notification({
            texto: 'Todos los Campos son Obligatorios',
            tipo: 'error'
        })
        
        return
    
    }

    if(editando) {
        citas.editar({...citaObj}); // Para que cada que enviamos información se reinicie el objeto y no reescriba el objeto anterior
        new Notification({
            texto: 'Guardado Correctamente',
            tipo: 'exito'
        })
    } else {
        citas.agregar({...citaObj}); // Toma una copia de 'citaObj' para que no reescriba el objeto anterior 
        citas.mostrar();

        new Notification({
            texto: 'Paciente Registrado',
            tipo: 'exito'
        })


    }

    formulario.reset();
    reiniciarObjetoCita();
    formularioInput.value = 'Registrar Paciente';
    editando = false;

}

function reiniciarObjetoCita() {
    //Reiniciar el objeto
    /* citaObj.paciente = '';
    citaObj.id = generarId();
    citaObj.propietario = '';
    citaObj.email = '';
    citaObj.fecha = '';
    citaObj.sintomas = ''; */

    Object.assign(citaObj, { // (En que objeto quieres escribir, con qué código lo quieres reemplazar)
        id: generarId(), // Cuando se vuelve a llamar la función 'reiniciarObjetoCita' genera un id único
        paciente: '',
        propietario: '',
        email: '',
        fecha: '',
        sintomas: ''
    })
}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now();
}
// Toma la cita y la agrega a nuestro objeto y también al formulario
function cargarEdicion(cita) {
    //Escribiendo en el objeto original
    Object.assign(citaObj, cita);

    // Escribiendo en el html
    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;

    editando = true;

    formularioInput.value = 'Guardar Cambios';
}

