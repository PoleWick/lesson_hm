import express, { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

// Swagger定义
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '视频社交平台API',
      version: '1.0.0',
      description: '视频社交平台的REST API文档',
      contact: {
        name: '后端开发团队',
        email: 'backend@example.com'
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API服务器'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 路径到API文件
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../controllers/*.ts'),
    path.join(__dirname, '../models/*.ts')
  ]
};

// 生成API规范
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * 初始化Swagger文档
 */
export const setupSwagger = (app: express.Application): void => {
  // 在开发环境中提供Swagger UI
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: '视频社交平台 - API文档'
    }));

    // 提供JSON格式的API规范
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    console.log('Swagger API文档已启用: /api-docs');

    // 导出Swagger规范到文件
    const outputPath = path.join(__dirname, '../../docs/swagger.json');
    const docsDir = path.join(__dirname, '../../docs');
    
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
    console.log(`Swagger规范已导出到: ${outputPath}`);
  }
};

/**
 * 提供Swagger路由
 */
export const swaggerRouter = Router();

// 在独立路由上提供Swagger UI
swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: '视频社交平台 - API文档'
})); 