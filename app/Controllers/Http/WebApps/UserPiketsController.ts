import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dept from 'App/Models/Dept'
import MasterPiket from 'App/Models/MasterPiket'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import UserPiket from 'App/Models/UserPiket'
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
                    case 'attr':
                        const divisi = await Dept.all()
                        const role = await Role.all()
                        const piket = await MasterPiket.all()
                        return response.send({ status: true, data: { divisi, role, piket }, msg: 'success' })
                    case 'user':
                        const input = request.input('value').split(",")
                        const user = await User.query().where((query) => {
                            query
                                .where('role_id', input[0])
                                .where('dept_id', input[1])
                        })
                        return response.send({ status: true, data: user, msg: 'success' })
                }

            }
        } catch (error) {
            console.log(error);

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
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
