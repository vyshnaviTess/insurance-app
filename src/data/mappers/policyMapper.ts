// src/data/mappers/policyMapper.ts
import { InsurancePolicy } from "../../domain/entities/insurancePolicy";

export interface PolicyDTO {
  id: string;
  type: string;
  provider: string;
  policy_number?: string;
  start_date?: string;
  end_date?: string;
  premium: number;
  coverage: any;
  documents: string[];
  reminders: string[];
  // Some old policies may already have camelCase fields
  policyNumber?: string;
  startDate?: string;
  endDate?: string;
}

export const policyMapper = {
  fromDTO(dto: PolicyDTO): InsurancePolicy {
    return {
      id: dto.id,
      type: dto.type as InsurancePolicy["type"],
      provider: dto.provider,
      policyNumber: dto.policy_number ?? dto.policyNumber ?? "",
      startDate: dto.start_date ?? dto.startDate ?? new Date().toISOString(),
      endDate: dto.end_date ?? dto.endDate ?? new Date().toISOString() ?? "",
      premium: dto.premium,
      coverage: dto.coverage ?? {},
      documents: dto.documents ?? [],
      reminders: dto.reminders ?? [],
    };
  },

  toDTO(model: InsurancePolicy): PolicyDTO {
    return {
      id: model.id,
      type: model.type,
      provider: model.provider,
      policy_number: model.policyNumber,
      start_date: model.startDate,
      end_date: model.endDate,
      premium: model.premium,
      coverage: model.coverage,
      documents: model.documents,
      reminders: model.reminders,
    };
  },
};
