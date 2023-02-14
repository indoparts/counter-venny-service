import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserToko extends BaseModel {
  @column()
  public master_toko_id: number
  @column()
  public user_id: number
}
