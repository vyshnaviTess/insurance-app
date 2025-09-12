import { InsurancePolicy } from '../src/domain/entities/insurancePolicy';
import { policiesReducer, policiesActions } from '../src/store/policiesSlice';

test('upserts and removes policies', () => {
    const p: InsurancePolicy = {
    id: '1',
    type: 'car', // ✅ matches InsuranceType union
    provider: 'GoCompare',
    policyNumber: 'P1',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    premium: 100,
    coverage: {},
    documents: [],
    reminders: [],
  };
  const s1 = policiesReducer(undefined, policiesActions.upsertPolicy(p));
  expect(Object.values(s1.entities)).toHaveLength(1);
  const s2 = policiesReducer(s1, policiesActions.removePolicy('1'));
  expect(Object.values(s2.entities)).toHaveLength(0);
});
