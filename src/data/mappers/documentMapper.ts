// src/data/mappers/documentMapper.ts
import { Document } from "../../domain/entities/document";
import { Mapper } from "./baseMapper";

export interface DocumentDTO {
  id: string;
  uri: string;
  name: string;
  category: string;
  created_at: string;
  size?: number;
  mime?: string;
}

export const documentMapper: Mapper<Document, DocumentDTO> = {
  fromDTO(dto) {
    return {
      id: dto.id,
      uri: dto.uri,
      name: dto.name,
      category: dto.category as Document["category"],
      createdAt: dto.created_at,
      size: dto.size,
      mime: dto.mime,
    };
  },
  toDTO(model) {
    return {
      id: model.id,
      uri: model.uri,
      name: model.name,
      category: model.category,
      created_at: model.createdAt,
      size: model.size,
      mime: model.mime,
    };
  },
};
