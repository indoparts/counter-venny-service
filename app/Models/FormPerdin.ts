import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FormPerdin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id:number
  @column()
  public tempat_tujuan:string
  @column()
  public tgl_brangkat:Date
  @column()
  public tgl_kembali:Date
  @column()
  public tujuan_perdin:string
  @column()
  public user_id_approval:number
  @column()
  public status_approval:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
