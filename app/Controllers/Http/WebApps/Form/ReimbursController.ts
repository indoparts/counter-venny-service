import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormReimbur from 'App/Models/FormReimbur'
import Ws from 'App/Services/Ws'
import { ReimbursUpdateValidator, ReimbursValidator } from 'App/Validators/ReimbursValidator'
import { UnlinkFile, UploadFile, uniqueDatime } from 'App/helper'

export default class ReimbursController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-reimburs")
            if (await bouncer.allows('read-reimburs')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await FormReimbur.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'user_id',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                    .preload('user')
                    .preload('userapproval')
                    .paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async report({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const { sortBy, sortDesc, page, limit, search, daterange } = request.all()
                const fetch = await FormReimbur.query().orderBy([
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
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async exportreport({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const { daterange } = request.all()
                const fetch = await FormReimbur.query().orderBy([
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
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response, auth }: HttpContextContract) {
        try {
            await bouncer.authorize("create-reimburs")
            if (await bouncer.allows('create-reimburs')) {
                const payload = await request.validate(ReimbursValidator)
                const q = new FormReimbur()
                let unique = auth.user?.nik + '-' + auth.user?.name + '-' + uniqueDatime(new Date())
                if (payload.file_receipt != null) {
                    UploadFile(payload.file_receipt, `reimburs-${unique}`, `uploads/reimburs`)
                    q.file_receipt = `reimburs-${unique}.${payload.file_receipt.extname}`
                }
                q.user_id = payload.user_id
                q.transaction_id = unique
                q.date = payload.date
                q.category = payload.category
                q.user_id_approval = payload.user_id_approval
                q.status_approval = payload.status_approval
                await q.save()
                Ws.io.emit('notif-info:pengajuan-reimburs', { payload })
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-reimburs")
            if (await bouncer.allows('read-reimburs')) {
                const q = await FormReimbur.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response, auth }: HttpContextContract) {
        try {
            await bouncer.authorize("update-reimburs")
            if (await bouncer.allows('update-reimburs')) {
                const payload = await request.validate(ReimbursUpdateValidator)
                const q = await FormReimbur.findOrFail(request.param('id'))
                let unique = auth.user?.nik + '-' + auth.user?.name + '-' + uniqueDatime(new Date())
                if (payload.file_receipt != null) {
                    UnlinkFile(q.file_receipt, `uploads/reimburs`)
                    UploadFile(payload.file_receipt, `reimburs-${unique}`, `uploads/reimburs`)
                    q.file_receipt = `reimburs-${unique}.${payload.file_receipt.extname}`
                }
                q.user_id = payload.user_id
                q.transaction_id = unique
                q.date = payload.date
                q.category = payload.category
                q.user_id_approval = payload.user_id_approval
                q.status_approval = payload.status_approval
                await q.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-reimburs")
            if (await bouncer.allows('delete-reimburs')) {
                const q = await FormReimbur.findOrFail(request.param('id'))
                UnlinkFile(q.file_receipt, `uploads/reimburs`)
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async approval({ bouncer, request, response, auth }: HttpContextContract) {
        try {
            await bouncer.authorize("read-reimburs")
            if (await bouncer.allows('read-reimburs')) {
                const q = await FormReimbur.findOrFail(request.param('id'))
                if (auth.user?.id === q.user_id_approval) {
                    q.status_approval = 'y'
                    await q.save()
                    Ws.io.emit('notif-info:approval-reimburs', { q })
                    return response.send({ status: true, data: {}, msg: 'success' })
                }
                return response.send({ status: false, data: { msg: 'approval not valid!' }, msg: 'error' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
