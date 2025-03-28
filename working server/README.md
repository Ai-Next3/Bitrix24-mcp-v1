# Bitrix24 MCP Server

## Обзор

Bitrix24 MCP (Model-Controller-Presenter) Server - это серверное приложение, предоставляющее REST API для взаимодействия с Bitrix24 CRM. Сервер использует архитектурный паттерн MCP для организации кода и обеспечения четкого разделения ответственности между компонентами.

## Особенности

- Полный доступ к основным сущностям Bitrix24 CRM (сделки, лиды, контакты, задачи и т.д.)
- Форматирование данных для удобного использования на клиентской стороне
- Логирование запросов и ответов
- Обработка ошибок и исключений
- CORS поддержка для взаимодействия с фронтенд-приложениями

## Требования

- Node.js (версия 14.x или выше)
- npm (версия 6.x или выше)
- Доступ к Bitrix24 с настроенным webhook

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/bitrix24-mcp-server.git
cd bitrix24-mcp-server
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории проекта со следующими параметрами:
```
PORT=3000
BITRIX_DOMAIN=your-domain.bitrix24.ru
BITRIX_WEBHOOK_TOKEN=your-webhook-token
LOG_LEVEL=info
```

4. Запустите сервер:
```bash
npm start
```

## Архитектура

Сервер построен на основе архитектурного паттерна MCP (Model-Controller-Presenter):

- **Model (Bitrix24Model)**: Отвечает за взаимодействие с API Bitrix24 и обработку данных.
- **Controller (Bitrix24Controller)**: Обрабатывает HTTP-запросы, применяет бизнес-логику и координирует работу модели и презентера.
- **Presenter (Bitrix24Presenter)**: Форматирует данные для представления клиенту.

## API Endpoints

### Задачи

- `GET /api/tasks` - Получение списка задач
  - Query параметры:
    - `filter` - JSON-строка с фильтрами (опционально)

### Контакты

- `GET /api/contacts` - Получение списка контактов
  - Query параметры:
    - `filter` - JSON-строка с фильтрами (опционально)

### Сделки

- `GET /api/deals` - Получение списка сделок
  - Query параметры:
    - `filter` - JSON-строка с фильтрами (опционально)
- `GET /api/deals/:id` - Получение сделки по ID
- `POST /api/deals` - Создание новой сделки
  - Body: объект с данными сделки
- `PUT /api/deals/:id` - Обновление сделки
  - Body: объект с данными для обновления
- `GET /api/deal-categories` - Получение воронок продаж
- `GET /api/deal-stages/:categoryId?` - Получение стадий сделок для указанной воронки

### Лиды

- `GET /api/leads` - Получение списка лидов
  - Query параметры:
    - `filter` - JSON-строка с фильтрами (опционально)
- `GET /api/leads/:id` - Получение лида по ID
- `POST /api/leads` - Создание нового лида
  - Body: объект с данными лида
- `PUT /api/leads/:id` - Обновление лида
  - Body: объект с данными для обновления
- `GET /api/lead-statuses` - Получение статусов лидов

### Активности (дела)

- `GET /api/activities` - Получение списка активностей
  - Query параметры:
    - `filter` - JSON-строка с фильтрами (опционально)
- `GET /api/activities/:id` - Получение активности по ID
- `POST /api/activities` - Создание новой активности
  - Body: объект с данными активности
- `PUT /api/activities/:id` - Обновление активности
  - Body: объект с данными для обновления

### Пользователи

- `GET /api/users` - Получение списка пользователей
  - Query параметры:
    - `filter` - JSON-строка с фильтрами (опционально)
- `GET /api/users/:id` - Получение пользователя по ID

### Таймлайн

- `POST /api/timeline-comment/:entityType/:entityId` - Добавление комментария в таймлайн
  - Body: `{ "comment": "Текст комментария" }`

### Телефония

- `GET /api/call-statistics` - Получение статистики звонков
  - Query параметры:
    - `filter` - JSON-строка с фильтрами (опционально)

### Файлы

- `GET /api/files/:id` - Получение информации о файле
- `GET /api/files/:id/download` - Скачивание файла

## Примеры использования

### Получение списка сделок

```javascript
// Клиентский код
async function getDeals() {
  try {
    const response = await fetch('http://localhost:3000/api/deals');
    const data = await response.json();
    console.log(data.deals);
  } catch (error) {
    console.error('Ошибка при получении сделок:', error);
  }
}
```

### Создание нового лида

```javascript
// Клиентский код
async function createLead() {
  try {
    const leadData = {
      TITLE: 'Новый лид с сайта',
      NAME: 'Иван',
      LAST_NAME: 'Иванов',
      STATUS_ID: 'NEW',
      PHONE: [{ VALUE_TYPE: 'WORK', VALUE: '+7 (999) 123-45-67' }],
      EMAIL: [{ VALUE_TYPE: 'WORK', VALUE: 'ivan@example.com' }]
    };
    
    const response = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });
    
    const result = await response.json();
    console.log('Лид создан:', result);
  } catch (error) {
    console.error('Ошибка при создании лида:', error);
  }
}
```

### Обновление сделки

```javascript
// Клиентский код
async function updateDeal(dealId, stageId) {
  try {
    const dealData = {
      STAGE_ID: stageId
    };
    
    const response = await fetch(`http://localhost:3000/api/deals/${dealId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dealData)
    });
    
    const result = await response.json();
    console.log('Сделка обновлена:', result);
  } catch (error) {
    console.error('Ошибка при обновлении сделки:', error);
  }
}
```

## Логирование

Сервер использует встроенный механизм логирования для отслеживания запросов и ответов. Уровень логирования можно настроить в файле `.env` с помощью параметра `LOG_LEVEL`.

Доступные уровни логирования:
- `error` - только ошибки
- `warn` - предупреждения и ошибки
- `info` - информационные сообщения, предупреждения и ошибки (по умолчанию)
- `debug` - отладочная информация и все вышеперечисленное

## Обработка ошибок

Сервер обрабатывает ошибки и возвращает соответствующие HTTP-статусы и сообщения:

- `400 Bad Request` - неверный формат запроса
- `404 Not Found` - ресурс не найден
- `500 Internal Server Error` - внутренняя ошибка сервера

Пример ответа с ошибкой:
```json
{
  "error": "Ошибка при получении данных из Bitrix24 API"
}
```

## Безопасность

- Используйте HTTPS для защиты данных при передаче
- Храните webhook-токен в безопасном месте и не включайте его в код
- Регулярно обновляйте webhook-токен для минимизации рисков

## Лицензия

MIT
