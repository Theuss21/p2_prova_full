const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Criptografia forte
    
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Credenciais inválidas',
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: 'Credenciais inválidas',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({
      error: 'Erro ao realizar login',
    });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role']
    });

    res.json(users);

  } catch (err) {
    res.status(500).json({
      error: 'Erro ao listar usuários'
    });
  }
};

exports.updateUser = async (req, res) => {
  try {

    const { username, email, role } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    await user.update({
      username,
      email,
      role
    });

    res.json(user);

  } catch (err) {
    res.status(500).json({
      error: 'Erro ao atualizar usuário'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    await user.destroy();

    res.json({
      message: 'Usuário removido'
    });

  } catch (err) {
    res.status(500).json({
      error: 'Erro ao remover usuário'
    });
  }
};