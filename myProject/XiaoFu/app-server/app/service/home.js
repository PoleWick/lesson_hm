// Service 模块 sql 服务
'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
    async user() {
        return {
            name: "PW",
            age: 22
        }
    }
}

module.exports =  HomeService;