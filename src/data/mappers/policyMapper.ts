import { InsurancePolicy } from "../../domain/entities/insurancePolicy";

// Example mapping between API DTOs and domain model
export interface PolicyDTO {
  id: string;
  type: string;
  provider: string;
  policy_number: string;
  start_date: string;
  end_date: string;
  premium: number;
  coverage: any;
  documents: string[];
  reminders: string[];
}

export function fromDTO(dto: PolicyDTO): InsurancePolicy {
  return {
    id: dto.id,
    type: dto.type as InsurancePolicy["type"],
    provider: dto.provider,
    policyNumber: dto.policy_number,
    startDate: dto.start_date,
    endDate: dto.end_date,
    premium: dto.premium,
    coverage: dto.coverage,
    documents: dto.documents,
    reminders: dto.reminders,
  };
}

export function toDTO(model: InsurancePolicy): PolicyDTO {
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
}
//TODO 
//not used yet