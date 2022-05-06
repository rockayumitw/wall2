const swaggerAutogen = require('swagger-autogen')();

// 設定文件
const doc = {
    info: {
        title: 'Meta API',
        description: '範例生成文件', // 描述此文件在做甚麼
    },
    host: 'fathomless-taiga-19978.herokuapp.com', // 注意: 目前本地端生成的api, 可以使用.env環境檔做變化
    schemes: ['http', 'https'], // 此文件支援哪幾種模式
}

const outputFile = './swagger-output.json'; // 生成文件檔名
const endpointsFiles = ['./app.js']; // 進入點 (分析router生成文件)

// swagger 文件基本生成
swaggerAutogen(outputFile, endpointsFiles, doc);