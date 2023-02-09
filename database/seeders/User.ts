import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        role_id: 1,
        dept_id: 1,
        name: 'Superadmin',
        email: 'Superadmin@test.test',
        nik: '001',
        password: '123456',
        avatar: 'testing.png',
        work_location: 'office',
        saldo_cuti: 0,
        activation: 'true'
      },
    ])
  }
}
