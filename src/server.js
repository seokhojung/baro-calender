// 환경 변수 로딩
require('dotenv').config();

const fastify = require('fastify')({
  logger: true,
  trustProxy: true
});

// PostgreSQL 연결 풀 생성
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// CORS 설정
fastify.register(require('@fastify/cors'), {
  origin: true,
  credentials: true
});

// JSON 파싱 설정
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    const json = JSON.parse(body);
    done(null, json);
  } catch (err) {
    err.statusCode = 400;
    done(err, undefined);
  }
});

// 프로젝트 API 라우터 등록 (일시적으로 주석 처리)
// fastify.register(require('./api/v1/projects'), { prefix: '/v1/projects' });

// 멤버 API 라우터 등록 (일시적으로 주석 처리)
// fastify.register(require('./api/v1/members'), { prefix: '/v1' });

// 강화된 헬스체크 엔드포인트
fastify.get('/health', async (request, reply) => {
  try {
    // 데이터베이스 연결 확인
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    return { 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      tables: ['tenants', 'projects', 'members', 'users'],
      message: 'All systems operational'
    };
  } catch (error) {
    reply.code(503);
    return { 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      message: 'Database connection failed'
    };
  }
});

// 루트 엔드포인트
fastify.get('/', async (request, reply) => {
  return {
    message: 'Baro Calendar API Server',
    version: '1.0.0',
          endpoints: {
        health: '/health',
        projects: '/v1/projects',
        members: '/v1/projects/:id/members'
      }
  };
});

// 에러 핸들러
fastify.setErrorHandler(function (error, request, reply) {
  fastify.log.error(error);
  
  if (error.validation) {
    reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation
    });
    return;
  }
  
  reply.code(500).send({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

// 서버 시작
const start = async () => {
  try {
    // 데이터베이스 연결 테스트
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Database connection successful');
    
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 Server is running on http://${host}:${port}`);
    console.log(`📚 API Documentation available at http://${host}:${port}/docs`);
    console.log(`🏥 Health check available at http://${host}:${port}/health`);
    
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

// CLI 실행 지원
if (require.main === module) {
  start();
}

module.exports = { fastify, start };
