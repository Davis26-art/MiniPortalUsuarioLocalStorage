// --- Referencias a botones ---
const btnGuardar = document.getElementById("btnGuardar");
const btnVer = document.getElementById("btnVer");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnBorrar = document.getElementById("btnBorrar");

// --- Referencia a los inputs ---
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const edadInput = document.getElementById("edad");

// --- Referencia al contenedor de resultados ---
const divResultado = document.querySelector(".resultado");

let datosVisibles = false;

// --- Limpiar errores en tiempo real ---
[nombreInput, emailInput, edadInput].forEach((input) => {
  input.addEventListener("input", () => {
    document.getElementById(`error-${input.id}`).textContent = "";
  });
});

// --- Guardar datos ---
btnGuardar.addEventListener("click", () => {
  limpiarErrores();
  validarYGuardar();
});

// --- Ver datos guardados ---
btnVer.addEventListener("click", () => {
  if (!datosVisibles) {
    // Mostrar datos
    mostrarTodosLosUsuarios();
    divResultado.style.display = "block";
    btnVer.textContent = "Ocultar datos";
    datosVisibles = true;
  } else {
    // Ocultar datos
    divResultado.style.display = "none";
    btnVer.textContent = "Ver datos";
    datosVisibles = false;
  }
});

// --- Limpiar formulario ---
btnLimpiar.addEventListener("click", () => {
  limpiarFormulario();
});

// --- Borrar todos los datos ---
btnBorrar.addEventListener("click", () => {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.length === 0) {
    alert("⚠️ No hay usuarios para borrar.");
    return;
  }

  localStorage.removeItem("usuarios");
  divResultado.innerHTML = `<p style="color:#506879; text-align:center;">🗑️ Todos los datos han sido borrados.</p>`;
  alert("🗑️ Todos los datos han sido borrados.");
});

// --- Validar y guardar usuario ---
function validarYGuardar() {
  let valido = true;

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const edad = edadInput.value.trim();

  // Validaciones
  if (nombre === "") {
    document.getElementById("error-nombre").textContent =
      "El nombre es obligatorio.";
    valido = false;
  }

  if (email === "" || !email.includes("@") || !email.includes(".")) {
    document.getElementById("error-email").textContent =
      "Ingrese un correo válido.";
    valido = false;
  }

  if (edad === "" || edad < 1 || edad > 115) {
    document.getElementById("error-edad").textContent =
      "Ingrese una edad válida.";
    valido = false;
  }

  if (!valido) return;

  // Obtenemos los usuarios existentes
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Agregamos el nuevo usuario
  const nuevoUsuario = { nombre, email, edad };
  usuarios.push(nuevoUsuario);

  // Guardamos el arreglo actualizado
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("✅ Usuario guardado correctamente.");

  limpiarFormulario(false);
  mostrarTodosLosUsuarios();
}

// --- Función para limpiar errores ---
function limpiarErrores() {
  document.getElementById("error-nombre").textContent = "";
  document.getElementById("error-email").textContent = "";
  document.getElementById("error-edad").textContent = "";
  //   document.getElementById('error-resultado').textContent = '';
}

// --- Mostrar todos los usuarios ---
function mostrarTodosLosUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.length === 0) {
    divResultado.innerHTML = `<p style="color:red; text-align:center;">⚠️ No hay usuarios guardados.</p>`;
    return;
  }

  let html = `<h3 style="text-align:center;">📋 Lista de Usuarios Registrados</h3>`;

  usuarios.forEach((u, index) => {
    html += `
            <div class="tarjeta-usuario" style="border:1px solid #ccc; padding:10px; margin:10px auto; border-radius:8px; width:90%; max-width:400px; background-color:#f9f9f9;">
                <p style="text-align: center"><strong>📋 Usuario: #${
                  index + 1
                }</strong></p>
                <hr>
                <p><strong>👤 Nombre:</strong> ${u.nombre}</p>
                <p><strong>📧 Email:</strong> ${u.email}</p>
                <p><strong>🎂 Edad:</strong> ${u.edad}</p>
                <button class="btn-eliminar" data-index="${index}" style="display:block; margin:10px auto; padding:5px 10px; background-color:#e74c3c; color:white; border:none; border-radius:6px; cursor:pointer;">❌ Eliminar</button>
            </div>
        `;
  });

  divResultado.innerHTML = html;

  // --- Activamos los botones de eliminar individuales ---
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = e.target.dataset.index;
      eliminarUsuario(i);
    });
  });

  // Asegurar que los datos queden visibles y botón actualizado
  divResultado.style.display = "block";
  btnVer.textContent = "Ocultar datos";
  datosVisibles = true;
}

// --- Eliminar un usuario específico ---
function eliminarUsuario(index) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.splice(index, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mostrarTodosLosUsuarios();
}

// --- Limpiar formulario ---
function limpiarFormulario(mostrarAlert = true) {
  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const edad = edadInput.value.trim();

  // Siempre limpiar errores
  limpiarErrores();

  // Verificar si ya está vacío
  if (nombre === "" && email === "" && edad === "") {
    if (mostrarAlert) {
      alert("⚠️ El formulario ya está vacío.\nNo hay nada que limpiar.");
    }
    return;
  }

  // Si tiene datos, lo limpiamos
  nombreInput.value = "";
  emailInput.value = "";
  edadInput.value = "";

  if (mostrarAlert) {
    alert("🧹 Formulario limpiado correctamente.");
  }
}

