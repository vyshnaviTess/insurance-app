import { FlatList } from "react-native";
import { Link } from "expo-router";
import { useSelector } from "react-redux";
import { policiesSelectors } from "@/store/policiesSlice";
import { Screen } from "@/ui/components/Screen";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { EmptyState } from "@/ui/components/EmptyState";
import { formatDate } from "@/utils/dates";

export default function Home() {
  const policies = useSelector(policiesSelectors.selectAll);

  return (
    <Screen title="My Policies">
      <FlatList
        data={policies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <EmptyState
            title="No Policies"
            message="You don’t have any insurance policies yet. Add one to get started."
          />
        }
        renderItem={({ item }) => (
          <Link key={item.id} href={`/policy/${item.id}`} asChild>
            <Card
              title={`${item.type.toUpperCase()} • ${item.provider}`}
               subtitle={`Ends ${formatDate(item.endDate)}`}
            />
          </Link>
        )}
        ListFooterComponent={
          <Link href="/policy/new" asChild>
            <Button title="+ Add Policy" onPress={() => {}} />
          </Link>
        }
      />
    </Screen>
  );
}
