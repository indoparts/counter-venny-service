import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterGroup from 'App/Models/MasterData/MasterGroup'
import MasterPiket from 'App/Models/MasterData/MasterPiket'
import UserGroup from 'App/Models/MasterData/Users/UserGroup'
import UserPiket from 'App/Models/MasterData/Users/UserPiket'
import Ws from 'App/Services/Ws'
import UserPiketValidator from 'App/Validators/UserPiketValidator'

export default class UserPiketsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-jadwalpiket")
            if (await bouncer.allows('read-jadwalpiket')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await UserPiket.query().where('dept_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'created_at',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                    .preload('dept')
                    .preload('role')
                    .preload('user')
                    .preload('masterPiket')
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
            await bouncer.authorize("read-jadwalpiket")
            if (await bouncer.allows('read-jadwalpiket')) {
                const { sortBy, sortDesc, page, limit, search, daterange } = request.all()
                const fetch = await UserPiket.query().where('dept_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'created_at',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                    .whereBetween('date', daterange.split(","))
                    .preload('dept')
                    .preload('role')
                    .preload('user')
                    .preload('masterPiket')
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
                const fetch = await UserPiket.query().orderBy([
                    {
                        column: 'created_at',
                        order: 'asc',
                    }
                ])
                    .whereBetween('date', daterange.split(","))
                    .preload('dept')
                    .preload('role')
                    .preload('user')
                    .preload('masterPiket')
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async attr_form({ request, bouncer, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-jadwalpiket")
            if (await bouncer.allows('create-jadwalpiket')) {
                switch (request.input('key')) {
                    case 'group':
                        const group = await MasterGroup.all()
                        const piket = await MasterPiket.all()
                        return response.send({ status: true, data: { group: group, piket: piket }, msg: 'success' })
                    case 'user':
                        const input = request.input('value')
                        const cariuSER = await UserGroup.query().where('master_group_id', input).preload('user')
                        return response.send({ status: true, data: cariuSER, msg: 'success' })
                }

            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-jadwalpiket")
            if (await bouncer.allows('create-jadwalpiket')) {
                const payload = await request.validate(UserPiketValidator)
                const q = new UserPiket()
                q.merge(payload)
                await q.save()
                Ws.io.emit('jadwal-piket:new', { payload })
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
                const fetch = await UserPiket.query()
                    .where('id', request.param('id'))
                    .preload('masterPiket')
                    .preload('user')
                    .preload('role')
                    .preload('dept')
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-jadwalpiket")
            if (await bouncer.allows('delete-jadwalpiket')) {
                const x = await UserPiket.findOrFail(request.param('id'))
                await x.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}