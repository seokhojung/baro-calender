const fastify = require('fastify')({
  logger: true,
  trustProxy: true
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

// 프로젝트 API 라우터 등록
fastify.register(require('./api/v1/projects'), { prefix: '/v1/projects' });

// 멤버 API 라우터 등록
fastify.register(require('./api/v1/members'), { prefix: '/v1' });

// 헬스체크 엔드포인트
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
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
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 Server is running on http://${host}:${port}`);
    console.log(`📚 API Documentation available at http://${host}:${port}/docs`);
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// CLI 실행 지원
if (require.main === module) {
  start();
}

module.exports = { fastify, start };
