import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JadwalIstirahat from 'App/Models/JadwalIstirahat'
import MasterGroup from 'App/Models/MasterGroup'
import UserGroup from 'App/Models/UserGroup'
import Ws from 'App/Services/Ws'
import JadwalIstirahatValidator from 'App/Validators/JadwalIstirahatValidator'

export default class JadwalIstirahatsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-jadwalistirahat")
            if (await bouncer.allows('read-jadwalistirahat')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await JadwalIstirahat.query().where('dept_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'created_at',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                    .preload('dept')
                    .preload('role')
                    .preload('user')
                    .paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async report({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-jadwalistirahat")
            if (await bouncer.allows('read-jadwalistirahat')) {
                const { sortBy, sortDesc, page, limit, search, daterange } = request.all()
                const fetch = await JadwalIstirahat.query().where('dept_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'created_at',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                    .whereBetween('date', daterange.split(","))
                    .preload('dept')
                    .preload('role')
                    .preload('user')
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
            await bouncer.authorize("read-cuti")
            if (await bouncer.allows('read-cuti')) {
                const { daterange } = request.all()
                const fetch = await JadwalIstirahat.query().orderBy([
                    {
                        column: 'created_at',
                        order: 'asc',
                    }
                ])
                    .whereBetween('date', daterange.split(","))
                    .preload('dept')
                    .preload('role')
                    .preload('user')
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async attr_form({ request, bouncer, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-jadwalistirahat")
            if (await bouncer.allows('create-jadwalistirahat')) {
                switch (request.input('key')) {
                    case 'group':
                        const group = await MasterGroup.all()
                        return response.send({ status: true, data: group, msg: 'success' })
                    case 'user':
                        const input = request.input('value')
                        const cariuSER = await UserGroup.query().where('master_group_id', input).preload('user')
                        return response.send({ status: true, data: cariuSER, msg: 'success' })
                }

            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-jadwalistirahat")
            if (await bouncer.allows('create-jadwalistirahat')) {
                const payload = await request.validate(JadwalIstirahatValidator)
                const q = new JadwalIstirahat()
                q.merge(payload)
                await q.save()
                Ws.io.emit('jadwal-istirahat:new', { payload })
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
