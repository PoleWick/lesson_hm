"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRouter = exports.setupSwagger = void 0;
const express_1 = require("express");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
        path_1.default.join(__dirname, '../routes/*.ts'),
        path_1.default.join(__dirname, '../controllers/*.ts'),
        path_1.default.join(__dirname, '../models/*.ts')
    ]
};
// 生成API规范
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
/**
 * 初始化Swagger文档
 */
const setupSwagger = (app) => {
    // 在开发环境中提供Swagger UI
    if (process.env.NODE_ENV !== 'production') {
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
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
        const outputPath = path_1.default.join(__dirname, '../../docs/swagger.json');
        const docsDir = path_1.default.join(__dirname, '../../docs');
        if (!fs_1.default.existsSync(docsDir)) {
            fs_1.default.mkdirSync(docsDir, { recursive: true });
        }
        fs_1.default.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
        console.log(`Swagger规范已导出到: ${outputPath}`);
    }
};
exports.setupSwagger = setupSwagger;
/**
 * 提供Swagger路由
 */
exports.swaggerRouter = (0, express_1.Router)();
// 在独立路由上提供Swagger UI
exports.swaggerRouter.use('/', swagger_ui_express_1.default.serve);
exports.swaggerRouter.get('/', swagger_ui_express_1.default.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: '视频社交平台 - API文档'
}));
