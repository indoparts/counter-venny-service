import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database';
import Dept from 'App/Models/Dept';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import { RegisterValidator, LoginValidator } from 'App/Validators/AuthValidator';
import Drive from '@ioc:Adonis/Core/Drive'
import { AvatarValidator, PasswordValidator, UserValidatorUpdate } from 'App/Validators/UserValidator'

export default class AuthController {
    /*
    |--------------------------------------------------------------------------
    | REGISTER::FUNCTION
    |--------------------------------------------------------------------------
    */
    public async register({ request, auth, response }: HttpContextContract) {
        try {
            const payload = await request.validate(RegisterValidator)
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
            const token = await auth.use("api").login(user, {
                expiresIn: "1 days",
            });
            return response.send({ status: true, data: token, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    /*
    |--------------------------------------------------------------------------
    | LOGIN::FUNCTION
    |--------------------------------------------------------------------------
    */
    public async login({ request, auth, response }: HttpContextContract) {
        try {
            const payload = await request.validate(LoginValidator)
            const token = await auth.use("api").attempt(payload.email, payload.password, {
                expiresIn: "1 days",
            });
            return response.send({ status: true, data: token, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    /*
    |--------------------------------------------------------------------------
    | PROFILE::FUNCTION
    |--------------------------------------------------------------------------
    */
    public async profile({ auth, response }: HttpContextContract) {
        try {
            const fetch = await User.findOrFail(auth.user?.id)
            if (await fetch.save()) {
                const permission: string[] = [];
                const call = Database
                    .from('role_has_permissions AS rhp')
                    .join('permissions AS p', 'p.id', '=', 'rhp.permission_id')
                    .join('roles AS r', 'rhp.role_id', '=', 'r.id')
                    .join('users AS u', 'u.role_id', '=', 'r.id')
                    .where('u.id', fetch.id)
                    .select('p.name AS permissionsname');
                (await call).forEach(el => {
                    permission.push(el.permissionsname)
                });
                const rolename = await Role.find(fetch.role_id)
                const deptname = await Dept.find(fetch.dept_id)
                const q = {
                    "id": fetch.id,
                    'role_id': fetch.role_id,
                    'dept_id': fetch.dept_id,
                    'name': fetch.name,
                    'email': fetch.email,
                    'nik': fetch.nik,
                    'activation': fetch.activation,
                    'avatar': fetch.avatar,
                    'work_location': fetch.work_location,
                    'saldo_cuti': fetch.saldo_cuti,
                    'hp': fetch.hp,
                    'status': fetch.status,
                    'tgl_join': fetch.tgl_join,
                    'limit_kasbon': fetch.limit_kasbon,
                    "role_name": rolename?.rolename,
                    "dept_name": deptname?.deptname,
                    "work_location_detail": {},
                }
                if (fetch.work_location === 'toko') {
                    const x = await Database.rawQuery(`SELECT mt.* FROM users u JOIN user_tokos ut ON u.id = ut.user_id JOIN master_tokos mt ON ut.master_toko_id = mt.id WHERE u.id = ${auth.user?.id};`)
                    q["work_location_detail"] = x[0][0]
                }
                if (fetch.work_location === 'office') {
                    const x = await Database.rawQuery(`SELECT mo.* FROM users u JOIN user_offices uo ON u.id = uo.user_id JOIN master_offices mo ON uo.master_office_id = mo.id WHERE u.id = ${auth.user?.id};`)
                    q["work_location_detail"] = x[0][0]
                }
                if (fetch.work_location === 'gudang') {
                    const x = await Database.rawQuery(`SELECT mg.* FROM users u JOIN user_gudangs ug ON u.id = ug.user_id JOIN master_gudangs mg ON ug.master_gudang_id = mg.id WHERE u.id = ${auth.user?.id};`)
                    q["work_location_detail"] = x[0][0]
                }
                return response.send({ status: true, data: { user: q, permission }, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    /*
    |--------------------------------------------------------------------------
    | PROFILE UPDATE::FUNCTION
    |--------------------------------------------------------------------------
    */
    public async profileUpdate({ response, request, auth }: HttpContextContract) {
        try {
            const user = await User.findOrFail(auth.user?.id)
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
            return response.send({ status: true, data: payload, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
    /*
    |--------------------------------------------------------------------------
    | LOGOUT::FUNCTION
    |--------------------------------------------------------------------------
    */
    public async logout({ auth, response }: HttpContextContract) {
        try {
            if (await auth.check()) {
                const updateUser = await User.findOrFail(auth.user?.id)
                if (await updateUser.save()) {
                    auth.use("api").logout()
                }
            }
            const msg = (await auth.check()) ? 'Success logout' : 'Invalid Credential'
            return response.send({ status: true, data: msg, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
