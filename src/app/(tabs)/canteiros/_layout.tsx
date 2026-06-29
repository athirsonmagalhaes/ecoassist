import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="cadastro/index"/>
            <Stack.Screen name="detalhes/[id]" />
            <Stack.Screen name="detalhes/novo-plantio" />
        </Stack>
    )
}