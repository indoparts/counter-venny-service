import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Absensi extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number
  @column()
  public jam_masuk: Date
  @column()
  public jam_pulang: Date
  @column()
  public latitude_masuk: string
  @column()
  public longitude_masuk: string
  @column()
  public status_masuk: string
  @column()
  public waktu_telat_masuk: string
  @column()
  public foto_selfi_masuk: string
  @column()
  public latitude_pulang: string
  @column()
  public longitude_pulang: string
  @column()
  public foto_selfi_pulang: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
