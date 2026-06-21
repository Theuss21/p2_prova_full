const mongoose = require('mongoose');

const connectNoSQL = async () => {
  try {
    await mongoose.connect(process.env.DB_NOSQL_URL);
    console.log('Conectado ao MongoDB com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectNoSQL;