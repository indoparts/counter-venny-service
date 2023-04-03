import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VariableGaji from 'App/Models/VariableGaji'

export default class VariableGajiSeeder extends BaseSeeder {
  public async run () {
    await VariableGaji.createMany([
      {
        variable_name: 'Total Gaji',
        bobot:100
      },
      {
        variable_name: 'Jumlah hari perbulan',
        bobot:100
      },
      {
        variable_name: 'Total absensi perbulan',
        bobot:100
      },
    ])
  }
}
