import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import FormulaGaji from 'App/Models/FormulaGaji'

export default class FormulaGajisController {
    public async index({ response }: HttpContextContract) {
        try {
            const fetch = await FormulaGaji.query().orderBy('id', 'asc')
            return response.send({ status: true, data: fetch, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ request, response }: HttpContextContract) {
        try {
            const postSchema = schema.create({
                post: schema.array().members(
                    schema.object().members({
                        variable_name: schema.string(),
                        operator: schema.string(),
                    })
                ),
            })
            const payload = await request.validate({ schema: postSchema })
            await FormulaGaji.updateOrCreateMany('variable_name', payload.post)
            return response.send({ status: true, data: payload.post, msg: 'success' })
        } catch (error) {
            console.log(error);
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            const q = await FormulaGaji.find(request.param('id'));
            return response.send({ status: true, data: q, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const input = request.all()
            const q = await FormulaGaji.findOrFail(request.param('id'))
            q.variable_name = input.variable_name
            q.operator = input.operator
            await q.save()
            return response.send({ status: true, data: input, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ request, response }: HttpContextContract) {
        try {
            const q = await FormulaGaji.findOrFail(request.param('id'))
            await q.delete()
            return response.send({ status: true, data: {}, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async generate({ request, response }: HttpContextContract) {
        try {
            const input = request.all()
            var d = new Date([input.tahun, input.bulan].join('-')),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            const absensi = await Database.rawQuery(`select distinct a.*, u.name, u.nik, u.total_gaji_perbulan from absensis as a join users as u on a.user_id = u.id where YEAR(a.created_at)=${year} AND MONTH(a.created_at)=${month}`)
            const fetchdata: any[] = []
            for (let i = 0; i < absensi[0].length; i++) {
                const count = await Database.rawQuery(`select count(a.id) as total from absensis as a join users as u on a.user_id = u.id where YEAR(a.created_at)=${year} AND MONTH(a.created_at)=${month} AND a.user_id = ${absensi[0][i].user_id}`)
                const telat = await Database.rawQuery(`select count(a.id) as total from absensis as a join users as u on a.user_id = u.id where YEAR(a.created_at)=${year} AND MONTH(a.created_at)=${month} AND a.user_id = ${absensi[0][i].user_id} AND a.status_masuk = 'telat'`)
                fetchdata.push({
                    id: absensi[0][i].id,
                    user_id: absensi[0][i].user_id,
                    name: absensi[0][i].name,
                    nik: absensi[0][i].nik,
                    total_gaji_perbulan: absensi[0][i].total_gaji_perbulan,
                    total_absen: count[0][0].total,
                    total_absen_telat: telat[0][0].total,
                    periode_gaji: [year, month].join('-'),
                })
            }
            return response.send({ status: true, data: fetchdata, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
