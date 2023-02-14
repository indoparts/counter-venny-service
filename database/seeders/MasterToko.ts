import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MasterToko from 'App/Models/MasterToko'

export default class DeptSeeder extends BaseSeeder {
  public async run() {
    await MasterToko.createMany([
      {
        nama: 'Toko A',
        alamat: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        telepon: '081223456754',
      },
    ])
  }
}
