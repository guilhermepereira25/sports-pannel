import { login, logout } from '../../src/controller/auth_controller';
import dotenv from 'dotenv';

describe('login', () => {
  beforeAll(() => {
    dotenv.config();
  });

  test('returns 400 if request method is not POST', async () => {
    const req = { method: 'GET' };
    const res = await login(req);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('invalid request method');
  });

  test('returns 400 if username or password is undefined', async () => {
    const req = {
      method: 'POST',
      body: {
        username: undefined,
        password: undefined,
      },
    };
    const res = await login(req);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('username or password is undefined');
  });

  test('returns 401 if username or password is incorrect', async () => {
    const req = {
      method: 'POST',
      body: {
        username: 'wrong_username',
        password: 'wrong_password',
      },
    };
    const res = await login(req);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('unauthorized');
  });

  test('returns 200 if username and password are correct', async () => {
    const req = {
      method: 'POST',
      body: {
        username: process.env.DEFAULT_USERNAME,
        password: process.env.DEFAULT_PASSWORD,
      },
    };
    const res = await login(req);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('success');
    expect(req.session.username).toEqual({ username: process.env.DEFAULT_USERNAME });
  });
});

describe('logout', () => {
  test('returns 400 if request method is not POST', async () => {
    const req = { method: 'GET' };
    const res = await logout(req);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('invalid request method');
  });

  test('returns 200 if session is destroyed', async () => {
    const req = { method: 'POST', session: {} };
    const res = await logout(req);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('success');
  });
});