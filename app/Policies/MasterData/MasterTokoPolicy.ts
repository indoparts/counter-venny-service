import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/MasterData/Users/User';
import { permissionGuard } from 'App/helper';

export default class MasterTokoPolicy extends BasePolicy {
	public async viewList(user: User) {
		return permissionGuard(user.role_id, 'mastertoko-viewList')
	}
	public async view(user: User) {
		return permissionGuard(user.role_id, 'mastertoko-view')
	}
	public async create(user: User) { 
		return permissionGuard(user.role_id, 'mastertoko-create')
	}
	public async update(user: User) {
		return permissionGuard(user.role_id, 'mastertoko-update')
	}
	public async delete(user: User) {
		return permissionGuard(user.role_id, 'mastertoko-delete')
	}
}
