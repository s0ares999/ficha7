const Genero = require('./Genero');

async function seedGeneros() {
    try {
        const generosIniciais = [
            { nome: 'Ação' },
            { nome: 'Aventura' },
            { nome: 'Comédia' },
            { nome: 'Drama' },
            { nome: 'Ficção Científica' },
            { nome: 'Terror' },
            { nome: 'Romance' },
            { nome: 'Animação' },
            { nome: 'Documentário' },
            { nome: 'Suspense' }
        ];

        console.log('Iniciando seed dos gêneros...');
        await Genero.bulkCreate(generosIniciais);
        console.log('Gêneros criados com sucesso!');

    } catch (error) {
        console.error('Erro ao criar gêneros:', error);
    }
}

// Se executado diretamente
if (require.main === module) {
    seedGeneros()
        .then(() => {
            console.log('Seed concluído');
            process.exit(0);
        })
        .catch(error => {
            console.error('Erro no seed:', error);
            process.exit(1);
        });
}

module.exports = seedGeneros; 