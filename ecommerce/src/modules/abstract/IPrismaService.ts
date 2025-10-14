export interface IPrismaServiceCreate<T, TCreate> {
  create(data: TCreate): Promise<T>;
}

export interface IPrismaServiceRead<T> {
  findMany(options?: any): Promise<T[]>;
  findUnique(where: any): Promise<T | null>;
  findFirst(where: any): Promise<T | null>;
  count(where?: any): Promise<number>;
}

export interface IPrismaService<T, TCreate, TUpdate> extends IPrismaServiceCreate<T, TCreate>, IPrismaServiceRead<T> {
  update(where: any, data: TUpdate): Promise<T>;
  delete(where: any): Promise<T>;
  upsert(where: any, update: TUpdate, create: TCreate): Promise<T>;
}
