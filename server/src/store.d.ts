export type Server = {
  name: string,
  subtitle: string,
  description: string|undefined,
  url: string,
  apiUrl: string,
  socketUrl: string,
  booth: {
    media: {
      artist: string,
      title: string,
      thumbnail: string,
    },
    dj: {
      username: string,
    },
  }|null,
  usersCount: number,
}

export type StoreEntry = { ping: number, data: Server };

export interface Store {
  update(id: string, entry: StoreEntry): Promise<void>;
  get(id: string): Promise<StoreEntry|undefined>;
  list(): AsyncIterator<[string, StoreEntry]>;
  deleteBefore(staleTimestamp: number): Promise<void>;
}

declare module 'fastify' {
  interface FastifyInstance {
    store: Store & import('events').EventEmitter;
  }
}
