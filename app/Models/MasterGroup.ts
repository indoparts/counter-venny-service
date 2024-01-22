import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import UserGroup from './UserGroup'

export default class MasterGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id_kepgroup: number
  @column()
  public nama: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => UserGroup, {
    localKey: 'id',
    pivotForeignKey: 'master_group_id',
    relatedKey: 'master_group_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'user_groups',
  })
  public permission: ManyToMany<typeof UserGroup>
}
