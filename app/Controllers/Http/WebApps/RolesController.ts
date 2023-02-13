import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import RoleValidator from 'App/Validators/RoleValidator'

export default class RolesController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-role")
            if (await bouncer.allows('read-role')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await Role.query()
                    .where(sortBy !== '' ? sortBy : 'rolename', 'LIKE', '%' + search + '%')
                    .orderBy([
                        {
                            column: sortBy !== '' ? sortBy : 'created_at',
                            order: sortDesc ? 'desc' : 'asc',
                        }
                    ]).paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-role")
            if (await bouncer.allows('create-role')) {
                const validate = await request.validate(RoleValidator)
                const role = new Role()
                role.merge(validate)
                await role.save()
                return response.send({ status: true, data: validate, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-role")
            if (await bouncer.allows('read-role')) {
                const fetch = await Role.find(request.param('id'));
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-role")
            if (await bouncer.allows('update-role')) {
                const payload = await request.validate(RoleValidator)
                const role = await Role.findOrFail(request.param('id'))
                role.merge(payload)
                await role.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-role")
            if (await bouncer.allows('delete-role')) {
                const role = await Role.findOrFail(request.param('id'))
                await role.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
