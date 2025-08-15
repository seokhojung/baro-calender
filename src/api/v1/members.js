const fastify = require('fastify');
<<<<<<< HEAD
const Joi = require('joi');
=======
>>>>>>> 2b71f98b066ec7ed28857fc750a5e01cbb498291
const MemberService = require('../../services/memberService');
const ACLMiddleware = require('../../middleware/acl');
const {
  inviteMemberSchema,
  updateMemberRoleSchema,
  memberIdSchema,
  listMembersQuerySchema,
  searchMembersQuerySchema,
  bulkInviteMembersSchema,
  memberStatsQuerySchema
} = require('../../schemas/memberSchema');

/**
 * 멤버 API 라우터
 * @param {Object} fastify - Fastify 인스턴스
 */
async function memberRoutes(fastify, options) {
  
  // 멤버 초대 API
  fastify.post('/projects/:project_id/members', {
    schema: {
      params: {
        project_id: Joi.number().integer().positive().required()
      },
      body: inviteMemberSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            tenant_id: { type: 'number' },
            project_id: { type: 'number' },
            user_id: { type: 'number' },
            role: { type: 'string' },
            invited_at: { type: 'string', format: 'date-time' },
            accepted_at: { type: 'string', format: 'date-time' },
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
      ACLMiddleware.requirePermission('canInviteMembers')
    ]
  }, async (request, reply) => {
    try {
      const { project_id } = request.params;
      const { user_id, role } = request.body;
      
      const member = await MemberService.inviteMember({
        tenant_id: request.user.tenant_id,
        project_id: parseInt(project_id),
        user_id,
        role
      });
      
      reply.code(201).send(member);
    } catch (error) {
      if (error.message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message: error.message
        });
      } else if (error.message.includes('already a member')) {
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

  // 멤버 목록 조회 API
  fastify.get('/projects/:project_id/members', {
    schema: {
      params: {
        project_id: Joi.number().integer().positive().required()
      },
      querystring: listMembersQuerySchema,
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              tenant_id: { type: 'number' },
              project_id: { type: 'number' },
              user_id: { type: 'number' },
              role: { type: 'string' },
              invited_at: { type: 'string', format: 'date-time' },
              accepted_at: { type: 'string', format: 'date-time' },
              created_at: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  email: { type: 'string' },
                  first_name: { type: 'string' },
                  last_name: { type: 'string' }
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
    },
    preHandler: [
      ACLMiddleware.authenticateUser(),
      ACLMiddleware.requireProjectMembership(),
      ACLMiddleware.requireViewerOrHigher()
    ]
  }, async (request, reply) => {
    try {
      const { project_id } = request.params;
      const { limit, offset, role, search } = request.query;
      
      let members;
      if (search) {
        members = await MemberService.searchMembers(project_id, search, limit, offset);
      } else {
        members = await MemberService.getProjectMembers(project_id, limit, offset);
      }
      
      // 역할별 필터링
      if (role) {
        members = members.filter(member => member.role === role);
      }
      
      reply.send(members);
    } catch (error) {
      if (error.message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message: error.message
        });
      } else {
        reply.code(500).send({
          error: 'Internal Server Error',
          message: error.message
        });
      }
    }
  });

  // 멤버 역할 변경 API
  fastify.patch('/projects/:project_id/members/:user_id', {
    schema: {
      params: {
        project_id: Joi.number().integer().positive().required(),
        user_id: Joi.number().integer().positive().required()
      },
      body: updateMemberRoleSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            tenant_id: { type: 'number' },
            project_id: { type: 'number' },
            user_id: { type: 'number' },
            role: { type: 'string' },
            invited_at: { type: 'string', format: 'date-time' },
            accepted_at: { type: 'string', format: 'date-time' },
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
        }
      }
    },
    preHandler: [
      ACLMiddleware.authenticateUser(),
      ACLMiddleware.requireProjectMembership(),
      ACLMiddleware.requirePermission('canChangeMemberRoles')
    ]
  }, async (request, reply) => {
    try {
      const { project_id, user_id } = request.params;
      const { role } = request.body;
      
      const member = await MemberService.updateMemberRole(
        parseInt(project_id), 
        parseInt(user_id), 
        role
      );
      
      reply.send(member);
    } catch (error) {
      if (error.message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message: error.message
        });
      } else if (error.message.includes('Cannot change owner role')) {
        reply.code(400).send({
          error: 'Bad Request',
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

  // 멤버 제거 API
  fastify.delete('/projects/:project_id/members/:user_id', {
    schema: {
      params: {
        project_id: Joi.number().integer().positive().required(),
        user_id: Joi.number().integer().positive().required()
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            tenant_id: { type: 'number' },
            role: { type: 'string' },
            invited_at: { type: 'string', format: 'date-time' },
            accepted_at: { type: 'string', format: 'date-time' },
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
        }
      }
    },
    preHandler: [
      ACLMiddleware.authenticateUser(),
      ACLMiddleware.requireProjectMembership(),
      ACLMiddleware.requirePermission('canRemoveMembers')
    ]
  }, async (request, reply) => {
    try {
      const { project_id, user_id } = request.params;
      
      const member = await MemberService.removeMember(
        parseInt(project_id), 
        parseInt(user_id)
      );
      
      reply.send(member);
    } catch (error) {
      if (error.message.includes('not found')) {
        reply.code(404).send({
          error: 'Not Found',
          message: error.message
        });
      } else if (error.message.includes('Cannot remove project owner')) {
        reply.code(400).send({
          error: 'Bad Request',
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
}

module.exports = memberRoutes;
