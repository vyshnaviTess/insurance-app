import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { View, Text, StyleSheet } from "react-native";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onValueChange: (val: string) => void;
}

export function Select({ label, value, options, onValueChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = callback(value);
          if (typeof newValue === "string") {
            onValueChange(newValue);
          }
        }}
        setItems={setItems}
        style={styles.dropdown}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontWeight: "600", marginBottom: 6 },
  dropdown: { borderColor: "#ccc" },
});
