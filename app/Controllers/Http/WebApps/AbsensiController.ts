import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Absensi from 'App/Models/Absensi'
import AbsensiValidator from 'App/Validators/AbsensiValidator'
import { DateTimeFormated, UploadFile } from 'App/helper'


export default class AbsensiController {
    public async index({ response, request }: HttpContextContract) {
        try {
            const { sortBy, sortDesc, page, limit } = request.all()
            const fetch = await Absensi.query().orderBy([
                {
                    column: sortBy,
                    order: sortDesc ? 'desc' : 'asc',
                }
            ]).paginate(page, limit)
            return response.send({ status: true, data: fetch, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ request, response, auth }: HttpContextContract) {
        try {
            const payload = await request.validate(AbsensiValidator)
            const namafile = DateTimeFormated('yyyymmddhhiiss', new Date())
            UploadFile(payload.foto_selfi, namafile, 'uploads/absensi-users')

            if (payload.keterangan_absen === 'masuk') {
                const q = new Absensi()
                q.user_id = auth.user?.id!
                q.jam_masuk = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)
                q.latitude_masuk = payload.latitude
                q.longitude_masuk = payload.longitude
                q.status_masuk = payload.status
                q.waktu_telat_masuk = payload.waktu_telat_masuk!
                q.foto_selfi_masuk = namafile + '.jpg' as string
                await q.save()
            }
            if (payload.keterangan_absen === 'pulang') {
                await Absensi
                    .query()
                    .where((query) => {
                        query
                            .where('user_id', auth.user?.id!)
                            .whereNull('jam_pulang')
                    })
                    .orderBy('id', 'desc')
                    .update({
                        jam_pulang: new Date((new Date()).getTime() + 24 * 60 * 60 * 1000),
                        latitude_pulang: payload.latitude,
                        longitude_pulang: payload.longitude,
                        foto_selfi_pulang: namafile + '.jpg' as string,
                    })
            }
            return response.send({ status: true, data: payload, msg: 'success' })
        } catch (error) {
            console.log(error);
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            const q = await Absensi.find(request.param('id'));
            return response.send({ status: true, data: q, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ request, response }: HttpContextContract) {
        try {
            const q = await Absensi.findOrFail(request.param('id'))
            await q.delete()
            return response.send({ status: true, data: {}, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
