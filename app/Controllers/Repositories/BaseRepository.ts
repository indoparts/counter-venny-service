export default class BaseRepository {
    private model: any;
    constructor(model: any) {
        this.model = model;
    }

    async pagination($input: { sortBy: any; search: any; sortDesc: any; page: any; limit: any; }, $colSearch: any, $colSort: any) {
        const { sortBy, search, sortDesc, page, limit } = $input
            const count = await this.model.query().count('* as total').first()

            const q = await this.model.query()
                .where(sortBy !== '' ? sortBy : $colSearch, 'LIKE', '%' + search + '%')
                .orderBy([
                    {
                        column: sortBy !== '' ? sortBy : $colSort,
                        order: sortDesc ? 'desc' : 'asc',
                    }
                ]).paginate(page, limit < 5 ? count.$extras.total : limit)
                return q
    }

    async all() {
        return this.model.all()
    }

    async store(data: any) {
        const q = new this.model
        q.merge(data)
        await q.save()
        return q
    }

    async find(id: number) {
        const q = await this.model.find(id)
        if (!q) {
            return null
        }
        return q
    }

    async update(id: number, data: any) {
        const q = await this.model.find(id)
            if (!q) {
                return null
            }
            q.merge(data)
            await q.save()
            return q
    }

    async delete(id: number) {
        const q = await this.model.find(id);
            if (!q) {
                return null
            }
            await q.delete();
            return q
    }
}