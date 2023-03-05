import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormIzin from 'App/Models/FormIzin'
import IzinValidator, { FileValidator } from 'App/Validators/IzinValidator'
import { UnlinkFile, UploadFile, uniqueString } from 'App/helper'


export default class IzinsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-izin")
            if (await bouncer.allows('read-izin')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await FormIzin.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
                    {
                        column: sortBy,
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ]).paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
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
                    q.status_approval = 'y'
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
