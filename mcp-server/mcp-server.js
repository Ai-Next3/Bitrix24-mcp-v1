// mcp-server.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// Адрес вашего REST API сервера Битрикс24
const API_BASE_URL = "http://localhost:3000/api";

async function main() {
  console.error("Инициализация Bitrix24 MCP сервера...");
  
  // Создаем MCP сервер
  const server = new McpServer({
    name: "Bitrix24MCP",
    version: "1.0.0",
  });

  // Проверка соединения с API сервером при запуске
  try {
    const response = await axios.get(`${API_BASE_URL}/lead-statuses`);
    console.error("Соединение с API сервером успешно установлено");
    console.error("Тестовый ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
  } catch (error) {
    console.error("Ошибка соединения с API сервером:", error.message);
    console.error("Убедитесь, что REST API сервер запущен на порту 3000");
  }

 // инструменты для работы с лидами

  // Инструмент для получения списка лидов
  server.tool(
    "getLeads",
    {
      filter: z.string().optional().describe("JSON-строка с фильтром для лидов")
    },
    async ({ filter }) => {
      try {
        const params = {};
        if (filter) {
          params.filter = filter;
        }
        
        console.error(`Отправка запроса GET ${API_BASE_URL}/leads с параметрами:`, params);
        const response = await axios.get(`${API_BASE_URL}/leads`, { params });
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении лидов:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении лидов: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения информации о конкретном лиде
  server.tool(
    "getLead",
    {
      id: z.string().describe("ID лида")
    },
    async ({ id }) => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/leads/${id}`);
        const response = await axios.get(`${API_BASE_URL}/leads/${id}`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении лида:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении лида: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для создания нового лида
  server.tool(
    "createLead",
    {
      title: z.string().describe("Название лида"),
      name: z.string().optional().describe("Имя контакта"),
      lastName: z.string().optional().describe("Фамилия контакта"),
      companyTitle: z.string().optional().describe("Название компании"),
      phone: z.string().optional().describe("Телефон контакта"),
      email: z.string().optional().describe("Email контакта"),
      statusId: z.string().optional().describe("ID статуса лида"),
      comments: z.string().optional().describe("Комментарий к лиду"),
      post: z.string().optional().describe("Должность контакта"),
      sourceId: z.string().optional().describe("ID источника лида"),
      assignedById: z.string().optional().describe("ID ответственного"),
      opportunity: z.string().optional().describe("Сумма"),
      currencyId: z.string().optional().describe("Валюта")
    },
    async ({ title, name, lastName, companyTitle, phone, email, statusId, comments, post, sourceId, assignedById, opportunity, currencyId }) => {
      try {
        const leadData = {
          TITLE: title
        };
        
        if (name) leadData.NAME = name;
        if (lastName) leadData.LAST_NAME = lastName;
        if (companyTitle) leadData.COMPANY_TITLE = companyTitle;
        if (statusId) leadData.STATUS_ID = statusId;
        if (comments) leadData.COMMENTS = comments;
        if (post) leadData.POST = post;
        if (sourceId) leadData.SOURCE_ID = sourceId;
        if (assignedById) leadData.ASSIGNED_BY_ID = assignedById;
        if (opportunity) leadData.OPPORTUNITY = opportunity;
        if (currencyId) leadData.CURRENCY_ID = currencyId;
        
        if (phone) {
          leadData.PHONE = [
            { VALUE: phone, VALUE_TYPE: "WORK" }
          ];
        }
        
        if (email) {
          leadData.EMAIL = [
            { VALUE: email, VALUE_TYPE: "WORK" }
          ];
        }
        
        console.error(`Отправка запроса POST ${API_BASE_URL}/leads с данными:`, leadData);
        const response = await axios.post(`${API_BASE_URL}/leads`, leadData);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при создании лида:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при создании лида: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для обновления лида
  server.tool(
    "updateLead",
    {
      id: z.string().describe("ID лида"),
      title: z.string().optional().describe("Название лида"),
      name: z.string().optional().describe("Имя контакта"),
      lastName: z.string().optional().describe("Фамилия контакта"),
      companyTitle: z.string().optional().describe("Название компании"),
      phone: z.string().optional().describe("Телефон контакта"),
      email: z.string().optional().describe("Email контакта"),
      statusId: z.string().optional().describe("ID статуса лида"),
      comments: z.string().optional().describe("Комментарий к лиду"),
      post: z.string().optional().describe("Должность контакта"),
      sourceId: z.string().optional().describe("ID источника лида"),
      assignedById: z.string().optional().describe("ID ответственного"),
      opportunity: z.string().optional().describe("Сумма"),
      currencyId: z.string().optional().describe("Валюта")
    },
    async ({ id, title, name, lastName, companyTitle, phone, email, statusId, comments, post, sourceId, assignedById, opportunity, currencyId }) => {
      try {
        const leadData = {};
        
        if (title) leadData.TITLE = title;
        if (name) leadData.NAME = name;
        if (lastName) leadData.LAST_NAME = lastName;
        if (companyTitle) leadData.COMPANY_TITLE = companyTitle;
        if (statusId) leadData.STATUS_ID = statusId;
        if (comments) leadData.COMMENTS = comments;
        if (post) leadData.POST = post;
        if (sourceId) leadData.SOURCE_ID = sourceId;
        if (assignedById) leadData.ASSIGNED_BY_ID = assignedById;
        if (opportunity) leadData.OPPORTUNITY = opportunity;
        if (currencyId) leadData.CURRENCY_ID = currencyId;
        
        if (phone) {
          leadData.PHONE = [
            { VALUE: phone, VALUE_TYPE: "WORK" }
          ];
        }
        
        if (email) {
          leadData.EMAIL = [
            { VALUE: email, VALUE_TYPE: "WORK" }
          ];
        }
        
        console.error(`Отправка запроса PUT ${API_BASE_URL}/leads/${id} с данными:`, leadData);
        const response = await axios.put(`${API_BASE_URL}/leads/${id}`, leadData);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при обновлении лида:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при обновлении лида: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения статусов лидов
  server.tool(
    "getLeadStatuses",
    {},
    async () => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/lead-statuses`);
        const response = await axios.get(`${API_BASE_URL}/lead-statuses`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении статусов лидов:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении статусов лидов: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы со сделками

  // Инструмент для получения списка сделок
  server.tool(
    "getDeals",
    {
      filter: z.string().optional().describe("JSON-строка с фильтром для сделок")
    },
    async ({ filter }) => {
      try {
        const params = {};
        if (filter) {
          params.filter = filter;
        }
        
        console.error(`Отправка запроса GET ${API_BASE_URL}/deals с параметрами:`, params);
        const response = await axios.get(`${API_BASE_URL}/deals`, { params });
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении сделок:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении сделок: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения конкретной сделки
  server.tool(
    "getDeal",
    {
      id: z.string().describe("ID сделки")
    },
    async ({ id }) => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/deals/${id}`);
        const response = await axios.get(`${API_BASE_URL}/deals/${id}`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении сделки:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении сделки: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для создания новой сделки
  server.tool(
    "createDeal",
    {
      title: z.string().describe("Название сделки"),
      contactId: z.string().optional().describe("ID контакта"),
      companyId: z.string().optional().describe("ID компании"),
      categoryId: z.string().optional().describe("ID категории (воронки)"),
      stageId: z.string().optional().describe("ID стадии сделки"),
      amount: z.string().optional().describe("Сумма сделки"),
      currency: z.string().optional().describe("Валюта сделки"),
      responsibleId: z.string().optional().describe("ID ответственного")
    },
    async ({ title, contactId, companyId, categoryId, stageId, amount, currency, responsibleId }) => {
      try {
        const dealData = {
          TITLE: title
        };
        
        if (contactId) dealData.CONTACT_ID = contactId;
        if (companyId) dealData.COMPANY_ID = companyId;
        if (categoryId) dealData.CATEGORY_ID = categoryId;
        if (stageId) dealData.STAGE_ID = stageId;
        if (amount) dealData.OPPORTUNITY = amount;
        if (currency) dealData.CURRENCY_ID = currency;
        if (responsibleId) dealData.ASSIGNED_BY_ID = responsibleId;
        
        console.error(`Отправка запроса POST ${API_BASE_URL}/deals с данными:`, dealData);
        const response = await axios.post(`${API_BASE_URL}/deals`, dealData);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при создании сделки:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при создании сделки: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для обновления сделки
  server.tool(
    "updateDeal",
    {
      id: z.string().describe("ID сделки"),
      title: z.string().optional().describe("Название сделки"),
      contactId: z.string().optional().describe("ID контакта"),
      companyId: z.string().optional().describe("ID компании"),
      categoryId: z.string().optional().describe("ID категории (воронки)"),
      stageId: z.string().optional().describe("ID стадии сделки"),
      amount: z.string().optional().describe("Сумма сделки"),
      currency: z.string().optional().describe("Валюта сделки"),
      responsibleId: z.string().optional().describe("ID ответственного")
    },
    async ({ id, title, contactId, companyId, categoryId, stageId, amount, currency, responsibleId }) => {
      try {
        const dealData = {};
        
        if (title) dealData.TITLE = title;
        if (contactId) dealData.CONTACT_ID = contactId;
        if (companyId) dealData.COMPANY_ID = companyId;
        if (categoryId) dealData.CATEGORY_ID = categoryId;
        if (stageId) dealData.STAGE_ID = stageId;
        if (amount) dealData.OPPORTUNITY = amount;
        if (currency) dealData.CURRENCY_ID = currency;
        if (responsibleId) dealData.ASSIGNED_BY_ID = responsibleId;
        
        console.error(`Отправка запроса PUT ${API_BASE_URL}/deals/${id} с данными:`, dealData);
        const response = await axios.put(`${API_BASE_URL}/deals/${id}`, dealData);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при обновлении сделки:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при обновлении сделки: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения категорий сделок (воронок)
  server.tool(
    "getDealCategories",
    {},
    async () => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/deal-categories`);
        const response = await axios.get(`${API_BASE_URL}/deal-categories`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении категорий сделок:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении категорий сделок: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения стадий сделок
  server.tool(
    "getDealStages",
    {
      categoryId: z.string().optional().describe("ID категории сделок (воронки)")
    },
    async ({ categoryId }) => {
      try {
        const url = categoryId 
          ? `${API_BASE_URL}/deal-stages/${categoryId}` 
          : `${API_BASE_URL}/deal-stages`;
          
        console.error(`Отправка запроса GET ${url}`);
        const response = await axios.get(url);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении стадий сделок:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении стадий сделок: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы с контактами

  // Инструмент для получения списка контактов
  server.tool(
    "getContacts",
    {
      filter: z.string().optional().describe("JSON-строка с фильтром для контактов")
    },
    async ({ filter }) => {
      try {
        const params = {};
        if (filter) {
          params.filter = filter;
        }
        
        console.error(`Отправка запроса GET ${API_BASE_URL}/contacts с параметрами:`, params);
        const response = await axios.get(`${API_BASE_URL}/contacts`, { params });
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении контактов:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении контактов: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения конкретного контакта
  server.tool(
    "getContact",
    {
      id: z.string().describe("ID контакта")
    },
    async ({ id }) => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/contacts/${id}`);
        const response = await axios.get(`${API_BASE_URL}/contacts/${id}`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении контакта:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении контакта: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы с активностями

  // Инструмент для получения списка активностей
  server.tool(
    "getActivities",
    {
      filter: z.string().optional().describe("JSON-строка с фильтром для активностей")
    },
    async ({ filter }) => {
      try {
        const params = {};
        if (filter) {
          params.filter = filter;
        }
        
        console.error(`Отправка запроса GET ${API_BASE_URL}/activities с параметрами:`, params);
        const response = await axios.get(`${API_BASE_URL}/activities`, { params });
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении активностей:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении активностей: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения конкретной активности
  server.tool(
    "getActivity",
    {
      id: z.string().describe("ID активности")
    },
    async ({ id }) => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/activities/${id}`);
        const response = await axios.get(`${API_BASE_URL}/activities/${id}`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении активности:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении активности: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для создания новой активности
  server.tool(
    "createActivity",
    {
      ownerTypeId: z.string().describe("ID типа владельца (например, 1 - лид, 2 - сделка)"),
      ownerId: z.string().describe("ID владельца"),
      typeId: z.string().describe("ID типа активности"),
      subject: z.string().describe("Тема активности"),
      description: z.string().optional().describe("Описание активности"),
      responsibleId: z.string().optional().describe("ID ответственного пользователя"),
      priority: z.string().optional().describe("Приоритет активности")
    },
    async ({ ownerTypeId, ownerId, typeId, subject, description, responsibleId, priority }) => {
      try {
        const activityData = {
          OWNER_TYPE_ID: ownerTypeId,
          OWNER_ID: ownerId,
          TYPE_ID: typeId,
          SUBJECT: subject
        };
        
        if (description) activityData.DESCRIPTION = description;
        if (responsibleId) activityData.RESPONSIBLE_ID = responsibleId;
        if (priority) activityData.PRIORITY = priority;
        
        console.error(`Отправка запроса POST ${API_BASE_URL}/activities с данными:`, activityData);
        const response = await axios.post(`${API_BASE_URL}/activities`, activityData);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при создании активности:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при создании активности: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для обновления активности
  server.tool(
    "updateActivity",
    {
      id: z.string().describe("ID активности"),
      subject: z.string().optional().describe("Тема активности"),
      description: z.string().optional().describe("Описание активности"),
      responsibleId: z.string().optional().describe("ID ответственного пользователя"),
      priority: z.string().optional().describe("Приоритет активности"),
      completed: z.boolean().optional().describe("Статус завершения активности")
    },
    async ({ id, subject, description, responsibleId, priority, completed }) => {
      try {
        const activityData = {};
        
        if (subject) activityData.SUBJECT = subject;
        if (description) activityData.DESCRIPTION = description;
        if (responsibleId) activityData.RESPONSIBLE_ID = responsibleId;
        if (priority) activityData.PRIORITY = priority;
        if (completed !== undefined) activityData.COMPLETED = completed ? 'Y' : 'N';
        
        console.error(`Отправка запроса PUT ${API_BASE_URL}/activities/${id} с данными:`, activityData);
        const response = await axios.put(`${API_BASE_URL}/activities/${id}`, activityData);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при обновлении активности:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при обновлении активности: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы с пользователями

  // Инструмент для получения списка пользователей
  server.tool(
    "getUsers",
    {
      filter: z.string().optional().describe("JSON-строка с фильтром для пользователей")
    },
    async ({ filter }) => {
      try {
        const params = {};
        if (filter) {
          params.filter = filter;
        }
        
        console.error(`Отправка запроса GET ${API_BASE_URL}/users с параметрами:`, params);
        const response = await axios.get(`${API_BASE_URL}/users`, { params });
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении пользователей: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // Инструмент для получения конкретного пользователя
  server.tool(
    "getUser",
    {
      id: z.string().describe("ID пользователя")
    },
    async ({ id }) => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/users/${id}`);
        const response = await axios.get(`${API_BASE_URL}/users/${id}`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении пользователя: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы с задачами

  // Инструмент для получения списка задач
  server.tool(
    "getTasks",
    {
      filter: z.string().optional().describe("JSON-строка с фильтром для задач")
    },
    async ({ filter }) => {
      try {
        const params = {};
        if (filter) {
          params.filter = filter;
        }
        
        console.error(`Отправка запроса GET ${API_BASE_URL}/tasks с параметрами:`, params);
        const response = await axios.get(`${API_BASE_URL}/tasks`, { params });
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении задач: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы с телефонией

  // Инструмент для получения статистики звонков
  server.tool(
    "getCallStatistics",
    {
      dateFrom: z.string().optional().describe("Дата начала периода в формате YYYY-MM-DD"),
      dateTo: z.string().optional().describe("Дата окончания периода в формате YYYY-MM-DD")
    },
    async ({ dateFrom, dateTo }) => {
      try {
        let filter = {};
        
        if (dateFrom) filter.START_DATE_from = dateFrom;
        if (dateTo) filter.START_DATE_to = dateTo;
        
        const params = { filter: JSON.stringify(filter) };
        console.error(`Отправка запроса GET ${API_BASE_URL}/call-statistics с параметрами:`, params);
        const response = await axios.get(`${API_BASE_URL}/call-statistics`, { params });
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении статистики звонков:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении статистики звонков: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы с файлами

  // Инструмент для получения информации о файле
  server.tool(
    "getFile",
    {
      id: z.string().describe("ID файла")
    },
    async ({ id }) => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/files/${id}`);
        const response = await axios.get(`${API_BASE_URL}/files/${id}`);
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении информации о файле:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении информации о файле: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для работы с таймлайном

  // Инструмент для добавления комментария в таймлайн
  server.tool(
    "addTimelineComment",
    {
      entityType: z.string().describe("Тип сущности (lead, deal, contact, etc.)"),
      entityId: z.string().describe("ID сущности"),
      comment: z.string().describe("Текст комментария")
    },
    async ({ entityType, entityId, comment }) => {
      try {
        console.error(`Отправка запроса POST ${API_BASE_URL}/timeline-comment/${entityType}/${entityId} с данными:`, { comment });
        const response = await axios.post(
          `${API_BASE_URL}/timeline-comment/${entityType}/${entityId}`, 
          { comment }
        );
        console.error("Получен ответ:", JSON.stringify(response.data).substring(0, 100) + "...");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при добавлении комментария: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // инструменты для сводной информации

  // Инструмент для получения сводной информации о CRM
  server.tool(
    "getCrmSummary",
    {},
    async () => {
      try {
        const promises = [
          axios.get(`${API_BASE_URL}/leads`, { params: { filter: JSON.stringify({ LIMIT: 1 }) } }),
          axios.get(`${API_BASE_URL}/deals`, { params: { filter: JSON.stringify({ LIMIT: 1 }) } }),
          axios.get(`${API_BASE_URL}/contacts`, { params: { filter: JSON.stringify({ LIMIT: 1 }) } }),
          axios.get(`${API_BASE_URL}/lead-statuses`),
          axios.get(`${API_BASE_URL}/deal-categories`)
        ];
        
        console.error(`Отправка множественных запросов для получения сводной информации`);
        const [leadsRes, dealsRes, contactsRes, statusesRes, categoriesRes] = await Promise.all(promises);
        
        const summary = {
          totalLeads: leadsRes.data.totalCount || 0,
          totalDeals: dealsRes.data.totalCount || 0,
          totalContacts: contactsRes.data.totalCount || 0,
          leadStatuses: statusesRes.data.statuses || [],
          dealCategories: categoriesRes.data.categories || []
        };
        
        console.error("Получена сводная информация о CRM");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка при получении сводной информации:", error);
        return {
          content: [
            {
              type: "text",
              text: `Ошибка при получении сводной информации: ${error.message || 'Неизвестная ошибка'}`
            }
          ]
        };
      }
    }
  );

  // служебные инструменты

  // Инструмент для проверки статуса соединения с API
  server.tool(
    "checkApiConnection",
    {},
    async () => {
      try {
        const startTime = Date.now();
        console.error(`Проверка соединения с API сервером: ${API_BASE_URL}`);
        const response = await axios.get(`${API_BASE_URL}/lead-statuses`);
        const endTime = Date.now();
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "connected",
                endpoint: API_BASE_URL,
                responseTime: `${endTime - startTime} ms`,
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Ошибка соединения с API сервером:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "error",
                endpoint: API_BASE_URL,
                error: error.message || 'Неизвестная ошибка',
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }
    }
  );


  // Запуск сервера с использованием stdio транспорта
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Bitrix24 MCP сервер успешно запущен и готов к работе");
  console.error("Доступны следующие группы инструментов:");
  console.error(" - Лиды: getLeads, getLead, createLead, updateLead, getLeadStatuses");
  console.error(" - Сделки: getDeals, getDeal, createDeal, updateDeal, getDealCategories, getDealStages");
  console.error(" - Контакты: getContacts, getContact");
  console.error(" - Активности: getActivities, getActivity, createActivity, updateActivity");
  console.error(" - Пользователи: getUsers, getUser");
  console.error(" - Задачи: getTasks");
  console.error(" - Телефония: getCallStatistics");
  console.error(" - Файлы: getFile");
  console.error(" - Таймлайн: addTimelineComment");
  console.error(" - Сводная информация: getCrmSummary");
  console.error(" - Служебные: checkApiConnection");
}

// Запускаем наш сервер и обрабатываем возможные ошибки
main().catch(error => {
  console.error("Критическая ошибка в MCP сервере:", error);
  process.exit(1);
});