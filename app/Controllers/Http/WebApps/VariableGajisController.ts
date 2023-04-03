import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VariableGaji from 'App/Models/VariableGaji'

export default class VariableGajisController {
    public async index({ response }: HttpContextContract) {
        try {
            const fetch = await VariableGaji.all()
            return response.send({ status: true, data: fetch, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async store({ request, response }: HttpContextContract) {
        try {
            const input = request.all()
            const q = new VariableGaji()
            q.variable_name = input.variable_name
            q.bobot = input.bobot
            await q.save()
            return response.send({ status: true, data: input, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            const q = await VariableGaji.find(request.param('id'));
            return response.send({ status: true, data: q, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const input = request.all()
            const q = await VariableGaji.findOrFail(request.param('id'))
            q.variable_name = input.variable_name
            q.bobot = input.bobot
            await q.save()
            return response.send({ status: true, data: input, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }

    public async destroy({ request, response }: HttpContextContract) {
        try {
            const q = await VariableGaji.findOrFail(request.param('id'))
            await q.delete()
            return response.send({ status: true, data: {}, msg: 'success' })
        } catch (error) {
            return response.send({ status: false, data: error.messages, msg: 'error' })
        }
    }
}
