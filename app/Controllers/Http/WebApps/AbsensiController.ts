import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Absensi from 'App/Models/Absensi'
import AbsensiValidator from 'App/Validators/AbsensiValidator'
import { DateTimeFormated, UploadFile, arrayUnique } from 'App/helper'


export default class AbsensiController {
    public async index({ response, request }: HttpContextContract) {
        try {
            const { sortBy, sortDesc, page, limit } = request.all()
            const fetch = await Absensi.query().orderBy([
                {
                    column: sortBy !== '' ? sortBy : 'created_at',
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
            if (payload.keterangan_absen === 'masuk') {
                const datenow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)
                const cekDate = DateTimeFormated('YYYY-MM-DD', datenow)
                const count = await Database
                    .from('absensis')
                    .count('* as total')
                    .where((query) => {
                        query
                            .whereRaw('DATE(jam_masuk) = ?', [cekDate])
                            .where('user_id', auth.user?.id!)
                    })
                if (count[0].total < 1) {
                    const namafile = DateTimeFormated('yyyymmddhhiiss', new Date())
                    UploadFile(payload.foto_selfi, namafile, 'uploads/absensi-users')
                    const q = new Absensi()
                    q.user_id = auth.user?.id!
                    q.jam_masuk = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)
                    q.latitude_masuk = payload.latitude
                    q.longitude_masuk = payload.longitude
                    q.status_masuk = payload.status
                    q.waktu_telat_masuk = payload.waktu_telat_masuk!
                    q.foto_selfi_masuk = namafile + '.jpg' as string
                    await q.save()
                    return response.send({ status: true, data: payload, msg: 'success' })
                }
            }
            if (payload.keterangan_absen === 'pulang') {
                const datenow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)
                const cekDate = DateTimeFormated('YYYY-MM-DD', datenow)
                const count = await Database
                    .from('absensis')
                    .count('* as total')
                    .where((query) => {
                        query
                            .whereRaw('DATE(jam_pulang) = ?', [cekDate])
                            .where('user_id', auth.user?.id!)
                    })
                if (count[0].total < 1) {
                    const namafile = DateTimeFormated('yyyymmddhhiiss', new Date())
                    UploadFile(payload.foto_selfi, namafile, 'uploads/absensi-users')
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
                    return response.send({ status: true, data: payload, msg: 'success' })
                }
            }
            return response.send({ status: false, msg: 'error' })
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

    public async chart({ response, auth }: HttpContextContract) {
        try {
            const absensitelat = await Database.rawQuery(`SELECT COUNT(*) as count, MONTH(jam_masuk) as month_name FROM absensis where YEAR(jam_masuk) = date('Y') AND status_masuk = 'telat' AND user_id = ${auth.user?.id!} GROUP BY month_name`)
            const absensinormal = await Database.rawQuery(`SELECT COUNT(*) as count, MONTH(jam_masuk) as month_name FROM absensis where YEAR(jam_masuk) = date('Y') AND status_masuk = 'tidak telat' AND user_id = ${auth.user?.id!} GROUP BY month_name`)
            const month1: string[] = [];
            const month2: string[] = [];
            const telat: number[] = [];
            const tidak_telat: number[] = [];
            absensitelat[0].forEach(element => {
                month1.push(element.month_name)
            });
            absensinormal[0].forEach(element => {
                month2.push(element.month_name)
            });
            var Q = arrayUnique(month1.concat(month2));
            const label = Q.sort(function (a, b) {
                return a - b;
            })
            label.forEach(bulan => {
                let obj = absensitelat[0].find(o => o.month_name === bulan);
                if (obj !== undefined) {
                    telat.push(obj.count)
                }else{
                    telat.push(0)
                }
            });
            label.forEach(bulan => {
                let obj = absensinormal[0].find(o => o.month_name === bulan);
                if (obj !== undefined) {
                    tidak_telat.push(obj.count)
                } else {
                    tidak_telat.push(0)
                }
            });
            return response.send({ status: true, data: { label, telat, tidak_telat }, msg: 'success' })
        } catch (error) {
            console.log(error);
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
