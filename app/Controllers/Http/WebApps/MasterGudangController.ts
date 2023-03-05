import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterGudang from 'App/Models/MasterGudang'
import MasterGudangValidator from 'App/Validators/MasterGudangValidator'

export default class MasterGudangController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-mastergudang")
            if (await bouncer.allows('read-mastergudang')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch =  await MasterGudang.query().where('nama', 'LIKE', '%'+search+'%').orderBy([
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
            await bouncer.authorize("create-mastergudang")
            if (await bouncer.allows('create-mastergudang')) {
                const payload = await request.validate(MasterGudangValidator)
                const q = new MasterGudang()
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
            await bouncer.authorize("read-mastergudang")
            if (await bouncer.allows('read-mastergudang')) {
                const q = await MasterGudang.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-mastergudang")
            if (await bouncer.allows('update-mastergudang')) {
                const payload = await request.validate(MasterGudangValidator)
                const q = await MasterGudang.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-mastergudang")
            if (await bouncer.allows('delete-mastergudang')) {
                const q = await MasterGudang.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
