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

// Essa função organiza e armazena os museus do mesmo bairro do usuário.
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

        // Se o bairro não estiver disponível, procurar outras propriedades que possam conter essa informação
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
        console.log('Endereço salvo no banco de dados:', address); // Adicionando o console.log para verificar se os dados foram salvos

        // Chamar a função para buscar os museus no bairro do usuário
        const museumsData = await searchMuseums(bairro);

       // Armazenar os museus no banco de dados relacionados ao endereço
        const Museum = Parse.Object.extend("Museum");
        const museumObjects = museumsData.map(museum => {
        const museumObject = new Museum();
            museumObject.set("nome", museum.nome);
            museumObject.set("endereco", address); // Passar o objeto de endereço diretamente
            museumObject.set("cep", addressData.cep);
            return museumObject;
        })
        // Salvar todos os objetos do museu no banco de dados
        const savedMuseums = await Parse.Object.saveAll(museumObjects);

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
            console.log('Endereço encontrado:', addressData);

            // Buscar todos os museus
            const museumsData = await searchMuseums(addressData.bairro);
            console.log('Museus encontrados:', museumsData);

            // Filtrar os museus pelo bairro do usuário
            const filteredMuseums = museumsData.filter(museum => museum.bairro === addressData.localidade);
            console.log('Museus encontrados no bairro do usuário:', filteredMuseums);

        } catch (error) {
            console.error('Ocorreu um erro:', error);
            throw error;
        }
        finally {
            campo.value = '';
        }
    });

});
document.addEventListener('DOMContentLoaded', function () {
    const armazenarValores = document.querySelector('.forms-container');
    const exibicao = document.querySelector('.output-container');
    const cleanButton = document.querySelector('.clean-button');

    armazenarValores.addEventListener('submit', function (e) {
        e.preventDefault();
        exibir()
    });

    const exibir = () => {
        exibicao.innerHTML = '';
        
        for (i = 0; i < filteredMuseums.length; i++) {
            const arrayInterno = filteredMuseums[i];
            const values = document.createElement('div');
            const numeracao = document.createElement('span');
            const texto = document.createTextNode(arrayInterno[1]);

            numeracao.innerText = (i + 1) + '.'
            values.appendChild(numeracao)
            values.appendChild(texto)

            exibicao.appendChild(values);
        }
    }

    cleanButton.addEventListener('click', () => {
        global.splice(0, global.length)
        exibir()
    })
});