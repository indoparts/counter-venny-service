import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FormIzin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id:number
  @column()
  public permit_req:string
  @column()
  public req_type:string
  @column()
  public date:Date
  @column()
  public todate:Date
  @column()
  public leave_duration:number
  @column()
  public notes:string
  @column()
  public file:string
  @column()
  public user_id_approval:number
  @column()
  public status_approval:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
