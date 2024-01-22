import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Dept from 'App/Models/Dept'
import MasterGudang from 'App/Models/MasterGudang'
import MasterOffice from 'App/Models/MasterOffice'
import MasterToko from 'App/Models/MasterToko'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import UserGroup from 'App/Models/UserGroup'
import UserGudang from 'App/Models/UserGudang'
import UserOffice from 'App/Models/UserOffice'
import UserToko from 'App/Models/UserToko'
import { UserValidatorStore, UserValidatorUpdate, AvatarValidator, PasswordValidator } from 'App/Validators/UserValidator'
import { UnlinkFile, UploadFile } from 'App/helper'
export default class UsersController {

    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-user")
            if (await bouncer.allows('read-user')) {
                const { sortBy, search, sortDesc, page, limit } = request.all()
                const fetch = await User.query()
                    .where(sortBy !== '' ? sortBy : 'name', 'LIKE', '%' + search + '%')
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
            console.log(error);

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
                user.avatar = `${payload.nik}.${payload.avatar.extname}`
                user.work_location = payload.work_location
                user.saldo_cuti = payload.saldo_cuti
                user.hp = payload.hp
                user.status = payload.status
                user.tgl_join = request.input('tgl_join')
                user.limit_kasbon = payload.limit_kasbon
                user.total_gaji_perbulan = payload.total_gaji_perbulan
                if (await user.save()) {
                    switch (payload.work_location) {
                        case 'gudang':
                            await UserGudang.updateOrCreate({
                                user_id: request.param('id')
                            }, {
                                master_gudang_id: parseInt(request.input('work_location_master'))
                            })
                            break;
                        case 'office':
                            await UserOffice.updateOrCreate({
                                user_id: request.param('id')
                            }, {
                                master_office_id: parseInt(request.input('work_location_master'))
                            })
                            break;
                        case 'toko':
                            await UserToko.updateOrCreate({
                                user_id: request.param('id')
                            }, {
                                master_toko_id: parseInt(request.input('work_location_master'))
                            })
                            break;
                    }
                }
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

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

                if (user[0].work_location === 'office') {
                    const q = await Database
                        .from('users as u')
                        .join('user_offices as uo', 'u.id', '=', 'uo.user_id')
                        .select('uo.master_office_id')
                    user.push((typeof q[0] !== 'undefined') ? q[0].master_office_id : 0)
                } else if (user[0].work_location === 'gudang') {
                    const q = await Database
                        .from('users as u')
                        .join('user_gudangs as ug', 'u.id', '=', 'ug.user_id')
                        .select('ug.master_gudang_id')
                    user.push((typeof q[0] !== 'undefined') ? q[0].master_gudang_id : 0)
                } else if (user[0].work_location === 'toko') {
                    const q = await Database
                        .from('users as u')
                        .join('user_tokos as ut', 'u.id', '=', 'ut.user_id')
                        .select('ut.master_toko_id')
                    user.push((typeof q[0] !== 'undefined') ? q[0].master_toko_id : 0)
                }
                return response.send({ status: true, data: user, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

            // return response.send({ status: false, data: error.messages, msg: 'error' })
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
                    user.avatar = `${payload.nik}.${payimg.avatar.extname}`
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
                user.tgl_join = request.input('tgl_join')
                user.limit_kasbon = payload.limit_kasbon
                user.total_gaji_perbulan = payload.total_gaji_perbulan
                if (await user.save()) {
                    switch (payload.work_location) {
                        case 'gudang':
                            await UserGudang.updateOrCreate({
                                user_id: request.param('id')
                            }, {
                                master_gudang_id: parseInt(request.input('work_location_master'))
                            })
                            break;
                        case 'office':
                            await UserOffice.updateOrCreate({
                                user_id: request.param('id')
                            }, {
                                master_office_id: parseInt(request.input('work_location_master'))
                            })
                            break;
                        case 'toko':
                            await UserToko.updateOrCreate({
                                user_id: request.param('id')
                            }, {
                                master_toko_id: parseInt(request.input('work_location_master'))
                            })
                            break;
                    }
                }
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

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
    public async attr_form({ response }: HttpContextContract) {
        try {
            const roles = await Role.all()
            const depts = await Dept.all()
            const toko = await MasterToko.all()
            const office = await MasterOffice.all()
            const gudang = await MasterGudang.all()
            return response.send({
                status: true, data: { roles, depts, toko, office, gudang }, msg: 'success'
            })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    public async user_approval({ response, auth }: HttpContextContract) {
        try {
            const carigroup = await UserGroup.findByOrFail('user_id', auth.user?.id)
            const cariuSER = await UserGroup.query().where('master_group_id', carigroup.master_group_id).preload('user')
            
            return response.send({ status: true, data: cariuSER, auth: auth.user, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
