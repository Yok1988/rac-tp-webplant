import { Stack } from "expo-router";

export default function HelpLayout() {
  return (
    <Stack>
        <Stack.Screen name="help" />
        <Stack.Screen name="contact" />
    </Stack>
  )
}