const api = async () => {
    
    const url = "https://viacep.com.br/ws/";

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
};

export default api;
