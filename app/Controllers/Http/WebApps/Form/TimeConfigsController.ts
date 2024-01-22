import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JadwalGroup from 'App/Models/JadwalGroup'
import TimeConfig from 'App/Models/TimeConfig'
import UserGroup from 'App/Models/UserGroup'
import TimeConfigValidator from 'App/Validators/TimeConfigValidator'

export default class TimeConfigsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-timeconfig")
            if (await bouncer.allows('read-timeconfig')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await TimeConfig.query().where('type', 'LIKE', '%' + search + '%').orderBy([
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
            await bouncer.authorize("create-timeconfig")
            if (await bouncer.allows('create-timeconfig')) {
                const payload = await request.validate(TimeConfigValidator)
                const q = new TimeConfig()
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
            await bouncer.authorize("read-timeconfig")
            if (await bouncer.allows('read-timeconfig')) {
                const q = await TimeConfig.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-timeconfig")
            if (await bouncer.allows('update-timeconfig')) {
                const payload = await request.validate(TimeConfigValidator)
                const q = await TimeConfig.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-timeconfig")
            if (await bouncer.allows('delete-timeconfig')) {
                const q = await TimeConfig.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async jadwal_user({ response, auth }: HttpContextContract) {
        try {
            const findUser = await UserGroup.query().where('user_id', auth.user?.id!).first()
            if (findUser) {
                const jadwal = await JadwalGroup.query()
                    .where('master_group_id', findUser[0].master_group_id)
                    .preload('time_config')
                    .preload('master_group')
                return response.send({ status: true, data: jadwal, msg: 'success' })
            }
            return response.status(404).send({ status: false, data: null, msg: 'data not found' })
        } catch (error) {
            console.log(error);
            
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
