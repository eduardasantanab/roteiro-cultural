document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelector('.forms-newsletter')
    var campo = document.querySelector('.form-message')
    var campo2 = document.querySelector('.form-email')
    var campo3 = document.querySelector('.form-textarea')
    var valorInput = []

    forms.addEventListener('submit', function(e) {
        e.preventDefault()
        valorInput.push(campo.value)
        valorInput.push(campo2.value)
        valorInput.push(campo3.value)
        console.log(valorInput);
        campo.value = ''
        campo2.value = ''
        campo3.value = ''
    });
});