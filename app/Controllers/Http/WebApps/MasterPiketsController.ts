import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterPiket from 'App/Models/MasterData/MasterPiket'
import MasterPiketValidator from 'App/Validators/MasterPiketValidator'

export default class MasterPiketsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-jadwalpiket")
            if (await bouncer.allows('read-jadwalpiket')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await MasterPiket.query().where('tugas', 'LIKE', '%' + search + '%').orderBy([
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
            await bouncer.authorize("create-jadwalpiket")
            if (await bouncer.allows('create-jadwalpiket')) {
                const payload = await request.validate(MasterPiketValidator)
                const q = new MasterPiket()
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
            await bouncer.authorize("read-jadwalpiket")
            if (await bouncer.allows('read-jadwalpiket')) {
                const q = await MasterPiket.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-jadwalpiket")
            if (await bouncer.allows('update-jadwalpiket')) {
                const payload = await request.validate(MasterPiketValidator)
                const q = await MasterPiket.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-jadwalpiket")
            if (await bouncer.allows('delete-jadwalpiket')) {
                const q = await MasterPiket.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
