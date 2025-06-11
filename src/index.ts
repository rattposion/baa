import app from './app';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mix';

// Configurações do MongoDB
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  retryReads: true
};

// Função para conectar ao MongoDB com retry
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    console.log('Tentando reconectar em 5 segundos...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Iniciar o servidor apenas após conectar ao MongoDB
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  // Tratamento de erros do servidor
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        console.error(`Porta ${PORT} requer privilégios elevados`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Porta ${PORT} já está em uso`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  // Tratamento de sinais de término
  const gracefulShutdown = () => {
    console.log('Recebido sinal de término. Iniciando shutdown gracioso...');
    server.close(async () => {
      console.log('Servidor HTTP fechado.');
      await mongoose.connection.close();
      console.log('Conexão MongoDB fechada.');
      process.exit(0);
    });

    // Se não conseguir fechar em 10 segundos, força o encerramento
    setTimeout(() => {
      console.error('Não foi possível fechar as conexões em 10 segundos. Forçando shutdown...');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

// Eventos de conexão do MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado. Tentando reconectar...');
  setTimeout(connectWithRetry, 5000);
});

mongoose.connection.on('error', (error) => {
  console.error('Erro na conexão MongoDB:', error);
});

// Iniciar a aplicação
connectWithRetry().then(() => {
  startServer();
}); 