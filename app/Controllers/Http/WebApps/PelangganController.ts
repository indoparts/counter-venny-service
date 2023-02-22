import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterPelanggan from 'App/Models/MasterPelanggan'
import PelangganValidator from 'App/Validators/PelangganValidator'

export default class PelangganController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-masterpelanggan")
            if (await bouncer.allows('read-masterpelanggan')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await MasterPelanggan.query()
                    .where(sortBy !== '' ? sortBy : 'nama', 'LIKE', '%' + search + '%')
                    .orderBy([
                        {
                            column: sortBy !== '' ? sortBy : 'created_at',
                            order: sortDesc ? 'desc' : 'asc',
                        }
                    ]).paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);
            
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-masterpelanggan")
            if (await bouncer.allows('create-masterpelanggan')) {
                const validate = await request.validate(PelangganValidator)
                const role = new MasterPelanggan()
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
            await bouncer.authorize("read-masterpelanggan")
            if (await bouncer.allows('read-masterpelanggan')) {
                const fetch = await MasterPelanggan.find(request.param('id'));
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-masterpelanggan")
            if (await bouncer.allows('update-masterpelanggan')) {
                const payload = await request.validate(PelangganValidator)
                const role = await MasterPelanggan.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-masterpelanggan")
            if (await bouncer.allows('delete-masterpelanggan')) {
                const role = await MasterPelanggan.findOrFail(request.param('id'))
                await role.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            console.log(error);
            
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
