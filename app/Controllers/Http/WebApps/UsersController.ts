import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { UserValidatorStore, UserValidatorUpdate, AvatarValidator, PasswordValidator } from 'App/Validators/UserValidator'
import Drive from '@ioc:Adonis/Core/Drive'
export default class UsersController {

    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-user")
            if (await bouncer.allows('read-user')) {
                const input = request.all()
                if (input['between'] !== '') {
                    const data = await User.query()
                        .where(input['sortBy'] !== '' ? input['sortBy'] : input['sortBy'], 'LIKE', '%' + input['search'] + '%')
                        .whereBetween('created_at', input['between'].split(","))
                        .orderBy([
                            {
                                column: input['sortBy'] !== '' ? input['sortBy'] : 'nik',
                                order: input['sortDesc'] ? 'desc' : 'asc',
                            }
                        ])
                        .preload('roles').preload('dept').paginate(input['page'], input['limit'])
                    return response.ok(data)
                } else {
                    const data = await User.query()
                        .where(input['sortBy'] !== '' ? input['sortBy'] : 'nik', 'LIKE', '%' + input['search'] + '%')
                        .orderBy([
                            {
                                column: input['sortBy'] !== '' ? input['sortBy'] : 'nik',
                                order: input['sortDesc'] ? 'desc' : 'asc',
                            }
                        ])
                        .preload('roles').preload('dept').paginate(input['page'], input['limit'])
                    return response.ok(data)
                }
            }
        } catch (error) {
            return response.status(error.status).send(error.messages)
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-user")
            if (await bouncer.allows('create-user')) {
                const payload = await request.validate(UserValidatorStore)
                await payload.avatar.move(Application.tmpPath('uploads/avatar-users'), {
                    name: `${payload.nik}.jpg`,
                    overwrite: true,
                })
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
                await user.save()
                return response.status(200).send('success')
            }
        } catch (error) {
            // return response.send(error)
            return response.status(error.status).send(error.messages)
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
                return response.ok({ user: user })

            }
        } catch (error) {
            return response.status(error.status).send(error.messages)
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            if (await bouncer.allows('update-user')) {
                const user = await User.findOrFail(request.param('id'))
                const payload = await request.validate(UserValidatorUpdate)
                if (request.file('avatar') != null) {
                    const payimg = await request.validate(AvatarValidator)
                    const filePath = Application.tmpPath(`uploads/avatar-users/${user.avatar}`)
                    await Drive.delete(filePath)
                    await payimg.avatar.move(Application.tmpPath('uploads/avatar-users'), {
                        name: `${payload.nik}.jpg`,
                        overwrite: true,
                    })
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
                await user.save()
                return response.status(200).send("success")
            }
        } catch (error) {
            return response.status(error.status).send(error.messages)
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-user")
            if (await bouncer.allows('delete-user')) {
                const user = await User.findOrFail(request.param('id'))
                const filePath = Application.tmpPath(`uploads/avatar-users/${user.avatar}`)
                await Drive.delete(filePath)
                await user.delete()
                return response.status(200).send('success')
            }
        } catch (error) {
            return response.status(error.status).send(error.messages)
        }
    }
}
