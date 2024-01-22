import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import FormCuti from "App/Models/FormCuti"
import Ws from 'App/Services/Ws'
import CutiValidator from 'App/Validators/CutiValidator'

export default class CutisController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-cuti")
            if (await bouncer.allows('read-cuti')) {
                const { sortBy, sortDesc, page, limit, search } = request.all()
                const fetch = await FormCuti.query().orderBy([
                    {
                        column: sortBy === '' ? 'created_at' : sortBy,
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                .where('user_id', 'LIKE', '%' + search + '%')
                .preload('user')
                .preload('userapproval')
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
            await bouncer.authorize("read-cuti")
            if (await bouncer.allows('read-cuti')) {
                const { sortBy, sortDesc, page, limit, search, daterange } = request.all()
                const fetch = await FormCuti.query().orderBy([
                    {
                        column: sortBy === '' ? 'created_at' : sortBy,
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                .where('user_id', 'LIKE', '%' + search + '%')
                .whereBetween('date', daterange.split(","))
                .preload('user')
                .preload('userapproval')
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
                const fetch = await FormCuti.query().orderBy([
                    {
                        column: 'created_at',
                        order: 'asc',
                    }
                ])
                .whereBetween('date', daterange.split(","))
                .preload('user')
                .preload('userapproval')
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);
            
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-cuti")
            if (await bouncer.allows('create-cuti')) {
                const payload = await request.validate(CutiValidator)
                const q = new FormCuti()
                q.merge(payload)
                await q.save()
                Ws.io.emit('notif-info:pengajuan-cuti', { payload })
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-cuti")
            if (await bouncer.allows('read-cuti')) {
                const q = await FormCuti.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-cuti")
            if (await bouncer.allows('update-cuti')) {
                const payload = await request.validate(CutiValidator)
                const q = await FormCuti.findOrFail(request.param('id'))
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
            await bouncer.authorize("delete-cuti")
            if (await bouncer.allows('delete-cuti')) {
                const q = await FormCuti.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async approval({ bouncer, request, response, auth }: HttpContextContract) {
        try {
            await bouncer.authorize("read-cuti")
            if (await bouncer.allows('read-cuti')) {
                const q = await FormCuti.findOrFail(request.param('id'))
                if (auth.user?.id === q.user_id_approval) {
                    q.status_approval = request.input('status_approval')
                    await q.save()
                    Ws.io.emit('notif-info:approval-cuti', { q })
                    return response.send({ status: true, data: {}, msg: 'success' })
                }
                return response.send({ status: false, data: { msg: 'approval not valid!' }, msg: 'error' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
