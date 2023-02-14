import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { UserValidatorStore, UserValidatorUpdate, AvatarValidator, PasswordValidator } from 'App/Validators/UserValidator'
import { UnlinkFile, UploadFile } from 'App/helper'
export default class UsersController {

    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-user")
            if (await bouncer.allows('read-user')) {
                const { sortBy,search,sortDesc,page,limit} = request.all()
                const fetch = await User.query()
                    .where(sortBy !== '' ? sortBy : sortBy, 'LIKE', '%' + search + '%')
                    .orderBy([
                        {
                            column: sortBy !== '' ? sortBy : 'nik',
                            order: sortDesc ? 'desc' : 'asc',
                        }
                    ])
                    .preload('roles').preload('dept').paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-user")
            if (await bouncer.allows('create-user')) {
                const payload = await request.validate(UserValidatorStore)
                UploadFile(payload.avatar, payload.nik, 'uploads/avatar-users')
                const user = new User()
                user.role_id = payload.role_id
                user.dept_id = payload.dept_id
                user.name = payload.name
                user.email = payload.email != null ? payload.email : ''
                user.nik = payload.nik
                user.password = payload.password
                user.activation = payload.activation
                user.avatar = payload.avatar.fileName as string
                user.work_location = payload.work_location
                user.saldo_cuti = payload.saldo_cuti
                user.hp = payload.hp
                user.status = payload.status
                user.tgl_join = new Date()
                user.limit_kasbon = payload.limit_kasbon
                await user.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-user")
            if (await bouncer.allows('read-user')) {
                const user = await User
                    .query()
                    .where('id', request.param('id'))
                    .preload('roles')
                    .preload('dept')
                return response.send({ status: true, data: user, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            if (await bouncer.allows('update-user')) {
                const user = await User.findOrFail(request.param('id'))
                const payload = await request.validate(UserValidatorUpdate)
                if (request.file('avatar') != null) {
                    const payimg = await request.validate(AvatarValidator)
                    UnlinkFile(user.avatar, 'uploads/avatar-users')
                    UploadFile(payimg.avatar, payload.nik, 'uploads/avatar-users')
                    user.avatar = payimg.avatar.fileName as string
                }
                if (request.input('password') != null) {
                    const paypass = await request.validate(PasswordValidator)
                    user.password = paypass.password
                }
                user.role_id = payload.role_id
                user.dept_id = payload.dept_id
                user.name = payload.name
                user.email = payload.email != null ? payload.email : ''
                user.nik = payload.nik
                user.activation = payload.activation
                user.work_location = payload.work_location
                user.saldo_cuti = payload.saldo_cuti
                user.hp = payload.hp
                user.status = payload.status
                user.tgl_join = new Date()
                user.limit_kasbon = payload.limit_kasbon
                await user.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-user")
            if (await bouncer.allows('delete-user')) {
                const user = await User.findOrFail(request.param('id'))
                UnlinkFile(user.avatar, 'uploads/avatar-users')
                await user.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
