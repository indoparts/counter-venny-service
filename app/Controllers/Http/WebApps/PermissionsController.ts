import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Permission from "App/Models/Permission"
import PermissionValidator from "App/Validators/PermissionValidator"

export default class PermissionsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-permission")
            if (await bouncer.allows('read-permission')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await Permission.query().where('name', 'LIKE', '%'+search+'%').orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'id',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ]).paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);
            
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            /*
            |--------------------------------------------------------------------------
            | EXAMPLE REQUEST FORM
            |--------------------------------------------------------------------------
            {
                "name": "Cuti",
                "permission": ["create","read","update","delete","export","import"]
            }
            |
            */
            await bouncer.authorize("create-permission")
            if (await bouncer.allows('create-permission')) {
                if (request.input('permission')) {
                    await request.validate(PermissionValidator)
                    const arrname = [] as any;
                    const fetch = request.input('permission')
                    for (let i = 0; i < fetch.length; i++) {
                        const txt = fetch[i] + '-' + request.input('name')
                        arrname.push({
                            name: txt.toLowerCase(),
                            basepermission: request.input('name').toLowerCase()
                        })
                    }
                    await Permission.createMany(arrname)
                    return response.send({ status: true, data: request.all(), msg: 'success' })
                }
                return response.status(422).send('permission is required')
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-permission")
            if (await bouncer.allows('read-permission')) {
                const fetch = await Permission.find(request.param('id'))
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            /*
            |--------------------------------------------------------------------------
            | EXAMPLE REQUEST FORM
            |--------------------------------------------------------------------------
            {
                "name": "Cuti",
                "permission": ["create","read","update","delete","export","import"]
            }
            |
            */
            await bouncer.authorize("update-permission")
            if (await bouncer.allows('update-permission')) {
                const q = await Permission.find(request.param('id'))
                if (q) {
                    const validate = await request.validate(PermissionValidator)
                    q.name = request.input('permission')+'-'+validate['name']
                    q.basepermission = validate['name']
                    await q.save()
                    return response.send({ status: true, data: validate, msg: 'success' })
                }
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-permission")
            if (await bouncer.allows('delete-permission')) {
                const q = await Permission.find(request.param('id'))
                if (q) {
                    await q.delete()
                }
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
