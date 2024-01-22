import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Resign from 'App/Models/Resign'

export default class ResignsController {
  public async index({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("read-resign")
      if (await bouncer.allows('read-resign')) {
        const { sortBy, search, sortDesc, page, limit } = request.all()
        const fetch = await Resign.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
          {
            column: sortBy !== '' ? sortBy : 'created_at',
            order: sortDesc ? 'desc' : 'asc',
          }
        ])
          .preload('user')
          .paginate(page, limit)
        return response.send({ status: true, data: fetch, msg: 'success' })
      }
    } catch (error) {
      console.log(error);
      
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async store({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("create-resign")
      if (await bouncer.allows('create-resign')) {
        const postSchema = schema.create({
          user_id: schema.number(),
          alasan: schema.string(),
          masukan: schema.string(),
          status_persetujuan: schema.string(),
        })
        const payload = await request.validate({ schema: postSchema })
        const q = new Resign()
        q.merge(payload)
        await q.save()
        return response.send({ status: true, data: payload, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async show({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("read-resign")
      if (await bouncer.allows('read-resign')) {
        const q = await Resign.query().where('id', request.param('id')).preload('user');
        return response.send({ status: true, data: q, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async update({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("update-resign")
      if (await bouncer.allows('update-resign')) {
        const postSchema = schema.create({
          user_id: schema.number(),
          alasan: schema.string(),
          masukan: schema.string(),
          status_persetujuan: schema.string(),
        })
        const payload = await request.validate({ schema: postSchema })
        const q = await Resign.findOrFail(request.param('id'))
        q.merge(payload)
        await q.save()
        return response.send({ status: true, data: q, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async destroy({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("delete-resign")
      if (await bouncer.allows('delete-resign')) {
        const q = await Resign.findOrFail(request.param('id'))
        await q.delete()
        return response.send({ status: true, data: {}, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }
}
