import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class JadwalGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public master_group_id: number
  @column()
  public time_config_id: number
  @column()
  public date: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
