import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Messages from './Mesages'

export default class MasterTokoValidator extends Messages{
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    nama: schema.string(),
    alamat: schema.string(),
    telepon: schema.string([
      rules.minLength(12),
      rules.maxLength(13),
    ]),
  })
}
