// server.test.js
const request = require('supertest');
const app = require('./server');

// Моки для ответов Битрикс24 API
jest.mock('axios', () => ({
  post: jest.fn((url) => {
    if (url.includes('tasks.task.list')) {
      return Promise.resolve({
        data: {
          result: {
            tasks: [
              {
                id: 1,
                title: 'Тестовая задача',
                responsibleName: 'Иван Иванов',
                deadline: '2023-12-31',
                status: 'новая',
                createdDate: '2023-10-01'
              }
            ],
            total: 1
          }
        }
      });
    }
    if (url.includes('crm.contact.list')) {
      return Promise.resolve({
        data: {
          result: [
            {
              ID: 1,
              NAME: 'Иван',
              LAST_NAME: 'Петров',
              EMAIL: [{ VALUE: 'ivan@example.com' }],
              PHONE: [{ VALUE: '+7 999 123 45 67' }],
              COMPANY_ID: '42'
            }
          ],
          total: 1
        }
      });
    }
    if (url.includes('crm.deal.list')) {
      return Promise.resolve({
        data: {
          result: [
            {
              ID: 1,
              TITLE: 'Тестовая сделка',
              STAGE_ID: 'NEW',
              OPPORTUNITY: '100000',
              CURRENCY_ID: 'RUB',
              CONTACT_ID: '1',
              ASSIGNED_BY_ID: '42',
              DATE_CREATE: '2023-10-01'
            }
          ],
          total: 1
        }
      });
    }
    if (url.includes('crm.deal.add')) {
      return Promise.resolve({
        data: {
          result: 2
        }
      });
    }
    if (url.includes('crm.deal.update')) {
      return Promise.resolve({
        data: {
          result: true
        }
      });
    }
    return Promise.reject(new Error('Неизвестный эндпоинт'));
  })
}));

describe('Bitrix24 MCP Server API', () => {
  afterAll(() => {
    // Закрываем соединение после тестов
    app.close();
  });

  describe('GET /api/tasks', () => {
    it('должен возвращать список задач', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body.tasks).toBeInstanceOf(Array);
      expect(response.body.tasks[0]).toHaveProperty('title', 'Тестовая задача');
    });
  });

  describe('GET /api/contacts', () => {
    it('должен возвращать список контактов', async () => {
      const response = await request(app).get('/api/contacts');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('contacts');
      expect(response.body.contacts).toBeInstanceOf(Array);
      expect(response.body.contacts[0]).toHaveProperty('name', 'Иван Петров');
    });
  });

  describe('GET /api/deals', () => {
    it('должен возвращать список сделок', async () => {
      const response = await request(app).get('/api/deals');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('deals');
      expect(response.body.deals).toBeInstanceOf(Array);
      expect(response.body.deals[0]).toHaveProperty('title', 'Тестовая сделка');
    });
  });

  describe('POST /api/deals', () => {
    it('должен создавать новую сделку', async () => {
      const dealData = {
        TITLE: 'Новая тестовая сделка',
        STAGE_ID: 'NEW',
        OPPORTUNITY: '150000',
        CURRENCY_ID: 'RUB',
        CONTACT_ID: '1'
      };

      const response = await request(app)
        .post('/api/deals')
        .send(dealData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('id', 2);
    });
  });

  describe('PUT /api/deals/:id', () => {
    it('должен обновлять существующую сделку', async () => {
      const dealData = {
        TITLE: 'Обновленная тестовая сделка',
        OPPORTUNITY: '200000'
      };

      const response = await request(app)
        .put('/api/deals/1')
        .send(dealData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });
});
