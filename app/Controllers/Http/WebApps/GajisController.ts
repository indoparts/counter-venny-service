import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Gaji from 'App/Models/Gaji'
import { gaji_variable } from 'App/helper'

export default class GajisController {
    public async index({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-gaji")
            if (await bouncer.allows('read-gaji')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await Gaji.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'created_at',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                    .preload('user')
                    .preload('gajivariable')
                    .paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-gaji")
            if (await bouncer.allows('create-gaji')) {
                const postSchema = schema.create({
                    post: schema.array().members(
                        schema.object().members({
                            user_id: schema.number(),
                            total_absen: schema.number(),
                            total_terlambat: schema.number(),
                            total_workday: schema.number(),
                            periode: schema.string(),
                            gaji_perbulan: schema.number(),
                            gaji_perhari: schema.number(),
                            gaji_thp: schema.number(),
                        })
                    ),
                })
                const payload = await request.validate({ schema: postSchema })
                payload.post.forEach(async el => {
                    const variable = await Database
                        .from('formula_gajis as fg')
                        .join('variable_gajis as vg', 'fg.variable_name', '=', 'vg.variable_name')
                        .select('fg.variable_name')
                        .select('fg.operator')
                        .select('vg.bobot')
                        .select('vg.id')
                    const arr: any[] = []
                    variable.forEach(e => {
                        const x = gaji_variable(e.variable_name, e.bobot, el.gaji_perhari, el.periode, el.total_absen)
                        arr.push({
                            variable_gaji_id: e.id,
                            bobot: e.bobot,
                            nominal: x
                        })
                    });
                    const q = new Gaji()
                    q.user_id = el.user_id
                    q.total_absen = el.total_absen
                    q.total_terlambat = el.total_terlambat
                    q.total_workday = el.total_workday
                    q.periode = el.periode
                    q.gaji_perbulan = el.gaji_perbulan
                    q.gaji_perhari = el.gaji_perhari
                    q.gaji_thp = el.gaji_thp
                    await q.save()
                    await q.related('gajivariable').createMany(arr)
                });
                return response.send({ status: true, data: payload.post, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-gaji")
            if (await bouncer.allows('read-gaji')) {
                const q = await Gaji.query().where('id', request.param('id')).preload('user');
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-gaji")
            if (await bouncer.allows('update-gaji')) {
                const postSchema = schema.create({
                    user_id: schema.number(),
                    total_absen: schema.number(),
                    total_terlambat: schema.number(),
                    total_workday: schema.number(),
                    periode: schema.string(),
                    gaji_perbulan: schema.number(),
                    gaji_perhari: schema.number(),
                    gaji_thp: schema.number(),
                })
                const payload = await request.validate({ schema: postSchema })
                const q = await Gaji.findOrFail(request.param('id'));
                const variable = await Database
                    .from('formula_gajis as fg')
                    .join('variable_gajis as vg', 'fg.variable_name', '=', 'vg.variable_name')
                    .select('fg.variable_name')
                    .select('fg.operator')
                    .select('vg.bobot')
                    .select('vg.id')
                const arr: any[] = []
                variable.forEach(e => {
                    const x = gaji_variable(e.variable_name, e.bobot, q.gaji_perhari, q.periode, q.total_absen)
                    arr.push({
                        variable_gaji_id: e.id,
                        bobot: e.bobot,
                        nominal: x
                    })
                });
                q.user_id = payload.user_id
                q.total_absen = payload.total_absen
                q.total_terlambat = payload.total_terlambat
                q.total_workday = payload.total_workday
                q.periode = payload.periode
                q.gaji_perbulan = payload.gaji_perbulan
                q.gaji_perhari = payload.gaji_perhari
                q.gaji_thp = payload.gaji_thp
                await q.save()
                await q.related('gajivariable').updateOrCreateMany(arr, 'gaji_id')
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-gaji")
            if (await bouncer.allows('update-gaji')) {
                const q = await Gaji.findOrFail(request.param('id'))
                await Database
                    .from('gaji_variables')
                    .where('gaji_id', q.id)
                    .delete()
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async report({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-gaji")
            if (await bouncer.allows('read-gaji')) {
                const { sortBy, sortDesc, page, limit, search, daterange } = request.all()
                const fetch = await Gaji.query().orderBy([
                    {
                        column: sortBy === '' ? 'created_at' : sortBy,
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                    .where('user_id', 'LIKE', '%' + search + '%')
                    .whereBetween('created_at', daterange.split(","))
                    .preload('user')
                    .preload('gajivariable')
                    .paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async exportreport({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-gaji")
            if (await bouncer.allows('read-gaji')) {
                const { daterange } = request.all()
                const fetch = await Gaji.query().orderBy([
                    {
                        column: 'created_at',
                        order: 'asc',
                    }
                ])
                    .whereBetween('created_at', daterange.split(","))
                    .preload('user')
                    .preload('gajivariable')
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async selip({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-gaji")
            if (await bouncer.allows('read-gaji')) {
                const userId = request.param('userId')
                if (userId !== undefined) {
                    if (userId !== 'undefined') {
                        const q = await Gaji.query()
                            .where((query) => {
                                query
                                    .where('user_id', userId)
                                    .where('periode', '2023-04')
                            })
                            .preload('user');
                        const x = await Database.rawQuery(`SELECT mo.* FROM users u JOIN user_offices uo ON u.id = uo.user_id JOIN master_offices mo ON uo.master_office_id = mo.id WHERE u.id = ${userId}`);
                        return response.send({ status: true, data: { data: q, office: x[0][0] }, msg: 'success' })
                    }
                }
            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
