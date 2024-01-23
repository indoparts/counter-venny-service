import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterOffice from 'App/Models/MasterData/MasterOffice'
import MasterOfficeValidator from 'App/Validators/MasterOfficeValidator'

export default class MasterOfficeController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-masteroffice")
            if (await bouncer.allows('read-masteroffice')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch =  await MasterOffice.query().where('nama', 'LIKE', '%'+search+'%').orderBy([
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
            await bouncer.authorize("create-masteroffice")
            if (await bouncer.allows('create-masteroffice')) {
                const payload = await request.validate(MasterOfficeValidator)
                const q = new MasterOffice()
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
            await bouncer.authorize("read-masteroffice")
            if (await bouncer.allows('read-masteroffice')) {
                const q = await MasterOffice.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-masteroffice")
            if (await bouncer.allows('update-masteroffice')) {
                const payload = await request.validate(MasterOfficeValidator)
                const q = await MasterOffice.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-masteroffice")
            if (await bouncer.allows('delete-masteroffice')) {
                const q = await MasterOffice.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
