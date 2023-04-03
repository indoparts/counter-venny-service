import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class InfoController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const q = await Database.rawQuery(`SELECT * FROM (SELECT id, 'form_cutis' AS initial, status_approval as approval, user_id_approval, user_id, date, todate, created_at FROM form_cutis UNION ALL SELECT id, 'form_izins' AS initial, status_approval as approval, user_id_approval, user_id, date, todate, created_at FROM form_izins) xx WHERE user_id = ${auth.user?.id} ORDER BY created_at ASC`)
      const r = await Database.rawQuery(`SELECT COUNT(user_id) as total FROM (SELECT id, 'form_cutis' AS initial, status_approval as approval, user_id, date, todate, created_at FROM form_cutis UNION ALL SELECT id, 'form_izins' AS initial, status_approval as approval, user_id, date, todate, created_at FROM form_izins) xx WHERE user_id = ${auth.user?.id} and approval = 'n' ORDER BY created_at ASC`)
      return response.send({ status: true, data: { data: q[0], count: r[0][0].total }, msg: 'success' })
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
