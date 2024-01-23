import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterGroup from 'App/Models/MasterData/MasterGroup'
import User from 'App/Models/MasterData/Users/User'
import UserGroup from 'App/Models/MasterData/Users/UserGroup'
import MasterGroupValidator from 'App/Validators/MasterGroupValidator'

export default class MasterGroupsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-mastergroup")
            if (await bouncer.allows('read-mastergroup')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await MasterGroup.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy,
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
            await bouncer.authorize("create-mastergroup")
            if (await bouncer.allows('create-mastergroup')) {
                const payload = await request.validate(MasterGroupValidator)
                const q = new MasterGroup()
                q.merge(payload)
                await q.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-mastergroup")
            if (await bouncer.allows('read-mastergroup')) {
                const q = await MasterGroup.findOrFail(request.param('id'));
                const findUser = await User.findOrFail(q.user_id_kepgroup)
                const fetchUser = await User.query().where('dept_id', findUser.dept_id)
                const userGroup = await UserGroup.query().where('master_group_id', request.param('id'))
                return response.send({ status: true, data: { mastergroup: q, fetchUser, userGroup }, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-mastergroup")
            if (await bouncer.allows('update-mastergroup')) {
                const payload = await request.validate(MasterGroupValidator)
                const q = await MasterGroup.findOrFail(request.param('id'))
                q.merge(payload)
                await q.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-mastergroup")
            if (await bouncer.allows('delete-mastergroup')) {
                const q = await MasterGroup.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
