// src/data/repositories/remoteRepository.ts
import { ApiClient } from "../api/client";
import { Repository } from "./baseRepository";
import { Mapper } from "../mappers/baseMapper";

export class RemoteRepository<Domain, DTO> implements Repository<Domain> {
  constructor(
    private client: ApiClient,
     protected endpoint: string, 
    private mapper: Mapper<Domain, DTO>
  ) {}

  async list(): Promise<Domain[]> {
    const res = await this.client.get<DTO[]>(this.endpoint);
    return res.map(this.mapper.fromDTO);
  }

 async get(id: string): Promise<Domain> {  // 👈 add this
    const dto = await this.client.get<DTO>(`${this.endpoint}/${id}`);
    return this.mapper.fromDTO(dto);
  }

  async create(item: Domain): Promise<Domain> {
    const res = await this.client.post<DTO>(this.endpoint, this.mapper.toDTO(item));
    return this.mapper.fromDTO(res);
  }

  async update(item: Domain): Promise<Domain> {
    const id = (item as any).id;
    const res = await this.client.put<DTO>(`${this.endpoint}/${id}`, this.mapper.toDTO(item));
    return this.mapper.fromDTO(res);
  }

  async remove(id: string): Promise<void> {
    await this.client.delete(`${this.endpoint}/${id}`);
  }
}
