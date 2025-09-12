import { useLocalSearchParams, Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { policiesSelectors } from '../../src/store/policiesSlice';
import { documentsSelectors } from '../../src/store/documentSlice';
import { remindersSelectors } from '../../src/store/remindersSlice';
import { Screen } from '../../src/ui/components/Screen';
import { Text, View } from 'react-native';
import { Card } from '../../src/ui/components/Card';

export default function PolicyDetails() {
  const { id } = useLocalSearchParams();
  const policy = useSelector((s: any) => policiesSelectors.selectById(s, id as string));
  const documents = useSelector((s: any) => documentsSelectors.selectAll(s));
  const reminders = useSelector((s: any) => remindersSelectors.selectAll(s));

  if (!policy) return <Screen title="Policy"><Text>Not found</Text></Screen>;

  return (
    <Screen title={`${policy.type.toUpperCase()} Policy`}>
      <Text>Provider: {policy.provider}</Text>
      <Text>Policy #: {policy.policyNumber}</Text>
      <Text>Ends: {policy.endDate}</Text>
      <Text>Premium: ${policy.premium}</Text>

      <View style={{ marginTop: 20 }}>
        <Text>Documents</Text>
        {policy.documents.map(docId => {
          const doc = documents.find(d => d.id === docId);
          return doc ? (
            <Link key={doc.id} href={`/documents/${doc.id}`} asChild>
              <Card title={doc.name} subtitle={doc.uri} />
            </Link>
          ) : null;
        })}
        <Link href={`/policy/${policy.id}/addDocument`}>+ Add Document</Link>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>Reminders</Text>
        {policy.reminders.map(rId => {
          const r = reminders.find(r => r.id === rId);
          return r ? <Card key={r.id} title={r.title} subtitle={`Due ${r.dueAt}`} /> : null;
        })}
        <Link href={`/policy/${policy.id}/addReminder`}>+ Add Reminder</Link>
      </View>
    </Screen>
  );
}
