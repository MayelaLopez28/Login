const emailEl  = document.getElementById('email');
const passEl   = document.getElementById('password');
const emailErr = document.getElementById('emailError');
const passErr  = document.getElementById('passError');
const btn      = document.getElementById('submitBtn');
const msg      = document.getElementById('msg');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function checkEmail(value) {
    value = value.trim();
    if (!value) {
        return 'El correo es obligatorio.';
    }

    if (!EMAIL_RE.test(value)) {
        return 'Ingresa un correo válido (ej. nombre@dominio.com).';
    }

    return '';
}

function checkPassword(value) {
    if (!value) {
        return 'La contraseña es obligatoria.';
    }

    if (value.length < 8) {
        return 'Debe tener al menos 8 caracteres.';
    }

    if (!/[A-Z]/.test(value)) {
        return 'Incluye al menos una mayúscula.';
    }

    if (!/[a-z]/.test(value)) {
        return 'Incluye al menos una minúscula.';
    }

    if (!/\d/.test(value)) {
        return 'Incluye al menos un número.';
    }

    return '';
}

function show(input, errEl, error) {
    errEl.textContent = error;
    input.classList.toggle('invalid', !!error);
    input.classList.toggle('valid', !error && input.value !== '');
}

let touched = { email: false, pass: false };

function validate() {
    const e = checkEmail(emailEl.value);
    const p = checkPassword(passEl.value);

    if (touched.email) {
        show(emailEl, emailErr, e);
    }

    if (touched.pass)  {
        show(passEl, passErr, p);
    }
    btn.disabled = !!(e || p);
    return !(e || p);
}

emailEl.addEventListener('input', validate);
passEl.addEventListener('input', validate);
emailEl.addEventListener('blur', () => { touched.email = true; validate(); });
passEl.addEventListener('blur',  () => { touched.pass = true; validate(); });

const toggleBtn = document.getElementById('toggle');
const eyeOff = document.getElementById('eyeOff'); // ojo tachado = contraseña oculta
const eyeOn  = document.getElementById('eyeOn');  // ojo abierto = contraseña visible

toggleBtn.addEventListener('click', () => {
    const showing = passEl.type === 'text';
    passEl.type = showing ? 'password' : 'text';
    eyeOff.style.display = showing ? 'block' : 'none';
    eyeOn.style.display  = showing ? 'none'  : 'block';
    toggleBtn.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
});

document.getElementById('loginForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    touched = { email: true, pass: true };

    if (!validate()) {
        return;
    }

    msg.className = 'msg';
    msg.textContent = 'Verificando...';

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailEl.value.trim(),
                password: passEl.value,
                remember: document.getElementById('remember').checked
            })
        });
        const data = await res.json();
        msg.className = data.ok ? 'msg' : 'msg bad';
        msg.textContent = data.ok ? '✔ ' + data.message : data.message;
    } catch (err) {
        msg.className = 'msg bad';
        msg.textContent = 'No se pudo conectar';
    }
});