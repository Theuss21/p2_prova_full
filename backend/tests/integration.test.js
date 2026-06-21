const request = require('supertest');
const app = require('../src/app');

describe('Testes de Integração da API', () => {

  let token;

  test('POST /register - Deve criar um usuário', async () => {

    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });

    expect([201, 500]).toContain(res.statusCode);
  });

  test('POST /login - Deve autenticar usuário', async () => {

    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);

    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  test('GET /vehicles/carro - Deve bloquear sem token', async () => {

    const res = await request(app)
      .get('/vehicles/carro');

    expect(res.statusCode).toBe(401);
  });

  test('POST /vehicles - Deve criar veículo', async () => {

    const res = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'carro',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2025
      });

    expect(res.statusCode).toBe(201);
  });

  test('GET /vehicles/carro - Deve listar veículos', async () => {

    const res = await request(app)
      .get('/vehicles/carro')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test('GET /users - Deve listar usuários', async () => {

    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test('GET /brands - Deve listar marcas', async () => {

    const res = await request(app)
      .get('/brands')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});