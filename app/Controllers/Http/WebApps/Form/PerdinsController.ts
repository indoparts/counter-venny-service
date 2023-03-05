import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormPerdin from 'App/Models/FormPerdin'
import PerdinValidator from 'App/Validators/PerdinValidator'

export default class PerdinsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-perdin")
            if (await bouncer.allows('read-perdin')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await FormPerdin.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
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
            await bouncer.authorize("create-perdin")
            if (await bouncer.allows('create-perdin')) {
                const payload = await request.validate(PerdinValidator)
                const q = new FormPerdin()
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
            await bouncer.authorize("read-perdin")
            if (await bouncer.allows('read-perdin')) {
                const q = await FormPerdin.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-perdin")
            if (await bouncer.allows('update-perdin')) {
                const payload = await request.validate(PerdinValidator)
                const q = await FormPerdin.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-perdin")
            if (await bouncer.allows('delete-perdin')) {
                const q = await FormPerdin.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async approval({ bouncer, request, response, auth }: HttpContextContract) {
        try {
            await bouncer.authorize("read-perdin")
            if (await bouncer.allows('read-perdin')) {
                const q = await FormPerdin.findOrFail(request.param('id'))
                if (auth.user?.id === q.user_id_approval) {
                    q.status_approval = 'y'
                    await q.save()
                    return response.send({ status: true, data: {}, msg: 'success' })
                }
                return response.send({ status: false, data: { msg: 'approval not valid!' }, msg: 'error' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
