import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FormLembur extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public date: Date
  @column.dateTime()
  public waktu_mulai: DateTime
  @column.dateTime()
  public waktu_berakhir: DateTime
  @column()
  public uraian_tugas: string
  @column()
  public user_id_approval: number
  @column()
  public status_approval: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
