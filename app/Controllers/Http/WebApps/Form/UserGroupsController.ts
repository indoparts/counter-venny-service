import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterGroup from 'App/Models/MasterGroup'
import User from 'App/Models/User'
import UserGroup from 'App/Models/UserGroup'
import UserGroupValidator from 'App/Validators/UserGroupValidator'

export default class UserGroupsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-usergroup")
            if (await bouncer.allows('read-usergroup')) {
                const { page, limit, sortDesc } = request.all()
                const fetch = await UserGroup.query()
                    .preload('master_group')
                    .preload('user')
                    .orderBy([
                        {
                            column: 'created_at',
                            order: sortDesc ? 'desc' : 'asc',
                        }
                    ]).paginate(page, limit)
                const user = await User.all()
                const allgroup = await MasterGroup.all()
                return response.send({ status: true, data: { datatable: fetch, user, allgroup }, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-usergroup")
            if (await bouncer.allows('create-usergroup')) {
                const payload = await request.validate(UserGroupValidator)
                // const arrname = [] as any;
                // const fetch = payload.user_id
                // for (let i = 0; i < fetch.length; i++) {
                //     arrname.push({
                //         master_group_id: payload.master_group_id,
                //         user_id: fetch[i]
                //     })
                // }
                // await UserGroup.updateOrCreateMany(['master_group_id', 'user_id'], arrname)
                const find = await MasterGroup.findOrFail(payload.master_group_id)
                await find.related('permission').sync(payload.user_id)
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async attr_form({ bouncer, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-usergroup")
            if (await bouncer.allows('read-usergroup')) {
                const master_group = await MasterGroup.all()
                const user = await User.all()
                return response.send({
                    status: true, data: { master_group, user }, msg: 'success'
                })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-usergroup")
            if (await bouncer.allows('read-usergroup')) {
                const id = request.param('id')
                const fetch = await UserGroup.query()
                    .where('master_group_id', id)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-usergroup")
            const payload = await request.validate(UserGroupValidator)
            if (await bouncer.allows('update-usergroup')) {
                const arrname = [] as any;
                const fetch = payload.user_id
                for (let i = 0; i < fetch.length; i++) {
                    arrname.push(fetch[i])
                }
                await (await MasterGroup.findOrFail(payload.master_group_id)).related('permission').sync(arrname)
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
