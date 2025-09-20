import { Alert, FlatList, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { Screen } from "@/ui/components/Screen";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { EmptyState } from "@/ui/components/EmptyState";
import { formatDate } from "@/utils/dates";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { usePolicies } from "@/hooks/usePolicies";

export default function Home() {
  const { policies, removePolicy, fetchAndSync } = usePolicies();
  const router = useRouter();
  
   useEffect(() => {
    (async () => {
      try {
        await fetchAndSync(); // ✅ await to prevent unhandled rejection
      } catch (err) {
        console.warn("Policy sync failed (offline):", err);
      }
    })();
  }, []);

 const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Policy",
      "Are you sure you want to delete this policy?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
         onPress: async () => {
            try {
              await removePolicy(id); // ✅ await here too
            } catch (err) {
              console.warn("Delete policy failed (offline):", err);
            }
          },
        },
      ],
      { cancelable: true }
    );
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
              <Pressable onPress={() => confirmDelete(item.id)}>
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
