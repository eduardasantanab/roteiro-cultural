Parse.initialize("v6UGSvLazH3FwPjOZPHajXTAFWyxelCPi1BJ5HAn", "SQzEsdUghX0atms3dAziOGhDPyd3lDDu9wGPeAYn");
Parse.serverURL = "https://parseapi.back4app.com/";
let filteredMuseums = '';

// Essa função filtra os museus do banco de dados da prefeitura.
async function searchMuseums(bairro) {
    try {
        const url = 'museus.json';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar os museus. Status: ' + response.status);
        }

        const museumsData = await response.json();
        console.log('Museus encontrados:', museumsData);

        const records = museumsData.records; // Acessar os registros diretamente

        if (records && records.length > 0) {
            // Filtrar os museus pelo bairro fornecido
            filteredMuseums = records.filter(record => {
                return record[3] && record[3].toLowerCase() === bairro.toLowerCase(); // Bairro está no índice 3
            });
            console.log('Museus filtrados:', filteredMuseums);
            global = filteredMuseums;
            return filteredMuseums.map(record => ({ nome: record[1], bairro: record[3] })); // Nome do museu está no índice 1
        } else {
            throw new Error('Nenhum museu encontrado para o bairro fornecido.');
        }
    } catch (error) {
        console.error("Erro ao buscar os museus:", error);
        throw error;
    }
}


async function saveAddressInfo(cep) {
    try {
        const url = `https://viacep.com.br/ws/${cep}/json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao obter os dados do endereço.');
        }

        const addressData = await response.json();
        console.log('Informações do endereço:', addressData); // Mostrar informações do endereço no console

        // Extrair o bairro dos dados do endereço
        let bairro = addressData.bairro;

        // Se o bairro não estiver disponivel, procurar outras propriedades que possam conter essa informação
        if (!bairro) {
            bairro = addressData.sublocality || addressData.subLocality || addressData.sublocality_level_1 || addressData.subLocalityLevel1;
        }

        if (!bairro) {
            throw new Error('Bairro não encontrado nos dados do endereço.');
        }

        // Armazenar as informações do endereço no banco de dados do back4app
        const Address = Parse.Object.extend("Address");
        const address = new Address();
        address.set("bairro", addressData.bairro);
        address.set("cep", addressData.cep);
        address.set("complemento", addressData.complemento);
        address.set("logradouro", addressData.logradouro);
        address.set("ddd", addressData.ddd);
        address.set("localidade", addressData.localidade);
        address.set("gia", addressData.gia);
        address.set("ibge", addressData.ibge);
        address.set("siafi", addressData.siafi);
        address.set("uf", addressData.uf);

        await address.save();
        console.log('Endereço salvo no banco de dados:', address);

        // Chamar a função para buscar os museus no bairro do usuário
        const museumsData = await searchMuseums(bairro);

        return addressData;
    } catch (error) {
        console.error("Erro ao salvar informações do endereço:", error);
        throw error;
    }
}

// Essa função busca informções do cep informado pelo usuário
document.addEventListener('DOMContentLoaded', async function () {
    var forms = document.querySelector('.forms-container');
    var campo = document.querySelector('.box-c');
    var valorInput = '';

    forms.addEventListener('submit', async function(e) {
        e.preventDefault();
        valorInput = campo.value.trim();
        console.log('CEP fornecido pelo usuário:', valorInput);

        try {
            // Buscar informações do endereço a partir do CEP fornecido pelo usuário
            const addressData = await saveAddressInfo(valorInput);

            // Buscar todos os museus
            const museumsData = await searchMuseums(addressData.bairro);

            // Filtrar os museus pelo bairro do usuario
            const filteredMuseums = museumsData.filter(museum => museum.bairro === addressData.localidade);

        } catch (error) {
            console.error('Ocorreu um erro:', error);
            throw error;
        }
    });

});
document.addEventListener('DOMContentLoaded', function () {
    const armazenarValores = document.querySelector('.forms-container');
    const exibicao = document.querySelector('.output-container');
    const cleanButton = document.querySelector('.clean-button');

    armazenarValores.addEventListener('submit', async function (e) {
        e.preventDefault();
        const campo = document.querySelector('.box-c');
        const valorInput = campo.value.trim();
        console.log('CEP fornecido pelo usuário:', valorInput);

        // Remover o conteúdo anterior antes de exibir o gif de carregamento
        exibicao.innerHTML = '';

        // Verificar se o campo não está vazio antes de exibir a animação de carregamento
        if (valorInput !== '') {
            // Exibir a animação de carregamento
            const loading = createLoadingAnimation();
            exibicao.appendChild(loading);
        }

        try {
            const addressData = await saveAddressInfo(valorInput);

            exibir();

        } catch (error) {
            console.error('Ocorreu um erro:', error);
            throw error;
        }
        finally {
            exibicao.removeChild(loading);
            campo.value = '';
        }
    });

    const exibir = () => {

        exibicao.innerHTML = '';

        if (filteredMuseums.length > 0) {
            for (let i = 0; i < filteredMuseums.length; i++) {

                // array de informações de um museu dentro do array de todos os museus
                const arrayInterno = filteredMuseums[i];

                // container div pai para armazenar todo o conteúdo
                const museuContainer = document.createElement('div');
                museuContainer.classList.add('museu-container');

                // numeração para cada museu apenas para organizar
                const numeracao = document.createElement('span');
                numeracao.innerText = (i + 1);

                // dados do museu
                const texto = document.createTextNode(arrayInterno[1]);
                const nomeMuseu = document.createElement('div');
                nomeMuseu.appendChild(texto);
                nomeMuseu.classList.add('nome-museu');

                const texto2 = document.createTextNode(arrayInterno[2]);
                const descricaoMuseu = document.createElement('div');
                descricaoMuseu.appendChild(texto2);

                // organização: botando dados do museu dentro de uma div e atribuindo uma classe
                const valuesAPI = document.createElement('div');
                valuesAPI.append(nomeMuseu);
                valuesAPI.append(descricaoMuseu);
                valuesAPI.classList.add('banco-de-dados-museus');

                // exibição de dados dos museus
                museuContainer.appendChild(numeracao);
                museuContainer.appendChild(valuesAPI);

                exibicao.appendChild(museuContainer);
            }
        } else {
            const mensagem = document.createElement('h1');
            mensagem.innerText = 'Ops! Infelizmente nenhum museu foi encontrado no CEP fornecido. Veja nossas recomendações abaixo.';
            mensagem.style.color = 'red';
            mensagem.style.fontFamily = 'Arial, sans-serif';
            mensagem.style.fontSize = '18px';
            exibicao.appendChild(mensagem);
        }
    }

    cleanButton.addEventListener('click', () => {
        global.splice(0, global.length)
        exibir()
    })

    function createLoadingAnimation() {
        const loading = document.createElement('div');
        loading.classList.add('loading-container');
        const loadingImg = document.createElement('img');
        loadingImg.src = '/arquivos/icons8-spinner.gif';
        loadingImg.alt = 'Carregando...';
        loading.appendChild(loadingImg);
        return loading;
    }

});
