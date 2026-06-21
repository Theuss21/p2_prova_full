require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const sequelize = require('./config/database.sql');
const connectNoSQL = require('./config/database.nosql');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const apiRoutes = require('./routes/api');

const app = express();

// Segurança
app.use(helmet());
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/', apiRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API OK');
});

// Inicialização segura
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL conectado com sucesso.');

    await connectNoSQL();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('Falha ao iniciar a aplicação:', error);
    process.exit(1);
  }
};

// Evita subir servidor durante os testes
if (require.main === module) {
  startServer();
}

module.exports = app;