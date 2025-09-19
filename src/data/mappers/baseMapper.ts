// src/data/mappers/baseMapper.ts
export interface Mapper<Domain, DTO> {
  fromDTO(dto: DTO): Domain;
  toDTO(domain: Domain): DTO;
}
