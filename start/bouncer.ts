/**
 * Contract source: https://git.io/Jte3T
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';

/*
|--------------------------------------------------------------------------
| Bouncer Actions
|--------------------------------------------------------------------------
|
| Actions allows you to separate your application business logic from the
| authorization logic. Feel free to make use of policies when you find
| yourself creating too many actions
|
| You can define an action using the `.define` method on the Bouncer object
| as shown in the following example
|
| ```
| 	Bouncer.define('deletePost', (user: User, post: Post) => {
|			return post.user_id === user.id
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "actions" const from this file
|****************************************************************
*/
async function permissionGuard(params: number, name: string) {

    const arr: number[] = [];
    const call = Database
        .from('permissions')
        .join('role_has_permissions', 'permissions.id', '=', 'role_has_permissions.permission_id')
        .join('roles', 'role_has_permissions.role_id', '=', 'roles.id')
        .where('permissions.name', name)
        .select('role_has_permissions.role_id');
    (await call).forEach(el => {
        arr.push(el.role_id)
    });
    return arr.includes(params)
}
export const { actions } = Bouncer
    // USER AUTHORIZATION
    .define('create-user', (user: User) => {
        return permissionGuard(user.role_id, 'create-user')
    })
    .define('read-user', (user: User) => {
        return permissionGuard(user.role_id, 'read-user')
    })
    .define('update-user', (user: User) => {
        return permissionGuard(user.role_id, 'update-user')
    })
    .define('delete-user', (user: User) => {
        return permissionGuard(user.role_id, 'delete-user')
    })
    // ROLES AUTHORIZATION
    .define('create-role', (user: User) => {
        return permissionGuard(user.role_id, 'create-role')
    })
    .define('read-role', (user: User) => {
        return permissionGuard(user.role_id, 'read-role')
    })
    .define('update-role', (user: User) => {
        return permissionGuard(user.role_id, 'update-role')
    })
    .define('delete-role', (user: User) => {
        return permissionGuard(user.role_id, 'delete-role')
    })
    // PERMISSION AUTHORIZATION
    .define('create-permission', (user: User) => {
        return permissionGuard(user.role_id, 'create-permission')
    })
    .define('read-permission', (user: User) => {
        return permissionGuard(user.role_id, 'read-permission')
    })
    .define('update-permission', (user: User) => {
        return permissionGuard(user.role_id, 'update-permission')
    })
    .define('delete-permission', (user: User) => {
        return permissionGuard(user.role_id, 'delete-permission')
    })
    // DEPT AUTHORIZATION
    .define('create-dept', (user: User) => {
        return permissionGuard(user.role_id, 'create-dept')
    })
    .define('read-dept', (user: User) => {
        return permissionGuard(user.role_id, 'read-dept')
    })
    .define('update-dept', (user: User) => {
        return permissionGuard(user.role_id, 'update-dept')
    })
    .define('delete-dept', (user: User) => {
        return permissionGuard(user.role_id, 'delete-dept')
    })
    // MASTER TOKO AUTHORIZATION
    .define('create-mastertoko', (user: User) => {
        return permissionGuard(user.role_id, 'create-mastertoko')
    })
    .define('read-mastertoko', (user: User) => {
        return permissionGuard(user.role_id, 'read-mastertoko')
    })
    .define('update-mastertoko', (user: User) => {
        return permissionGuard(user.role_id, 'update-mastertoko')
    })
    .define('delete-mastertoko', (user: User) => {
        return permissionGuard(user.role_id, 'delete-mastertoko')
    })
    // MASTER OFFICE AUTHORIZATION
    .define('create-masteroffice', (user: User) => {
        return permissionGuard(user.role_id, 'create-masteroffice')
    })
    .define('read-masteroffice', (user: User) => {
        return permissionGuard(user.role_id, 'read-masteroffice')
    })
    .define('update-masteroffice', (user: User) => {
        return permissionGuard(user.role_id, 'update-masteroffice')
    })
    .define('delete-masteroffice', (user: User) => {
        return permissionGuard(user.role_id, 'delete-masteroffice')
    })
    // MASTER GUDANG AUTHORIZATION
    .define('create-mastergudang', (user: User) => {
        return permissionGuard(user.role_id, 'create-mastergudang')
    })
    .define('read-mastergudang', (user: User) => {
        return permissionGuard(user.role_id, 'read-mastergudang')
    })
    .define('update-mastergudang', (user: User) => {
        return permissionGuard(user.role_id, 'update-mastergudang')
    })
    .define('delete-mastergudang', (user: User) => {
        return permissionGuard(user.role_id, 'delete-mastergudang')
    })
    // MASTER PELANGGAN AUTHORIZATION
    .define('create-masterpelanggan', (user: User) => {
        return permissionGuard(user.role_id, 'create-masterpelanggan')
    })
    .define('read-masterpelanggan', (user: User) => {
        return permissionGuard(user.role_id, 'read-masterpelanggan')
    })
    .define('update-masterpelanggan', (user: User) => {
        return permissionGuard(user.role_id, 'update-masterpelanggan')
    })
    .define('delete-masterpelanggan', (user: User) => {
        return permissionGuard(user.role_id, 'delete-masterpelanggan')
    })
    // ABSENSI AUTHORIZATION
    .define('create-absensi', (user: User) => {
        return permissionGuard(user.role_id, 'create-absensi')
    })
    .define('read-absensi', (user: User) => {
        return permissionGuard(user.role_id, 'read-absensi')
    })
    .define('update-absensi', (user: User) => {
        return permissionGuard(user.role_id, 'update-absensi')
    })
    .define('delete-absensi', (user: User) => {
        return permissionGuard(user.role_id, 'delete-absensi')
    })
    .define('report-absensi', (user: User) => {
        return permissionGuard(user.role_id, 'report-absensi')
    })
    // CUTI AUTHORIZATION
    .define('create-cuti', (user: User) => {
        return permissionGuard(user.role_id, 'create-cuti')
    })
    .define('read-cuti', (user: User) => {
        return permissionGuard(user.role_id, 'read-cuti')
    })
    .define('update-cuti', (user: User) => {
        return permissionGuard(user.role_id, 'update-cuti')
    })
    .define('delete-cuti', (user: User) => {
        return permissionGuard(user.role_id, 'delete-cuti')
    })
    .define('report-cuti', (user: User) => {
        return permissionGuard(user.role_id, 'report-cuti')
    })
    // IZIN AUTHORIZATION
    .define('create-izin', (user: User) => {
        return permissionGuard(user.role_id, 'create-izin')
    })
    .define('read-izin', (user: User) => {
        return permissionGuard(user.role_id, 'read-izin')
    })
    .define('update-izin', (user: User) => {
        return permissionGuard(user.role_id, 'update-izin')
    })
    .define('delete-izin', (user: User) => {
        return permissionGuard(user.role_id, 'delete-izin')
    })
    .define('report-izin', (user: User) => {
        return permissionGuard(user.role_id, 'report-izin')
    })
    // LEMBUR AUTHORIZATION
    .define('create-lembur', (user: User) => {
        return permissionGuard(user.role_id, 'create-lembur')
    })
    .define('read-lembur', (user: User) => {
        return permissionGuard(user.role_id, 'read-lembur')
    })
    .define('update-lembur', (user: User) => {
        return permissionGuard(user.role_id, 'update-lembur')
    })
    .define('delete-lembur', (user: User) => {
        return permissionGuard(user.role_id, 'delete-lembur')
    })
    .define('report-lembur', (user: User) => {
        return permissionGuard(user.role_id, 'report-lembur')
    })
    // PERDIN AUTHORIZATION
    .define('create-perdin', (user: User) => {
        return permissionGuard(user.role_id, 'create-perdin')
    })
    .define('read-perdin', (user: User) => {
        return permissionGuard(user.role_id, 'read-perdin')
    })
    .define('update-perdin', (user: User) => {
        return permissionGuard(user.role_id, 'update-perdin')
    })
    .define('delete-perdin', (user: User) => {
        return permissionGuard(user.role_id, 'delete-perdin')
    })
    .define('report-perdin', (user: User) => {
        return permissionGuard(user.role_id, 'report-perdin')
    })
    // PERDIN AUTHORIZATION
    .define('create-reimburs', (user: User) => {
        return permissionGuard(user.role_id, 'create-reimburs')
    })
    .define('read-reimburs', (user: User) => {
        return permissionGuard(user.role_id, 'read-reimburs')
    })
    .define('update-reimburs', (user: User) => {
        return permissionGuard(user.role_id, 'update-reimburs')
    })
    .define('delete-reimburs', (user: User) => {
        return permissionGuard(user.role_id, 'delete-reimburs')
    })
    .define('report-reimburs', (user: User) => {
        return permissionGuard(user.role_id, 'report-reimburs')
    })
    // JADWAL GROUP AUTHORIZATION
    .define('create-jadwalgroup', (user: User) => {
        return permissionGuard(user.role_id, 'create-jadwalgroup')
    })
    .define('read-jadwalgroup', (user: User) => {
        return permissionGuard(user.role_id, 'read-jadwalgroup')
    })
    .define('update-jadwalgroup', (user: User) => {
        return permissionGuard(user.role_id, 'update-jadwalgroup')
    })
    .define('delete-jadwalgroup', (user: User) => {
        return permissionGuard(user.role_id, 'delete-jadwalgroup')
    })
    .define('report-jadwalgroup', (user: User) => {
        return permissionGuard(user.role_id, 'report-jadwalgroup')
    })
    // MASTER GROUP AUTHORIZATION
    .define('create-mastergroup', (user: User) => {
        return permissionGuard(user.role_id, 'create-mastergroup')
    })
    .define('read-mastergroup', (user: User) => {
        return permissionGuard(user.role_id, 'read-mastergroup')
    })
    .define('update-mastergroup', (user: User) => {
        return permissionGuard(user.role_id, 'update-mastergroup')
    })
    .define('delete-mastergroup', (user: User) => {
        return permissionGuard(user.role_id, 'delete-mastergroup')
    })
    .define('report-mastergroup', (user: User) => {
        return permissionGuard(user.role_id, 'report-mastergroup')
    })
    // MASTER GROUP AUTHORIZATION
    .define('create-usergroup', (user: User) => {
        return permissionGuard(user.role_id, 'create-usergroup')
    })
    .define('read-usergroup', (user: User) => {
        return permissionGuard(user.role_id, 'read-usergroup')
    })
    .define('update-usergroup', (user: User) => {
        return permissionGuard(user.role_id, 'update-usergroup')
    })
    .define('delete-usergroup', (user: User) => {
        return permissionGuard(user.role_id, 'delete-usergroup')
    })
    .define('report-usergroup', (user: User) => {
        return permissionGuard(user.role_id, 'report-usergroup')
    })
    // TIME CONFIG AUTHORIZATION
    .define('create-timeconfig', (user: User) => {
        return permissionGuard(user.role_id, 'create-timeconfig')
    })
    .define('read-timeconfig', (user: User) => {
        return permissionGuard(user.role_id, 'read-timeconfig')
    })
    .define('update-timeconfig', (user: User) => {
        return permissionGuard(user.role_id, 'update-timeconfig')
    })
    .define('delete-timeconfig', (user: User) => {
        return permissionGuard(user.role_id, 'delete-timeconfig')
    })
    .define('report-timeconfig', (user: User) => {
        return permissionGuard(user.role_id, 'report-timeconfig')
    })
    // JADWAL ISTIRAHAT AUTHORIZATION
    .define('create-jadwalistirahat', (user: User) => {
        return permissionGuard(user.role_id, 'create-jadwalistirahat')
    })
    .define('read-jadwalistirahat', (user: User) => {
        return permissionGuard(user.role_id, 'read-jadwalistirahat')
    })
    .define('update-jadwalistirahat', (user: User) => {
        return permissionGuard(user.role_id, 'update-jadwalistirahat')
    })
    .define('delete-jadwalistirahat', (user: User) => {
        return permissionGuard(user.role_id, 'delete-jadwalistirahat')
    })
    .define('report-jadwalistirahat', (user: User) => {
        return permissionGuard(user.role_id, 'report-jadwalistirahat')
    })
    // JADWAL PIKET AUTHORIZATION
    .define('create-jadwalpiket', (user: User) => {
        return permissionGuard(user.role_id, 'create-jadwalpiket')
    })
    .define('read-jadwalpiket', (user: User) => {
        return permissionGuard(user.role_id, 'read-jadwalpiket')
    })
    .define('update-jadwalpiket', (user: User) => {
        return permissionGuard(user.role_id, 'update-jadwalpiket')
    })
    .define('delete-jadwalpiket', (user: User) => {
        return permissionGuard(user.role_id, 'delete-jadwalpiket')
    })
    .define('report-jadwalpiket', (user: User) => {
        return permissionGuard(user.role_id, 'report-jadwalpiket')
    })
    // JADWAL GAJI AUTHORIZATION
    .define('create-gaji', (user: User) => {
        return permissionGuard(user.role_id, 'create-gaji')
    })
    .define('read-gaji', (user: User) => {
        return permissionGuard(user.role_id, 'read-gaji')
    })
    .define('update-gaji', (user: User) => {
        return permissionGuard(user.role_id, 'update-gaji')
    })
    .define('delete-gaji', (user: User) => {
        return permissionGuard(user.role_id, 'delete-gaji')
    })
    .define('report-gaji', (user: User) => {
        return permissionGuard(user.role_id, 'report-gaji')
    })
    // JADWAL KASBON AUTHORIZATION
    .define('create-kasbon', (user: User) => {
        return permissionGuard(user.role_id, 'create-kasbon')
    })
    .define('read-kasbon', (user: User) => {
        return permissionGuard(user.role_id, 'read-kasbon')
    })
    .define('update-kasbon', (user: User) => {
        return permissionGuard(user.role_id, 'update-kasbon')
    })
    .define('delete-kasbon', (user: User) => {
        return permissionGuard(user.role_id, 'delete-kasbon')
    })
    .define('report-kasbon', (user: User) => {
        return permissionGuard(user.role_id, 'report-kasbon')
    })
/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({})
