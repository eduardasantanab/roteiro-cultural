document.addEventListener('DOMContentLoaded', function () {

    var forms = document.querySelector('.forms-container')
    var campo = document.querySelector('.box-c')
    var valorInput = ''

    forms.addEventListener('submit', async function(e) {
        e.preventDefault()
        valorInput = campo.value.trim()
        console.log(valorInput);
    
        const url = `https://viacep.com.br/ws/${valorInput}/json`;
    
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Erro ao obter os dados.');
            }
    
            const data = await response.json();
            console.log(data);
            return data;
    
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            throw error;
        }
        finally {
            campo.value = ''
        }
    });
});