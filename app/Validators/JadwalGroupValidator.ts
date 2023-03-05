import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Messages from './Mesages'

export default class JadwalGroupValidator extends Messages {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    master_group_id: schema.number(),
    time_config_id: schema.number(),
    date: schema.date({ format: 'sql' }),
  })
}
