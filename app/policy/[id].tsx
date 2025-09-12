import { useLocalSearchParams, Link } from "expo-router";
import { useSelector } from "react-redux";
import { policiesSelectors } from "@/store/policiesSlice";
import { documentsSelectors } from "@/store/documentSlice";
import { remindersSelectors } from "@/store/remindersSlice";
import { Screen } from "@/ui/components/Screen";
import { Text, View, Image, StyleSheet } from "react-native";
import { Card } from "@/ui/components/Card";
import { EmptyState } from "@/ui/components/EmptyState";
import { ErrorView } from "@/ui/feedback/ErrorView";
import { useState } from "react";
import { formatDate } from "@/utils/dates";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function PolicyDetails() {
  const { id } = useLocalSearchParams();
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
      <Text style={styles.label}>Provider: {policy.provider}</Text>
      <Text style={styles.label}>Policy #: {policy.policyNumber}</Text>
      <Text style={styles.label}>
        Ends: {`Ends ${formatDate(policy.endDate)}`}
      </Text>
      <Text style={styles.label}>Premium: ${policy.premium}</Text>

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

          if (ext && ["jpg", "jpeg", "png"].includes(ext)) {
            // ✅ Image Preview
            return (
              <Link key={doc.id} href={`/documents/${doc.id}`} asChild>
                <Pressable style={styles.imageCard}>
                <Image source={{ uri: doc.uri }} style={styles.imagePreview} />
                <Text style={styles.imageLabel}>{doc.name}</Text>
                </Pressable>
              </Link>
            );
          }

          // ✅ Non-Image Docs → Icon + Filename
          let icon: keyof typeof Ionicons.glyphMap = "document-text-outline";
          if (ext === "pdf") icon = "document-outline";
          if (ext === "doc" || ext === "docx") icon = "document-text-outline";
          if (ext === "txt") icon = "document-attach-outline";

          return (
            <Link key={doc.id} href={`/documents/${doc.id}`} asChild>
              <Card
                title={doc.name}
                subtitle={ext?.toUpperCase() ?? "FILE"}

              >
                <Ionicons name={icon} size={20} color="#333" />
              </Card>
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
            <Card key={r.id} title={r.title} subtitle={`Due ${r.dueAt}`} />
          ) : null;
        })}
        <Link href={`/policy/${policy.id}/addReminder`}>+ Add Reminder</Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
});
