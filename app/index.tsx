import { FlatList, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { policiesSelectors, policiesActions } from "@/store/policiesSlice";
import { Screen } from "@/ui/components/Screen";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { EmptyState } from "@/ui/components/EmptyState";
import { formatDate } from "@/utils/dates";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const policies = useSelector(policiesSelectors.selectAll);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = (id: string) => {
    dispatch(policiesActions.removePolicy(id));
  };

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
          <Card
            title={`${item.type.toUpperCase()} • ${item.provider}`}
            subtitle={`Ends ${formatDate(item.endDate)}`}
            onPress={() => router.push(`/policy/${item.id}`)} // ✅ open details
            trailing={
              <Pressable onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </Pressable>
            }
          />
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
