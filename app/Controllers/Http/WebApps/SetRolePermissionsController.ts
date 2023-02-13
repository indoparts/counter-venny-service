import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import RoleHasPermission from 'App/Models/RoleHasPermission'

export default class SetRolePermissionsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-permission")
            if (await bouncer.allows('read-permission')) {
                const { page, limit, sortDesc } = request.all()
                const fetch = await RoleHasPermission.query()
                .preload('roles')
                .preload('permission')
                .orderBy([
                    {
                        column: 'id',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ]).paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status:false, data:error.messages, msg:'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            /*
            |--------------------------------------------------------------------------
            | EXAMPLE REQUEST FORM
            |--------------------------------------------------------------------------
            { role_id: 6, permission_id: [ 16, 15, 14, 13 ] }
            |
            */
            await bouncer.authorize("create-permission")
            const newPostSchema = schema.create({
                role_id: schema.number(),
                permission_id: schema.array().members(schema.number()),
            })
            if (await bouncer.allows('create-permission')) {
                const payload = await request.validate({ schema: newPostSchema })
                const arrname = [] as any;
                const fetch = payload.permission_id
                for (let i = 0; i < fetch.length; i++) {
                    arrname.push({
                        role_id: payload.role_id,
                        permission_id: fetch[i]
                    })
                }
                await RoleHasPermission.updateOrCreateMany(['role_id','permission_id'],arrname)
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status:false, data:error.messages, msg:'error' })
        }
    }

    public async attr_form({ bouncer, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-permission")
            if (await bouncer.allows('read-permission')) {
                const jabatan = await Role.all()
                const akses = await Permission.all()
                return response.send({ status: true, data: { "role": jabatan, "akses": akses }, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status:false, data:error.messages, msg:'error' })
        }
    }

    public async show({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-permission")
            if (await bouncer.allows('read-permission')) {
                const id = request.param('id')
                const fetch = await RoleHasPermission.query()
                .where('role_id', id)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status:false, data:error.messages, msg:'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            /*
            |--------------------------------------------------------------------------
            | EXAMPLE REQUEST FORM
            |--------------------------------------------------------------------------
            { role_id: 6, permission_id: [ 16, 15, 14, 13 ] }
            |
            */
            const newPostSchema = schema.create({
                role_id: schema.number(),
                permission_id: schema
                    .array([
                        rules.minLength(1)
                    ])
                    .members(schema.number()),  
            })
            await bouncer.authorize("update-permission")
            const payload = await request.validate({ schema: newPostSchema })
            if (await bouncer.allows('update-permission')) {
                const arrname = [] as any;
                const fetch = payload.permission_id
                for (let i = 0; i < fetch.length; i++) {
                    arrname.push(fetch[i])
                }
                await (await Role.findOrFail(payload.role_id)).related('permission').sync(arrname)
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status:false, data:error.messages, msg:'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-permission")
            if (await bouncer.allows('delete-permission')) {
                const q = await RoleHasPermission.find(request.param('id'))
                if (q) {
                    await q.delete()
                }
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status:false, data:error.messages, msg:'error' })
        }
    }
}
