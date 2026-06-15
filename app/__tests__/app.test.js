const request = require('supertest');
const app = require('../index');

describe('GET /', () => {
  it('should return 200 with HTML content', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should return json content type', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-type']).toMatch(/json/);
  });
});

describe('GET /nonexistent', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});