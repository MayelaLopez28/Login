const USUARIO_VALIDO = "admin";
const PASSWORD_VALIDA = "clave2026";

const form = document.getElementById("formLogin");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const errorUsuario = document.getElementById("errorUsuario");
const errorPassword = document.getElementById("errorPassword");
const tarjeta = document.getElementById("tarjeta");

const fondo = document.getElementById("fondo");
const enlaceOlvide = document.getElementById("olvide");
const inputCorreo = document.getElementById("correo");
const errorCorreo = document.getElementById("errorCorreo");
const btnRestablecer = document.getElementById("restablecer");
const btnCerrar = document.getElementById("cerrar");

function mostrar(el, texto) {
    el.textContent = texto;
    el.classList.remove("oculto");
}
function ocultar(el) {
    el.textContent = "";
    el.classList.add("oculto");
}
function ocultarErrores() {
    ocultar(errorUsuario);
    ocultar(errorPassword);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    ocultarErrores();

    const usuario = inputUsuario.value.trim();
    const password = inputPassword.value.trim();
    const usuarioVacio = usuario === "";
    const passwordVacia = password === "";

    if (usuarioVacio) {
        mostrar(errorUsuario, "! ingresa tu cuenta de usuario");
    }

    if (passwordVacia) {
        mostrar(errorPassword, "! ingresa tu contraseña");
    }

    if (usuarioVacio || passwordVacia) {
        return;
    }

    if (usuario !== USUARIO_VALIDO || password !== PASSWORD_VALIDA) {
        mostrar(errorPassword, "! usuario o contraseña incorrectos");
        return;
    }

    tarjeta.innerHTML =
        '<div class="bienvenida"><h1>¡Bienvenido, ' + usuario + '!</h1>' +
        '<p>Iniciaste sesión correctamente.</p></div>';
});

inputUsuario.addEventListener("input", () => ocultar(errorUsuario));
inputPassword.addEventListener("input", () => ocultar(errorPassword));

function abrirVentana() {
    ocultar(errorCorreo);
    inputCorreo.value = "";
    fondo.classList.remove("oculto");
    inputCorreo.focus();
}
function cerrarVentana() {
    fondo.classList.add("oculto");
}

enlaceOlvide.addEventListener("click", function (event) {
    event.preventDefault();
    abrirVentana();
});
btnCerrar.addEventListener("click", cerrarVentana);
fondo.addEventListener("click", (e) => { if (e.target === fondo) cerrarVentana(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarVentana(); });
inputCorreo.addEventListener("input", () => ocultar(errorCorreo));

btnRestablecer.addEventListener("click", function () {
    const correo = inputCorreo.value.trim();

    if (correo === "" || !correo.includes("@")) {
        mostrar(errorCorreo, "! ingresa un correo electrónico válido");
        return;
    }

    cerrarVentana();
    alert("Se envió el enlace a " + correo);
});
