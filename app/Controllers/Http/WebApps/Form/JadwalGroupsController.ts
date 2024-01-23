import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JadwalGroup from 'App/Models/JadwalGroup'
import MasterGroup from 'App/Models/MasterData/MasterGroup'
import TimeConfig from 'App/Models/TimeConfig'
import JadwalGroupValidator from 'App/Validators/JadwalGroupValidator'

export default class JadwalGroupsController {
    public async index({ bouncer, response, request }: HttpContextContract) {
        try {
            await bouncer.authorize("read-jadwalgroup")
            if (await bouncer.allows('read-jadwalgroup')) {
                const { sortBy, sortDesc, page, limit } = request.all()
                const fetch = await JadwalGroup.query().orderBy([
                    {
                        column: sortBy !== '' ? sortBy : 'created_at',
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ])
                .preload('master_group')
                .preload('time_config')
                .paginate(page, limit)
                return response.send({ status: true, data: fetch, msg: 'success' })
            }
        } catch (error) {
            console.log(error);

            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async attr_form({ request, bouncer, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-jadwalgroup")
            if (await bouncer.allows('create-jadwalgroup')) {
                switch (request.input('key')) {
                    case 'group':
                        const group = await MasterGroup.all()
                        const time = await TimeConfig.all()
                        return response.send({ status: true, data: { group, time }, msg: 'success' })
                }
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("create-jadwalgroup")
            if (await bouncer.allows('create-jadwalgroup')) {
                const payload = await request.validate(JadwalGroupValidator)
                const arr: any[] = []
                payload.date.forEach(el => {
                    arr.push({
                        master_group_id: payload.master_group_id,
                        time_config_id: payload.time_config_id,
                        date: el
                    })
                });
                await JadwalGroup.createMany(arr)
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("read-jadwalgroup")
            if (await bouncer.allows('read-jadwalgroup')) {
                const q = await JadwalGroup.find(request.param('id'));
                return response.send({ status: true, data: q, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("update-jadwalgroup")
            if (await bouncer.allows('update-jadwalgroup')) {
                const payload = await request.validate(JadwalGroupValidator)
                // const q = await JadwalGroup.findOrFail(request.param('id'))
                // q.merge(payload)
                // await q.save()
                return response.send({ status: true, data: payload, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ bouncer, request, response }: HttpContextContract) {
        try {
            await bouncer.authorize("delete-jadwalgroup")
            if (await bouncer.allows('delete-jadwalgroup')) {
                const q = await JadwalGroup.findOrFail(request.param('id'))
                await q.delete()
                return response.send({ status: true, data: {}, msg: 'success' })
            }
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
