import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Dept from 'App/Models/Dept'

export default class DeptSeeder extends BaseSeeder {
  public async run () {
    await Dept.createMany([
      {
        deptname: 'FINANCE'
      },
      {
        deptname: 'TOKO A'
      },
      {
        deptname: 'TOKO B'
      },
      {
        deptname: 'TOKO C'
      },
      {
        deptname: 'PURCHASING'
      },
      {
        deptname: 'MARKETING'
      },
      {
        deptname: 'LOGISTIK'
      },
      {
        deptname: 'OWNER'
      },
    ])
  }
}
