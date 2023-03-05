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
        email: 'superadmin@test.tes',
        nik: '001',
        password: '123456',
        avatar: 'testing.png',
        work_location: 'office',
        saldo_cuti: 0,
        activation: 'true',
        hp: '081212439564',
        status: 'tetap',
        tgl_join: new Date(),
        limit_kasbon: 2000000,
        total_gaji_perbulan: 2000000,
      },
    ])
  }
}
