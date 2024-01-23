import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterToko from 'App/Models/MasterData/MasterToko'
import MasterTokoValidator from 'App/Validators/MasterTokoValidator'

export default class MasterTokoController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-mastertoko")
            if (await bouncer.allows('read-mastertoko')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch =  await MasterToko.query().where('nama', 'LIKE', '%'+search+'%').orderBy([
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
            await bouncer.authorize("create-mastertoko")
            if (await bouncer.allows('create-mastertoko')) {
                const payload = await request.validate(MasterTokoValidator)
                const q = new MasterToko()
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
            await bouncer.authorize("read-mastertoko")
            if (await bouncer.allows('read-mastertoko')) {
                const q = await MasterToko.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-mastertoko")
            if (await bouncer.allows('update-mastertoko')) {
                const payload = await request.validate(MasterTokoValidator)
                const q = await MasterToko.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-mastertoko")
            if (await bouncer.allows('delete-mastertoko')) {
                const q = await MasterToko.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
