const axios = require('axios');

class Bitrix24Client {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  // Вспомогательный метод для выполнения HTTP запросов
  async request(method, endpoint, data = null, params = null) {
    try {
      const options = {
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        options.data = data;
      }

      if (params) {
        options.params = params;
      }

      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Методы для работы с задачами
  async getTasks(filter = {}) {
    return this.request('GET', '/tasks', null, { filter: JSON.stringify(filter) });
  }

  // Методы для работы с контактами
  async getContacts(filter = {}) {
    return this.request('GET', '/contacts', null, { filter: JSON.stringify(filter) });
  }

  // Методы для работы со сделками
  async getDeals(filter = {}) {
    return this.request('GET', '/deals', null, { filter: JSON.stringify(filter) });
  }

  async getDeal(id) {
    return this.request('GET', `/deals/${id}`);
  }

  async createDeal(dealData) {
    return this.request('POST', '/deals', dealData);
  }

  async updateDeal(id, dealData) {
    return this.request('PUT', `/deals/${id}`, dealData);
  }

  async getDealCategories() {
    return this.request('GET', '/deal-categories');
  }

  async getDealStages(categoryId = 0) {
    return this.request('GET', `/deal-stages/${categoryId}`);
  }

  // Методы для работы с лидами
  async getLeads(filter = {}) {
    return this.request('GET', '/leads', null, { filter: JSON.stringify(filter) });
  }

  async getLead(id) {
    return this.request('GET', `/leads/${id}`);
  }

  async createLead(leadData) {
    return this.request('POST', '/leads', leadData);
  }

  async updateLead(id, leadData) {
    return this.request('PUT', `/leads/${id}`, leadData);
  }

  async getLeadStatuses() {
    return this.request('GET', '/lead-statuses');
  }

  // Методы для работы с активностями
  async getActivities(filter = {}) {
    return this.request('GET', '/activities', null, { filter: JSON.stringify(filter) });
  }

  async getActivity(id) {
    return this.request('GET', `/activities/${id}`);
  }

  async createActivity(activityData) {
    return this.request('POST', '/activities', activityData);
  }

  async updateActivity(id, activityData) {
    return this.request('PUT', `/activities/${id}`, activityData);
  }

  // Методы для работы с пользователями
  async getUsers(filter = {}) {
    return this.request('GET', '/users', null, { filter: JSON.stringify(filter) });
  }

  async getUser(id) {
    return this.request('GET', `/users/${id}`);
  }

  // Методы для работы с комментариями таймлайна
  async addTimelineComment(entityType, entityId, comment) {
    return this.request('POST', `/timeline-comment/${entityType}/${entityId}`, { comment });
  }

  // Методы для работы с телефонией
  async getCallStatistics(filter = {}) {
    return this.request('GET', '/call-statistics', null, { filter: JSON.stringify(filter) });
  }

  async getFile(id) {
    return this.request('GET', `/files/${id}`);
  }

  // Получение URL для прямого скачивания файла
  getFileDownloadUrl(id) {
    return `${this.baseUrl}/files/${id}/download`;
  }
}

// Пример использования клиента
async function demoClientUsage() {
  try {
    const client = new Bitrix24Client();
    
    // 1. Получаем статусы лидов
    console.log('Получение статусов лидов:');
    const leadStatuses = await client.getLeadStatuses();
    console.log(leadStatuses);
    
    // 2. Создаем нового лида
    console.log('\nСоздание нового лида:');
    const newLeadData = {
      TITLE: 'Тестовый лид из MCP клиента',
      NAME: 'Иван',
      LAST_NAME: 'Тестов',
      STATUS_ID: leadStatuses.statuses[0].id,
      PHONE: [{ VALUE: '+7 (999) 123-45-67', VALUE_TYPE: 'WORK' }],
      EMAIL: [{ VALUE: 'test@example.com', VALUE_TYPE: 'WORK' }]
    };
    const createdLead = await client.createLead(newLeadData);
    console.log(createdLead);
    
    // 3. Получение категорий (воронок) сделок
    console.log('\nПолучение воронок продаж:');
    const dealCategories = await client.getDealCategories();
    console.log(dealCategories);
    
    // 4. Получение стадий сделок для первой воронки
    if (dealCategories.categories.length > 0) {
      console.log('\nПолучение стадий сделок:');
      const dealStages = await client.getDealStages(dealCategories.categories[0].id);
      console.log(dealStages);
      
      // 5. Создание активности для лида
      if (createdLead && createdLead.id) {
        console.log('\nСоздание активности для лида:');
        const activityData = {
          OWNER_TYPE_ID: 1, // 1 - лид
          OWNER_ID: createdLead.id,
          TYPE_ID: 2, // 2 - задача
          SUBJECT: 'Позвонить клиенту',
          DESCRIPTION: 'Необходимо связаться с клиентом и уточнить детали запроса',
          RESPONSIBLE_ID: 1, // ID ответственного пользователя
          PRIORITY: 2,
          COMMUNICATIONS: [
            {
              VALUE: '+7 (999) 123-45-67',
              TYPE: 'PHONE'
            }
          ]
        };
        const createdActivity = await client.createActivity(activityData);
        console.log(createdActivity);
        
        // 6. Добавление комментария в таймлайн лида
        console.log('\nДобавление комментария в таймлайн:');
        const commentResult = await client.addTimelineComment('lead', createdLead.id, 'Комментарий из MCP клиента');
        console.log(commentResult);
      }
    }
    
    // 7. Получение статистики звонков
    console.log('\nПолучение статистики звонков:');
    const callsFilter = {
      START_DATE_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Последние 30 дней
      START_DATE_to: new Date().toISOString().split('T')[0]
    };
    const callStats = await client.getCallStatistics(callsFilter);
    console.log(callStats);
    
    // 8. Получение информации о пользователях
    console.log('\nПолучение информации о пользователях:');
    const users = await client.getUsers();
    console.log(users);
    
  } catch (error) {
    console.error('Ошибка в демо-клиенте:', error.message);
  }
}

// Запуск демо-клиента
demoClientUsage();

module.exports = Bitrix24Client;
