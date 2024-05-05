// Configure o SDK do Parse
Parse.initialize("v6UGSvLazH3FwPjOZPHajXTAFWyxelCPi1BJ5HAn", "SQzEsdUghX0atms3dAziOGhDPyd3lDDu9wGPeAYn");
Parse.serverURL = "https://parseapi.back4app.com/";


document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelector('.forms-newsletter');
    var campo = document.querySelector('.form-message');
    var campo2 = document.querySelector('.form-email');
    var campo3 = document.querySelector('.form-textarea');

    forms.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Criar um objeto Parse para armazenar os dados do formulário
        var Formulario = Parse.Object.extend("Formulario");
        var formulario = new Formulario();
        formulario.set("mensagem", campo.value);
        formulario.set("email", campo2.value);
        formulario.set("texto", campo3.value);

        try {
            // Salvar os dados no banco de dados do Parse
            await formulario.save();
            console.log("Dados do formulário salvos com sucesso!");

            // Limpar os campos do formulário após salvar
            campo.value = '';
            campo2.value = '';
            campo3.value = '';
        } catch (error) {
            console.error("Erro ao salvar dados do formulário:", error);
            throw error;
        }
    });
});
