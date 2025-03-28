// mcp-server.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// Адрес вашего REST API сервера Битрикс24
const API_BASE_URL = "http://localhost:3000/api";

async function main() {
  // Создаем MCP сервер
  const server = new McpServer({
    name: "Bitrix24MCP",
    version: "1.0.0",
  });

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
        console.error("Получен ответ:", response.data);
        
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
        console.error("Получен ответ:", response.data);
        
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
      phone: z.string().optional().describe("Телефон контакта"),
      email: z.string().optional().describe("Email контакта"),
      statusId: z.string().optional().describe("ID статуса лида")
    },
    async ({ title, name, lastName, phone, email, statusId }) => {
      try {
        const leadData = {
          TITLE: title
        };
        
        if (name) leadData.NAME = name;
        if (lastName) leadData.LAST_NAME = lastName;
        if (statusId) leadData.STATUS_ID = statusId;
        
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
        console.error("Получен ответ:", response.data);
        
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
        console.error("Получен ответ:", response.data);
        
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
        console.error("Получен ответ:", response.data);
        
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
  
  // Инструмент для получения категорий сделок (воронок)
  server.tool(
    "getDealCategories",
    {},
    async () => {
      try {
        console.error(`Отправка запроса GET ${API_BASE_URL}/deal-categories`);
        const response = await axios.get(`${API_BASE_URL}/deal-categories`);
        console.error("Получен ответ:", response.data);
        
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
        console.error("Получен ответ:", response.data);
        
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
        console.error("Получен ответ:", response.data);
        
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

  // Запуск сервера с использованием stdio транспорта
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Bitrix24 MCP сервер запущен");
}

// Запускаем наш сервер и обрабатываем возможные ошибки
main().catch(error => {
  console.error("Ошибка в MCP сервере:", error);
  process.exit(1);
});