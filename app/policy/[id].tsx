import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { policiesSelectors } from "@/store/policiesSlice";
import { documentsSelectors } from "@/store/documentSlice";
import { remindersSelectors } from "@/store/remindersSlice";
import { Screen } from "@/ui/components/Screen";
import { Text, View, Image, StyleSheet, Pressable, ScrollView } from "react-native";
import { Card } from "@/ui/components/Card";
import { EmptyState } from "@/ui/components/EmptyState";
import { ErrorView } from "@/ui/feedback/ErrorView";
import { useState } from "react";
import { formatDate } from "@/utils/dates";
import { Ionicons } from "@expo/vector-icons";

export default function PolicyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [error, setError] = useState<Error | null>(null);

  const policy = useSelector((s: any) =>
    policiesSelectors.selectById(s, id as string)
  );
  const documents = useSelector((s: any) => documentsSelectors.selectAll(s));
  const reminders = useSelector((s: any) => remindersSelectors.selectAll(s));

  if (error) {
    return <ErrorView message={error.message} onRetry={() => setError(null)} />;
  }

  if (!policy) {
    return (
      <Screen title="Policy">
        <EmptyState
          title="Policy not found"
          message="This policy does not exist."
        />
      </Screen>
    );
  }

  return (
    <Screen title={`${policy.type.toUpperCase()} Policy`}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with edit icon */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Provider: {policy.provider}</Text>
            <Text style={styles.label}>Policy #: {policy.policyNumber}</Text>
            <Text style={styles.label}>
              Ends: {`Ends ${formatDate(policy.endDate)}`}
            </Text>
            <Text style={styles.label}>Premium: ${policy.premium}</Text>
          </View>

          {/* Edit Icon */}
          <Pressable
            onPress={() => router.push(`/policy/${policy.id}/editPolicy`)}
            style={styles.iconButton}
          >
            <Ionicons name="create-outline" size={22} color="black" />
          </Pressable>
        </View>

        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {!policy.documents.length && (
            <EmptyState
              title="No documents"
              message="Upload policy documents here."
            />
          )}

          {policy.documents.map((docId) => {
            const doc = documents.find((d) => d.id === docId);
            if (!doc) return null;

            const ext = doc.name.split(".").pop()?.toLowerCase();

            if (ext && ["jpg", "jpeg", "png", "heic"].includes(ext)) {
              return (
                <Link key={doc.id} href={`/documents/${doc.id}`} asChild>
                  <Pressable style={styles.imageCard}>
                    <Image
                      source={{ uri: doc.uri }}
                      style={styles.imagePreview}
                    />
                    <Text style={styles.imageLabel}>{doc.name}</Text>
                  </Pressable>
                </Link>
              );
            }

            let icon: keyof typeof Ionicons.glyphMap = "document-text-outline";
            if (ext === "pdf") icon = "document-outline";
            if (ext === "doc" || ext === "docx") icon = "document-text-outline";
            if (ext === "txt") icon = "document-attach-outline";

            return (
              <Link key={doc.id} href={`/documents/${doc.id}`} asChild>
                <Card
                  title={doc.name}
                  subtitle={ext?.toUpperCase() ?? "FILE"}
                  trailing={<Ionicons name={icon} size={20} color="#333" />}
                />
              </Link>
            );
          })}

          <Link href={`/policy/${policy.id}/addDocument`}>+ Add Document</Link>
        </View>

        {/* Reminders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          {!policy.reminders.length && (
            <EmptyState
              title="No reminders"
              message="Set renewal, payment, or custom reminders."
            />
          )}
          {policy.reminders.map((rId) => {
            const r = reminders.find((r) => r.id === rId);
            return r ? (
              <Card key={r.id} title={r.title} subtitle={`Due ${formatDate(r.dueAt)}`} />
            ) : null;
          })}
          <Link href={`/policy/${policy.id}/addReminder`}>+ Add Reminder</Link>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  imageCard: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  imageLabel: {
    padding: 8,
    fontWeight: "600",
  },
  iconButton: {
    padding: 6,
  },
});
