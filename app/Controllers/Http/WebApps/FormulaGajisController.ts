import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormulaGaji from 'App/Models/FormulaGaji'

export default class FormulaGajisController {
    public async index({ response, request }: HttpContextContract) {
        try {
            const { sortBy, search, sortDesc, page, limit } = request.all()
            const fetch = await FormulaGaji.query().where('variable_name', 'LIKE', '%' + search + '%').orderBy([
                {
                    column: sortBy !== '' ? sortBy : 'created_at',
                    order: sortDesc ? 'desc' : 'asc',
                }
            ]).paginate(page, limit)
            return response.send({ status: true, data: fetch, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ request, response }: HttpContextContract) {
        try {
            const input = request.all()
            const q = new FormulaGaji()
            q.variable_name = input.variable_name
            q.operator = input.operator
            await q.save()
            return response.send({ status: true, data: input, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            const q = await FormulaGaji.find(request.param('id'));
            return response.send({ status: true, data: q, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const input = request.all()
            const q = await FormulaGaji.findOrFail(request.param('id'))
            q.variable_name = input.variable_name
            q.operator = input.operator
            await q.save()
            return response.send({ status: true, data: input, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ request, response }: HttpContextContract) {
        try {
            const q = await FormulaGaji.findOrFail(request.param('id'))
            await q.delete()
            return response.send({ status: true, data: {}, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
