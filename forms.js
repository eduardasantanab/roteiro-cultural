// Configure o SDK do Parse
Parse.initialize("v6UGSvLazH3FwPjOZPHajXTAFWyxelCPi1BJ5HAn", "SQzEsdUghX0atms3dAziOGhDPyd3lDDu9wGPeAYn");
Parse.serverURL = "https://parseapi.back4app.com/";

document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelector('.forms-newsletter');
    var campo = document.querySelector('.form-message');
    var campo2 = document.querySelector('.form-email');
    var campo3 = document.querySelector('.form-textarea');
    var errorMessage = document.querySelector('.error-message');

    forms.addEventListener('submit', async function(e) {
        e.preventDefault();


        if (!campo.value || !campo2.value || !campo3.value) {
            errorMessage.textContent = "Por favor, preencha todos os campos obrigatórios!";
            errorMessage.style.display = "block";
            return;
        }

        var Formulario = Parse.Object.extend("Formulario");
        var formulario = new Formulario();
        formulario.set("mensagem", campo.value);
        formulario.set("email", campo2.value);
        formulario.set("texto", campo3.value);

        try {

            await formulario.save();
            console.log("Dados do formulário salvos com sucesso!");

            campo.value = '';
            campo2.value = '';
            campo3.value = '';

            errorMessage.textContent = "";
            errorMessage.style.display = "none";
        } catch (error) {
            console.error("Erro ao salvar dados do formulário:", error);
            throw error;
        }
    });
});
