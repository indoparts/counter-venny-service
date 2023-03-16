import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormIzin from 'App/Models/FormIzin'
import IzinValidator, { FileValidator } from 'App/Validators/IzinValidator'
import { UnlinkFile, UploadFile, uniqueString } from 'App/helper'


export default class IzinsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const { sortBy, sortDesc, page, limit, search } = request.all()
                const fetch = await FormIzin.query().orderBy([
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
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async report({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const { sortBy, sortDesc, page, limit, search, daterange } = request.all()
                const fetch = await FormIzin.query().orderBy([
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
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const { daterange } = request.all()
                const fetch = await FormIzin.query().orderBy([
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
            await bouncer.authorize("create-izin")
            if (await bouncer.allows('create-izin')) {
                const payload = await request.validate(IzinValidator)
                const q = new FormIzin()
                if (request.file('file') != null) {
                    const payimg = await request.validate(FileValidator)
                    let unique = uniqueString(5)
                    UploadFile(payimg.file, `${payload.permit_req}-${unique}`, `uploads/${payload.permit_req}`)
                    q.file = `${payload.permit_req}-${unique}.${payimg.file.extname}`
                }
                q.merge(payload)
                await q.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const q = await FormIzin.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-izin")
            if (await bouncer.allows('update-izin')) {
                const payload = await request.validate(IzinValidator)
                const q = await FormIzin.findOrFail(request.param('id'))
                if (request.file('file') != null) {
                    const payimg = await request.validate(FileValidator)
                    UnlinkFile(q.file, `uploads/${q.permit_req}`)
                    let unique = uniqueString(5)
                    UploadFile(payimg.file, `${payload.permit_req}-${unique}`, `uploads/${payload.permit_req}`)
                    q.file = `${payload.permit_req}-${unique}.${payimg.file.extname}`
                }
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
            await bouncer.authorize("delete-izin")
            if (await bouncer.allows('delete-izin')) {
                const q = await FormIzin.findOrFail(request.param('id'))
                UnlinkFile(q.file, `uploads/${q.permit_req}`)
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async approval({ bouncer, request, response, auth }: HttpContextContract) {
        try {
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const q = await FormIzin.findOrFail(request.param('id'))
                if (auth.user?.id === q.user_id_approval) {
                    q.status_approval = request.input('status_approval')
                    await q.save()
                    return response.send({ status: true, data: {}, msg: 'success' })
                }
                return response.send({ status: false, data: { msg: 'approval not valid!' }, msg: 'error' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
