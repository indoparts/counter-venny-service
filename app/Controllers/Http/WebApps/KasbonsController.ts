import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Kasbon from 'App/Models/Kasbon'
import User from 'App/Models/MasterData/Users/User'
import KasbonValidator from 'App/Validators/KasbonValidator'

export default class KasbonsController {
  public async index({ bouncer, response, request }: HttpContextContract) {
    try {
      await bouncer.authorize("read-kasbon")
      if (await bouncer.allows('read-kasbon')) {
        const { sortBy, search, sortDesc, page, limit } = request.all()
        const fetch = await Kasbon.query().where('user_id', 'LIKE', '%' + search + '%').orderBy([
          {
            column: sortBy !== '' ? sortBy : 'created_at',
            order: sortDesc ? 'desc' : 'asc',
          }
        ])
        .preload('user')
        .preload('angsuran')
        .paginate(page, limit)
        return response.send({ status: true, data: fetch, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async report({ bouncer, response, request }: HttpContextContract) {
    try {
      await bouncer.authorize("read-gaji")
      if (await bouncer.allows('read-gaji')) {
        const { sortBy, sortDesc, page, limit, search, daterange } = request.all()
        const fetch = await Kasbon.query().orderBy([
          {
            column: sortBy === '' ? 'created_at' : sortBy,
            order: sortDesc ? 'desc' : 'asc',
          }
        ])
          .where('user_id', 'LIKE', '%' + search + '%')
          .whereBetween('created_at', daterange.split(","))
          .preload('user')
          .preload('angsuran')
          .paginate(page, limit)
        return response.send({ status: true, data: fetch, msg: 'success' })
      }
    } catch (error) {
      console.log(error);

      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async exportreport({ bouncer, response, request }: HttpContextContract) {
    try {
      await bouncer.authorize("read-gaji")
      if (await bouncer.allows('read-gaji')) {
        const { daterange } = request.all()
        const fetch = await Kasbon.query().orderBy([
          {
            column: 'created_at',
            order: 'asc',
          }
        ])
          .whereBetween('created_at', daterange.split(","))
          .preload('user')
          .preload('angsuran')
        return response.send({ status: true, data: fetch, msg: 'success' })
      }
    } catch (error) {
      console.log(error);

      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async create({ bouncer, auth, response }: HttpContextContract) {
    try {
      await bouncer.authorize("create-kasbon")
      if (await bouncer.allows('create-kasbon')) {
        const userApproval = await User.query().where('dept_id', 1)
        return response.send({
          status: true, data: {
            auth: auth.user,
            userApproval: userApproval,
          }, msg: 'success'
        })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }
  public async user({ bouncer, auth, response }: HttpContextContract) {
    try {
      await bouncer.authorize("read-kasbon")
      if (await bouncer.allows('read-kasbon')) {
        const user = await User.all()
        return response.send({
          status: true, data: {
            auth: auth.user,
            user: user,
          }, msg: 'success'
        })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async store({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("create-kasbon")
      if (await bouncer.allows('create-kasbon')) {
        const payload = await request.validate(KasbonValidator)
        const post: any[] = []
        for (let i = 0; i < payload.tenor; i++) {
          post.push({
            status_pembayaran:'n'
          })
        }
        const q = new Kasbon()
        q.merge(payload)
        if(await q.save()){
          await q.related('angsuran').createMany(post)
        }
        return response.send({ status: true, data: payload, msg: 'success' })
      }
    } catch (error) {
      console.log(error);
      
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async show({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("read-kasbon")
      if (await bouncer.allows('read-kasbon')) {
        const q = await Kasbon.find(request.param('id'));
        return response.send({ status: true, data: q, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async update({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("update-kasbon")
      if (await bouncer.allows('update-kasbon')) {
        const payload = await request.validate(KasbonValidator)
        const q = await Kasbon.findOrFail(request.param('id'))
        q.merge(payload)
        await q.save()
        return response.send({ status: true, data: payload, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }

  public async destroy({ bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize("delete-kasbon")
      if (await bouncer.allows('delete-kasbon')) {
        const q = await Kasbon.findOrFail(request.param('id'))
        await q.delete()
        return response.send({ status: true, data: {}, msg: 'success' })
      }
    } catch (error) {
      return response.send({ status: false, data: error.messages, msg: 'error' })
    }
  }
}
