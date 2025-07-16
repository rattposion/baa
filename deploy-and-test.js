const { exec } = require('child_process');
const axios = require('axios');

const BASE_URL = 'https://baa-production.up.railway.app';

async function deployAndTest() {
  console.log('🚀 Iniciando deploy e teste do backend...\n');

  try {
    // 1. Build do projeto
    console.log('1. Fazendo build do projeto...');
    await new Promise((resolve, reject) => {
      exec('npm run build', { cwd: './server' }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Erro no build:', error);
          reject(error);
          return;
        }
        console.log('✅ Build concluído com sucesso');
        resolve();
      });
    });

    // 2. Testar se o servidor está online
    console.log('\n2. Testando se o servidor está online...');
    try {
      const response = await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Servidor está online');
    } catch (error) {
      console.log(`❌ Servidor offline: ${error.message}`);
      return;
    }

    // 3. Testar rota de separação MACs
    console.log('\n3. Testando rota de separação MACs...');
    try {
      const response = await axios.get(`${BASE_URL}/api/separacao-macs?date=2025-01-16`);
      console.log('❌ ERRO: Rota não deveria funcionar sem token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Rota de separação MACs existe e está protegida (401 - Não autorizado)');
      } else if (error.response?.status === 404) {
        console.log('❌ Rota de separação MACs não encontrada (404)');
        console.log('🔧 Verificando possíveis problemas...');
        
        // Listar todas as rotas para debug
        const routes = [
          '/api/health',
          '/api/auth',
          '/api/equipment',
          '/api/production',
          '/api/movements',
          '/api/employees',
          '/api/separacao-macs'
        ];

        console.log('\n📋 Status das rotas:');
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
      } else {
        console.log(`❌ Erro inesperado: ${error.response?.status || error.message}`);
      }
    }

    console.log('\n✅ Teste concluído!');

  } catch (error) {
    console.error('❌ Erro durante o deploy/teste:', error.message);
  }
}

deployAndTest(); 