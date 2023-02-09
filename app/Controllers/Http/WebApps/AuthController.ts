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
            return response.send(token.toJSON())
        } catch (error) {
            console.log(error);
            
            return response.status(error.status).send(error.messages)
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
            return response.status(200).send(token.toJSON())
        } catch (error) {
            return response.status(error.status).send(error.messages)
        }
    }
    /*
    |--------------------------------------------------------------------------
    | PROFILE::FUNCTION
    |--------------------------------------------------------------------------
    */
    public async profile({ auth, response }: HttpContextContract) {
        try {
            const updateUser = await User.findOrFail(auth.user?.id)
            if (await updateUser.save()) {
                const arr: string[] = [];
                const call = Database
                    .from('role_has_permissions AS rhp')
                    .join('permissions AS p', 'p.id', '=', 'rhp.permission_id')
                    .join('roles AS r', 'rhp.role_id', '=', 'r.id')
                    .join('users AS u', 'u.role_id', '=', 'r.id')
                    .where('u.id', updateUser.id)
                    .select('p.name AS permissionsname');
                (await call).forEach(el => {
                    arr.push(el.permissionsname)
                });
                const rolename = await Role.find(updateUser.role_id)
                const deptname = await Dept.find(updateUser.dept_id)
                const q = {
                    "id": updateUser.id,
                    "role_id": updateUser.role_id,
                    "dept_id": updateUser.dept_id,
                    "role_name": rolename?.rolename,
                    "dept_name": deptname?.deptname,
                    "name": updateUser.name,
                    "nik": updateUser.nik,
                    "activation": updateUser.activation,
                    "avatar": updateUser.avatar,
                    "work_location": updateUser.work_location,
                    "saldo_cuti": updateUser.saldo_cuti,
                };
                return response.ok({ user: q, permission: arr });
            }
        } catch (error) {
            return response.status(error.status).send(error.messages)
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
            return response.status(200).send("success")
        } catch (error) {
            return response.status(error.status).send(error.messages)
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
            const status = (await auth.check()) ? 200 : 401
            return response.status(status).send(msg)
        } catch (error) {
            return response.status(error.status).send(error.messages)
        }
    }
}
