import { ApiClient } from "./client";
import { InsurancePolicy } from "../../domain/entities/insurancePolicy";

export class PolicyApi {
  constructor(private client: ApiClient) {}

  list(): Promise<InsurancePolicy[]> {
    return this.client.get("/policies");
  }

  create(policy: InsurancePolicy): Promise<InsurancePolicy> {
    return this.client.post("/policies", policy);
  }

  update(policy: InsurancePolicy): Promise<InsurancePolicy> {
    return this.client.put(`/policies/${policy.id}`, policy);
  }

  remove(id: string): Promise<void> {
    return this.client.delete(`/policies/${id}`);
  }
}
//TODO
// its not used whats the use