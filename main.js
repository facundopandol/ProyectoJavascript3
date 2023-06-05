let entradasDisponibles = [
    { tipo: 'General', precio: 500.0, cantidad: 100 },
    { tipo: 'VIP', precio: 2000.0, cantidad: 20 },
    { tipo: 'Tribuna Derecha', precio: 1500.0, cantidad: 50 },
    { tipo: 'Tribuna Izquierda', precio: 1500.0, cantidad: 50 }
];

let carrito = [];
let informacionUsuario = {};

function agregarEntrada(entrada) {
    const cantidad = parseInt(prompt(`Ingrese la cantidad de entradas ${entrada.tipo} a comprar:`));
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('La cantidad ingresada no es válida. Por favor ingrese un número válido.');
        return;
    }
    if (entrada.cantidad < cantidad) {
        alert('Lo sentimos, no hay suficientes entradas disponibles en esa ubicación.');
        return;
    }

    const subtotal = entrada.precio * cantidad;
    const entradaExistente = carrito.find(e => e.tipo === entrada.tipo);

    if (entradaExistente) {
        entradaExistente.cantidad += cantidad;
        entradaExistente.subtotal += subtotal;
    } else {
        carrito.push({ tipo: entrada.tipo, precio: entrada.precio, cantidad, subtotal });
    }

    // ACTUALIZAR STOCK DE ENTRADAS
    entrada.cantidad -= cantidad;
    alert(`Se agregaron ${cantidad} entradas ${entrada.tipo} al carrito.`);

    localStorage.setItem('carrito', JSON.stringify(carrito)); // Almacenar carrito en el almacenamiento local

    mostrarCarrito(); // Actualizar la visualización del carrito
}

function mostrarEntradasDisponibles() {
    const container = document.getElementById('entradas-container');
    container.innerHTML = '';

    entradasDisponibles.forEach(entrada => {
        const boton = document.createElement('button');
        boton.textContent = entrada.tipo;
        boton.classList.add('button');
        boton.addEventListener('click', () => agregarEntrada(entrada));
        container.appendChild(boton);
    });
}

function mostrarCarrito() {
    const carritoContenedor = document.getElementById('carrito-container');
    carritoContenedor.innerHTML = '';

    const carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'));
    const informacionUsuarioAlmacenada = JSON.parse(localStorage.getItem('informacionUsuario'));

    if (carritoAlmacenado && carritoAlmacenado.length > 0) {
        let total = 0;

        carritoAlmacenado.forEach(entrada => {
            const entradaElement = document.createElement('p');
            entradaElement.textContent = `${entrada.cantidad} entradas ${entrada.tipo} $${entrada.precio} cada una. Subtotal: $${entrada.subtotal}`;
            carritoContenedor.appendChild(entradaElement);
            total += entrada.subtotal;
        });

        const totalElement = document.createElement('p');
        totalElement.textContent = `Total: $${total}`;

        carritoContenedor.appendChild(totalElement);
    } else {
        carritoContenedor.textContent = 'El carrito está vacío.';
    }
}

function toggleCarrito() {
    const carritoContenedor = document.getElementById('carrito-container');

    if (carritoContenedor.classList.contains('hidden')) {
        carritoContenedor.classList.remove('hidden'); // Mostrar el carrito
        mostrarCarrito(); // Actualizar la visualización del carrito
    } else {
        carritoContenedor.classList.add('hidden'); // Ocultar el carrito
    }
}

function realizarCompra() {
    if (carrito.length === 0) {
        alert('El carrito está vacío. No se puede realizar la compra.');
        return;
    }

    const nombre = prompt('Ingrese su nombre:');
    const email = prompt('Ingrese su correo electrónico:');
    const telefono = prompt('Ingrese su número de teléfono:');

    informacionUsuario = {
        nombre,
        email,
        telefono
    };

    alert('Usted ha reservado sus entradas satisfactoriamente. Por email le llegará el comprobante para realizar el pago.\nGracias por usar nuestra página.');

    // Actualizar la información del usuario y reiniciar el carrito
    localStorage.setItem('informacionUsuario', JSON.stringify(informacionUsuario));
    localStorage.removeItem('carrito');
    carrito = [];

    mostrarCarrito(); // Actualizar la visualización del carrito
}

// Verificar si hay carrito y/o información de usuario almacenados en el almacenamiento local
const carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'));
const informacionUsuarioAlmacenada = JSON.parse(localStorage.getItem('informacionUsuario'));

if (carritoAlmacenado) {
    carrito = carritoAlmacenado;
}

if (informacionUsuarioAlmacenada) {
    informacionUsuario = informacionUsuarioAlmacenada;
}

mostrarEntradasDisponibles();

// Agregar botón "Mostrar carrito"
const mostrarCarritoButton = document.createElement('button');
mostrarCarritoButton.textContent = 'Mostrar carrito';
mostrarCarritoButton.classList.add('button');
mostrarCarritoButton.addEventListener('click', toggleCarrito);
document.getElementById('carrito-button-container').appendChild(mostrarCarritoButton);

// Agregar botón "Realizar compra"
const realizarCompraButton = document.createElement('button');
realizarCompraButton.textContent = 'Realizar compra';
realizarCompraButton.classList.add('button');
realizarCompraButton.addEventListener('click', () => {
    if (carrito.length > 0) {
        realizarCompra();
    } else {
        alert('El carrito está vacío. No se puede realizar la compra.');
    }
});
document.getElementById('carrito-button-container').appendChild(realizarCompraButton);
