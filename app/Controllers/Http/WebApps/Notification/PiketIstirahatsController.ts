import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import UserPiket from 'App/Models/UserPiket';
import { UnlinkFile, UploadFile, uniqueString } from 'App/helper';

export default class PiketIstirahatsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const q = await Database.rawQuery(`SELECT * FROM (SELECT id, 'user_pikets' AS initial, status as state, user_id, time, date, created_at FROM user_pikets UNION ALL SELECT id, 'jadwal_istirahats' AS initial, 'null' as state, user_id, time, date, created_at FROM jadwal_istirahats) xx WHERE user_id = ${auth.user?.id} ORDER BY created_at ASC`)
      const r = await Database.rawQuery(`SELECT COUNT(user_id) as total FROM (SELECT id, 'user_pikets' AS initial, status as state, user_id, time, date, created_at FROM user_pikets UNION ALL SELECT id, 'jadwal_istirahats' AS initial, 'null' as state, user_id, time, date, created_at FROM jadwal_istirahats) xx WHERE user_id = ${auth.user?.id} AND state = 'n' ORDER BY created_at ASC;`)
      return response.send({ status: true, data: { data: q[0], count: r[0][0].total }, msg: 'success' })
    } catch (error) {
      console.log(error);

      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async update({ request, response }: HttpContextContract) {
    try {
      const filebefore = request.file('filebefore', {
        size: '10mb',
        extnames: ['jpg', 'png'],
      })
      const fileafter = request.file('fileafter', {
        size: '10mb',
        extnames: ['jpg', 'png'],
      })

      if (filebefore) {
        // console.log(filebefore.extname);
        const u = await UserPiket.findByOrFail('id', request.param('id'))
        let unique = uniqueString(5)
        if (u.img_before !== '' || u.img_before !== null) {
          UnlinkFile(u.img_before, 'uploads/image-piket')
        }
        UploadFile(filebefore, unique, 'uploads/image-piket')
        u.img_before = `${unique}.${filebefore.extname}`
        await u.save()
      }
      if (fileafter) {
        const u = await UserPiket.findByOrFail('id', request.param('id'))
        let unique = uniqueString(5)
        if (u.img_after !== '' || u.img_after !== null) {
          UnlinkFile(u.img_after, 'uploads/image-piket')
        }
        UploadFile(fileafter, unique, 'uploads/image-piket')
        u.img_after = `${unique}.${fileafter.extname}`
        u.status = 'y'
        await u.save()
      }
      return response.send({ status: true, data: request.input('id'), msg: 'success' })
    } catch (error) {
      console.log(error);
    }
  }

  public async destroy({ }: HttpContextContract) { }
}
