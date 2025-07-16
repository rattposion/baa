const axios = require('axios');

const BASE_URL = 'https://baa-production.up.railway.app';

async function testSeparacaoMacsRoutes() {
  console.log('🧪 Testando rotas de Separação MACs...\n');

  try {
    // Teste 1: Verificar se a rota existe (deve retornar 401 sem token)
    console.log('1. Testando rota GET /api/separacao-macs (sem token)...');
    try {
      const response = await axios.get(`${BASE_URL}/api/separacao-macs?date=2025-01-16`);
      console.log('❌ ERRO: Rota não deveria funcionar sem token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Rota existe e está protegida (401 - Não autorizado)');
      } else if (error.response?.status === 404) {
        console.log('❌ Rota não encontrada (404)');
      } else {
        console.log(`❌ Erro inesperado: ${error.response?.status || error.message}`);
      }
    }

    // Teste 2: Verificar rota de health para confirmar que o servidor está online
    console.log('\n2. Testando rota de health...');
    try {
      const response = await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Servidor está online');
    } catch (error) {
      console.log(`❌ Servidor offline: ${error.message}`);
    }

    // Teste 3: Listar todas as rotas disponíveis
    console.log('\n3. Verificando rotas disponíveis...');
    const routes = [
      '/api/health',
      '/api/auth',
      '/api/equipment',
      '/api/production',
      '/api/movements',
      '/api/employees',
      '/api/separacao-macs'
    ];

    for (const route of routes) {
      try {
        const response = await axios.get(`${BASE_URL}${route}`);
        console.log(`✅ ${route} - Online`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ ${route} - Protegida (401)`);
        } else if (error.response?.status === 404) {
          console.log(`❌ ${route} - Não encontrada (404)`);
        } else {
          console.log(`❓ ${route} - Erro: ${error.response?.status || error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testSeparacaoMacsRoutes(); 