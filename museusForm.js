/*document.addEventListener('DOMContentLoaded', function () {
    const global = [];
    const armazenarValores = document.querySelector('.forms-container');
    const campo = document.querySelector('.box-c');
    const exibicao = document.querySelector('.output-container');
    const cleanButton = document.querySelector('.clean-button');

    armazenarValores.addEventListener('submit', function (e) {
        e.preventDefault();
        global.push("isso é um teste para ver se ta certo");
        exibir()
    });

    const exibir = () => {
        exibicao.innerHTML = '';
        
        for (i = 0; i < global.length; i++) {
            const values = document.createElement('div');
            const texto = document.createTextNode(global[i])
            values.appendChild(texto)

            exibicao.appendChild(values);
        }
    }

    cleanButton.addEventListener('click', () => {
        global.splice(0, global.length)
        exibir()
    })
});*/
