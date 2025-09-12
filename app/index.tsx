import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { policiesSelectors } from '@/store/policiesSlice';
import { Screen } from '@/ui/components/Screen';
import { Card } from '@/ui/components/Card';


export default function Home() {
  const policies = useSelector(policiesSelectors.selectAll);
  return (
    <Screen title="Your Policies">
      {policies.map(p => (
        <Link key={p.id} href={`/policy/${p.id}`} asChild>
          <Card title={`${p.type.toUpperCase()} • ${p.provider}`} subtitle={`Ends ${p.endDate}`} />
        </Link>
      ))}
      <Link href="/policy/new">Add policy</Link>
    </Screen>
  );
}
