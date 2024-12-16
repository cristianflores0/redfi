document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const validateBtn = document.getElementById("validateBtn");

    validateBtn.addEventListener("click", function () {
        const inputs = form.querySelectorAll("input, textarea");
        let allFieldsFilled = true;

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                allFieldsFilled = false;
            }
        });

        if (allFieldsFilled) {
            Swal.fire({
                icon: 'success',
                title: '¡Formulario enviado!',
                text: 'Todos los campos están completos. Enviando el formulario...',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                form.submit(); 
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hay campos incompletos. Por favor, rellénalos todos.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});
