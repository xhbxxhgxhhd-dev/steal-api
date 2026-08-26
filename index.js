const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let stolenItems = [];

// ============= SALVAR ITENS =============
app.post('/save', (req, res) => {
    const { items, target } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Nenhum item para salvar'
        });
    }

    stolenItems = stolenItems.concat(items);

    console.log(`✅ ${items.length} itens salvos para ${target || 'desconhecido'}`);
    console.log(`📦 Total de itens na nuvem: ${stolenItems.length}`);

    res.json({
        success: true,
        message: `${items.length} itens salvos!`,
        total: stolenItems.length
    });
});

// ============= PUXAR ITENS =============
app.get('/pull/:account', (req, res) => {
    const account = req.params.account;

    console.log(`📥 Buscando itens para ${account}...`);

    const itemsForAccount = stolenItems.filter(item => item.target === account);
    stolenItems = stolenItems.filter(item => item.target !== account);

    console.log(`📤 ${itemsForAccount.length} itens enviados para ${account}`);
    console.log(`📦 Restam ${stolenItems.length} itens na nuvem`);

    res.json({
        success: true,
        items: itemsForAccount,
        count: itemsForAccount.length
    });
});

// ============= STATUS =============
app.get('/status', (req, res) => {
    const accounts = {};

    stolenItems.forEach(item => {
        accounts[item.target] = (accounts[item.target] || 0) + 1;
    });

    res.json({
        status: 'online',
        totalItems: stolenItems.length,
        accounts: accounts
    });
});

// ============= RAIZ =============
app.get('/', (req, res) => {
    res.send(`
        <h1>🔥 STEAL API ATIVO!</h1>
        <p>Total de itens na nuvem: ${stolenItems.length}</p>
        <p>Use /status para ver detalhes</p>
    `);
});

// ============= INICIAR SERVIDOR =============
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📦 Total de itens armazenados: ${stolenItems.length}`);
});
