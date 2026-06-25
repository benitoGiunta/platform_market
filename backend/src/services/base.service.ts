// CRUD générique Prisma — écrit une seule fois, étendu par chaque service métier.
// `model` est un délégué Prisma (prisma.videaste, prisma.client, ...).
/* eslint-disable @typescript-eslint/no-explicit-any */
export class BaseService {
  constructor(protected model: any) {}

  findAll() {
    return this.model.findMany();
  }

  findById(id: number) {
    return this.model.findUnique({ where: { id } });
  }

  create(data: any) {
    return this.model.create({ data });
  }

  update(id: number, data: any) {
    return this.model.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.model.delete({ where: { id } });
  }
}
