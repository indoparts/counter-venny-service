import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Messages from './Mesages'

export default class ReimbursValidator extends Messages {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    user_id: schema.number(),
    date: schema.date({ format: 'sql' }),
    category: schema.enum(['rawat-jalan', 'rawat-inap', 'cek-up', 'operasional']),
    file_receipt: schema.file({
      size: '10mb',
      extnames: ['jpg', 'gif', 'png'],
    }),
    user_id_approval: schema.number(),
    status_approval: schema.enum(['y', 'n']),
  })
}
