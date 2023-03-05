import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JadwalGroup from 'App/Models/JadwalGroup'
import JadwalGroupValidator from 'App/Validators/JadwalGroupValidator'

export default class JadwalGroupsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-jadwalgroup")
            if (await bouncer.allows('read-jadwalgroup')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await JadwalGroup.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
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
            await bouncer.authorize("create-jadwalgroup")
            if (await bouncer.allows('create-jadwalgroup')) {
                const payload = await request.validate(JadwalGroupValidator)
                const q = new JadwalGroup()
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
            await bouncer.authorize("read-jadwalgroup")
            if (await bouncer.allows('read-jadwalgroup')) {
                const q = await JadwalGroup.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-jadwalgroup")
            if (await bouncer.allows('update-jadwalgroup')) {
                const payload = await request.validate(JadwalGroupValidator)
                const q = await JadwalGroup.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-jadwalgroup")
            if (await bouncer.allows('delete-jadwalgroup')) {
                const q = await JadwalGroup.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
