import { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { salvarCanteiro } from "@/database/queries";
import { Ionicons } from "@expo/vector-icons";

export default function CadastrarCanteiro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [largura, setLargura] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [horasDeSol, setHorasDeSol] = useState("");
  const [cobertura, setCobertura] = useState(false);
  const [solo, setSolo] = useState("");
  const [loading, setLoading] = useState(false);

  const tiposDeSolo = [
    { label: "Argiloso (Terra Roxa/Barro)", value: "argiloso" },
    { label: "Arenoso (Leve/Drenado)", value: "arenoso" },
    { label: "Franco (Equilibrado/Ideal)", value: "franco" },
    { label: "Humífero (Rico em matéria orgânica)", value: "humifero" },
    { label: "Latossolo (Profundo e ácido)", value: "latossolo" },
    { label: "Solo Compactado (Duro/Pouca aeração)", value: "compactado" },
    { label: "Solo Degradado (Pobre em nutrientes)", value: "degradado" },
    {
      label: "Pedregoso (Muitas rochas/Pouca profundidade)",
      value: "pedregoso",
    },
    { label: "Várzea (Sazonalmente alagado)", value: "varzea" },
  ];

  const handleContinue = async () => {
    setLoading(true);
    try {
      await salvarCanteiro(
        nome,
        Number(largura),
        Number(comprimento),
        solo,
        Number(horasDeSol),
        cobertura,
      );

      console.log(`CANTEIRO SALVO COM SUCESSO`);

      Alert.alert(`Canteiro "${nome}" criado com sucesso!`);

      router.push("/(tabs)/canteiros");
    } catch (error) {
      console.error("Falha ao salvar canteiro:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-bg">
        <ActivityIndicator size="large" color="#2D5A27" />
        <Text className="mt-4 text-gray-600 font-medium">
          Salvando canteiro...
        </Text>
      </View>
    );
  }

 return (
    <ScrollView 
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 mt-5"
      >
        <TouchableOpacity 
          onPress={() => router.back()} 
          activeOpacity={0.7}
          className="flex-row items-center mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="#065F46" />
          <Text className="text-primaryDark font-medium text-lg ml-1">Voltar</Text>
        </TouchableOpacity>

        <View className="mb-8">
          <Text className=" text-center text-3xl font-bold text-primaryDark">Cadastro de canteiros</Text>
          <Text className=" text-center text-base text-slate-600 mt-2">Preencha com os dados do seu canteiro</Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-primaryDark mb-4">1. Nome do canteiro:</Text>
          <TextInput
            className="bg-surface border border-border rounded-lg p-5 text-text focus:border-primary"
            placeholder="Ex: Canteiro de Hortaliças"
            placeholderTextColor="#5C6356"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-primaryDark mb-4">2. Dimensões em Centímetros (cm):</Text>
          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <TextInput
                className="bg-surface border border-border rounded-lg p-5 text-text focus:border-primary"
                placeholder="Largura"
                keyboardType="numeric"
                value={largura}
                onChangeText={setLargura}
              />
            </View>
            <View className="w-[48%]">
              <TextInput
                className="bg-surface border border-border rounded-lg p-5 text-text focus:border-primary"
                placeholder="Comprimento"
                keyboardType="numeric"
                value={comprimento}
                onChangeText={setComprimento}
              />
            </View>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-primaryDark mb-4">3. Tipo de solo predominante:</Text>
          <View className="bg-surface border border-border rounded-lg overflow-hidden">
            <Picker
              selectedValue={solo}
              onValueChange={(itemValue) => setSolo(itemValue)}
              dropdownIconColor="#10B981"
            >
              <Picker.Item label="Selecione o tipo..." value="" color="#5C6356" />
              {tiposDeSolo.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} color="#1A2E1A" />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-primaryDark mb-4">4. Horas de sol direto por dia:</Text>
          <TextInput
            className="bg-surface border border-border rounded-lg p-5 text-text focus:border-primary"
            placeholder="Ex: 6"
            keyboardType="numeric"
            value={horasDeSol.toString()}
            onChangeText={(text) => setHorasDeSol(text.replace(/[^0-9]/g, ""))}
          />
        </View>

        <View className="flex-row items-center justify-between mb-8 p-4 bg-green-50 rounded-xl border border-green-100">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-semibold text-primaryDark">Tem cobertura morta?</Text>
            <Text className=" text-base text-slate-600 mt-2">Proteção de palhada sobre o solo.</Text>
          </View>
          <Switch
            value={cobertura}
            onValueChange={setCobertura}
            trackColor={{ false: "#E2E8F0", true: "#10B981" }}
            thumbColor={cobertura ? "#065F46" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          className={`p-5 rounded-2xl flex-row justify-center items-center shadow-lg ${loading ? "bg-textMuted" : "bg-primaryDark active:bg-text"}`}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-surface font-bold text-lg">Salvar Canteiro</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
