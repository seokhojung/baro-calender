const fastify = require('fastify');
const Joi = require('joi');
const ProjectService = require('../../services/projectService');
const ACLMiddleware = require('../../middleware/acl');
const {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  listProjectsQuerySchema,
  searchProjectsQuerySchema
} = require('../../schemas/projectSchema');

/**
 * 프로젝트 API 라우터
 * @param {Object} fastify - Fastify 인스턴스
 */
async function projectRoutes(fastify, options) {
  
  // 프로젝트 생성 API
  fastify.post('/', {
    schema: {
      body: createProjectSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
            tenant_id: { type: 'number' },
            owner_id: { type: 'number' },
            description: { type: 'string' },
            settings: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [
      ACLMiddleware.authenticateUser(),
      ACLMiddleware.requireTenantMembership()
    ]
  }, async (request, reply) => {
    try {
      const { tenant_id, owner_id, ...projectData } = request.body;
      
      // 실제 구현에서는 request에서 가져온 값 사용
      const project = await ProjectService.createProject({
        tenant_id: tenant_id || request.user.tenant_id,
        owner_id: owner_id || request.user.id,
        ...projectData
      });
      
      reply.code(201).send(project);
    } catch (error) {
      if (error.message.includes('already exists')) {
        reply.code(409).send({
          error: 'Conflict',
          message: error.message
        });
      } else {
        reply.code(400).send({
          error: 'Bad Request',
          message: error.message
        });
      }
    }
  });

  // 프로젝트 조회 API (ID로)
  fastify.get('/:id', {
    schema: {
      params: projectIdSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
            tenant_id: { type: 'number' },
            owner_id: { type: 'number' },
            description: { type: 'string' },
            settings: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [
      ACLMiddleware.authenticateUser(),
      ACLMiddleware.requireProjectMembership(),
      ACLMiddleware.requireViewerOrHigher()
    ]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const project = await ProjectService.getProjectById(id);
      
      if (!project) {
        reply.code(404).send({
          error: 'Not Found',
          message: 'Project not found'
        });
        return;
      }
      
      reply.send(project);
    } catch (error) {
      reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // 프로젝트 조회 API (멤버 포함)
  fastify.get('/:id/with-members', {
    schema: {
      params: projectIdSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
            tenant_id: { type: 'number' },
            owner_id: { type: 'number' },
            description: { type: 'string' },
            settings: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            members: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  user_id: { type: 'number' },
                  role: { type: 'string' },
                  invited_at: { type: 'string', format: 'date-time' },
                  accepted_at: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const project = await ProjectService.getProjectWithMembers(id);
      
      if (!project) {
        reply.code(404).send({
          error: 'Not Found',
          message: 'Project not found'
        });
        return;
      }
      
      reply.send(project);
    } catch (error) {
      reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // 프로젝트 수정 API
  fastify.patch('/:id', {
    schema: {
      params: projectIdSchema,
      body: updateProjectSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
            tenant_id: { type: 'number' },
            owner_id: { type: 'number' },
            description: { type: 'string' },
            settings: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [
      ACLMiddleware.authenticateUser(),
      ACLMiddleware.requireProjectMembership(),
      ACLMiddleware.requireEditorOrHigher()
    ]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const updateData = request.body;
      
      const project = await ProjectService.updateProject(id, updateData);
      
      if (!project) {
        reply.code(404).send({
          error: 'Not Found',
          message: 'Project not found'
        });
        return;
      }
      
      reply.send(project);
    } catch (error) {
      if (error.message.includes('already exists')) {
        reply.code(409).send({
          error: 'Conflict',
          message: error.message
        });
      } else if (error.message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message: error.message
        });
      } else {
        reply.code(400).send({
          error: 'Bad Request',
          message: error.message
        });
      }
    }
  });

  // 프로젝트 삭제 API
  fastify.delete('/:id', {
    schema: {
      params: projectIdSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
            tenant_id: { type: 'number' },
            owner_id: { type: 'number' },
            description: { type: 'string' },
            settings: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        409: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [
      ACLMiddleware.authenticateUser(),
      ACLMiddleware.requireProjectMembership(),
      ACLMiddleware.requireProjectOwner()
    ]
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const project = await ProjectService.deleteProject(id);
      
      if (!project) {
        reply.code(404).send({
          error: 'Not Found',
          message: 'Project not found'
        });
        return;
      }
      
      reply.send(project);
    } catch (error) {
      if (error.message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message: error.message
        });
      } else if (error.message.includes('active members')) {
        reply.code(409).send({
          error: 'Conflict',
          message: error.message
        });
      } else {
        reply.code(400).send({
          error: 'Bad Request',
          message: error.message
        });
      }
    }
  });

  // 테넌트별 프로젝트 목록 조회 API
  fastify.get('/tenant/:tenant_id', {
    schema: {
      params: {
        tenant_id: Joi.number().integer().positive().required()
      },
      querystring: listProjectsQuerySchema,
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              color: { type: 'string' },
              tenant_id: { type: 'number' },
              owner_id: { type: 'number' },
              description: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { tenant_id } = request.params;
      const { limit, offset, search } = request.query;
      
      let projects;
      if (search) {
        projects = await ProjectService.searchProjects(tenant_id, search, limit, offset);
      } else {
        projects = await ProjectService.getProjectsByTenant(tenant_id, limit, offset);
      }
      
      reply.send(projects);
    } catch (error) {
      reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // 사용자별 프로젝트 목록 조회 API
  fastify.get('/user/:user_id', {
    schema: {
      params: {
        user_id: Joi.number().integer().positive().required()
      },
      querystring: listProjectsQuerySchema,
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              color: { type: 'string' },
              tenant_id: { type: 'number' },
              owner_id: { type: 'number' },
              description: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { user_id } = request.params;
      const { limit, offset } = request.query;
      
      const projects = await ProjectService.getProjectsByUser(user_id, limit, offset);
      reply.send(projects);
    } catch (error) {
      reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // 프로젝트 통계 조회 API
  fastify.get('/stats/tenant/:tenant_id', {
    schema: {
      params: {
        tenant_id: Joi.number().integer().positive().required()
      },
      response: {
        200: {
          type: 'object',
          properties: {
            total_projects: { type: 'number' },
            tenant_id: { type: 'number' },
            generated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { tenant_id } = request.params;
      const stats = await ProjectService.getProjectStats(tenant_id);
      reply.send(stats);
    } catch (error) {
      reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

module.exports = projectRoutes;
