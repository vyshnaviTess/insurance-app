import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export function Button({ title, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF', // iOS blue
    paddingVertical: 14,
    borderRadius: 30, // pill shape
    alignItems: 'center',
    marginVertical: 12,
  },
   disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
