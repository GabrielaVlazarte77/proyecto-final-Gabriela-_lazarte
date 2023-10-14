document.addEventListener("DOMContentLoaded", function () {
    // Declaro mis variables
    const listaProductos = document.getElementById("lista-productos");
    const totalidad = document.getElementById("total");
    const carrito = document.getElementById("carrito");
    const mostrarCarritoBtn = document.getElementById("mostrar-carrito-btn");
    const comprarBtn = document.getElementById("comprar-btn");

    let productos = [];
    let carrito_compras = [];
    let carritoVisible = false;

    // Función para cargar productos desde el archivo JSON
    function cargarProductos() {
        fetch('productos.json')
            .then(response => response.json())
            .then(data => {
                productos = data;
                mostrarProductos();
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    // Función para mostrar los productos en la lista
    function mostrarProductos() {
        listaProductos.innerHTML = "";
        productos.forEach((producto, index) => {
            const li = document.createElement("li");

            // Crear una imagen y agregarla al elemento li
            const imagen = document.createElement("img");
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;
            li.appendChild(imagen);

            // Crear elementos de texto para nombre y precio
            const nombreProducto = document.createElement("span");
            nombreProducto.textContent = producto.nombre;
            const precioProducto = document.createElement("span");
            precioProducto.textContent = ` | Precio: $${producto.precio}`;

            // Agregar los elementos de texto al elemento li
            li.appendChild(nombreProducto);
            li.appendChild(precioProducto);

            const agregarAlCarritoBtn = document.createElement("button");
            agregarAlCarritoBtn.textContent = "Agregar al carrito";
            agregarAlCarritoBtn.addEventListener("click", () => agregarAlCarrito(producto));

            // Agregar el botón al elemento li
            li.appendChild(agregarAlCarritoBtn);

            // Agregar el elemento li a la lista de productos
            listaProductos.appendChild(li);
        });
    }

    // Función para agregar un producto al carrito de compras
    function agregarAlCarrito(producto) {
        carrito_compras.push(producto);
        mostrarCarrito();
        calcularTotal();
        actualizarCarritoEnLocalStorage();
    }

    // Función para mostrar y/o ocultar el carrito
    function vistaCarrito() {
        carritoVisible = !carritoVisible;
        if (carritoVisible) {
            carrito.style.display = "block";
        } else {
            carrito.style.display = "none";
        }
    }

    // Función para mostrar los productos en el carrito
    function mostrarCarrito() {
        carrito.innerHTML = "";
        carrito_compras.forEach((producto, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${producto.nombre} | Precio: $${producto.precio}`;
            const eliminarDelCarritoBtn = document.createElement("button");
            eliminarDelCarritoBtn.textContent = "Eliminar del carrito";
            eliminarDelCarritoBtn.addEventListener("click", () => eliminarDelCarrito(index));
            li.appendChild(eliminarDelCarritoBtn);
            carrito.appendChild(li);
        });
    }

    // Función para calcular el total del carrito
    function calcularTotal() {
        let total = 0;
        carrito_compras.forEach((producto) => {
            total += producto.precio;
        });
        totalidad.textContent = total;
    }

    // Función para eliminar un producto del carrito de compras
    function eliminarDelCarrito(index) {
        carrito_compras.splice(index, 1);
        mostrarCarrito();
        calcularTotal();
        actualizarCarritoEnLocalStorage();
    }

    // Función para guardar el carrito en el LocalStorage
    function actualizarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito_compras));
    }

    // Evento para mostrar/ocultar el carrito
    mostrarCarritoBtn.addEventListener("click", () => {
        vistaCarrito();
    });

    // Evento para comprar
    comprarBtn.addEventListener("click", () => {
        const total = totalidad.textContent;
        Swal.fire({
            title: "¿Desea confirmar la compra?",
            text: `Total: $${total}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Compra realizada. Muchas gracias por su visita!", '', "success");
                carrito_compras = [];
                mostrarCarrito();
                calcularTotal();
                actualizarCarritoEnLocalStorage();
            }
        });
    });

    // Recuperar el carrito desde LocalStorage (si existe)
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoGuardado) {
        carrito_compras = carritoGuardado;
        mostrarCarrito();
        calcularTotal();
    }

    // Llama a la función para cargar productos
    cargarProductos();
});