import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";

import { salvarPerfilUsuario, perfilExiste } from "@/database/queries";

import { useLocation } from "@/hooks/useLocation";

export default function ColetarPerfil() {
  const router = useRouter();
  const [experiencia, setExperiencia] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [inputLocalizacao, setInputLocalizacao] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  const objetivos = [
    "Horta para Consumo Próprio",
    "Horta Medicinal e Aromática",
    "Sistema de Agrofloresta",
    "Produção de Ciclo Rápido para Comercialização",
    "Gestão e Otimização de Espaço",
    "Cultivo resistente à Seca",
    "Cultivo em Vasos",
  ];

  const { handleGetLocation, loading, endereco, latitude, longitude, error } =
  useLocation();

  const procurarPerfil = async () =>{
    try {
      const resultado = await perfilExiste();
    if(resultado){
      router.replace("/(tabs)")
    }else {
      // Primeiro acesso -> vai para a tela index
      router.replace("/"); 
    }
    } catch (error) {
      console.error("❌ Erro ao ler perfil no banco local:", error);

      router.replace("/");
    }
  }

  useEffect(() => {
    procurarPerfil();
    handleGetLocation();
  }, []);

  useEffect(() => {
    const enderecoFiltrado =
      `${endereco?.subregion} - ${endereco?.region}` ||
      "Localização não identificada";
    setLocalizacao(enderecoFiltrado);
  }, [endereco]);

  const handleContinue = async () => {
    // Define qual valor será salvo (Prioriza o input manual se não estiver vazio)
    const localizacaoFinal =
      inputLocalizacao.trim() !== "" ? inputLocalizacao : localizacao;

    if (!localizacaoFinal) {
      Alert.alert(
        "Atenção",
        "Por favor, informe sua localização para análise do clima.",
      );

      return;
    }

    try {
      await salvarPerfilUsuario(
        experiencia,
        objetivo,
        localizacaoFinal,
        latitude,
        longitude,
      );

      console.log(`SALVO COM SUCESSO: ${localizacaoFinal}`);

      router.push("/(tabs)");
    } catch (error) {
      console.error("Falha ao salvar perfil:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-bg">
        <ActivityIndicator size="large" color="#2D5A27" />
        <Text className="mt-4 text-gray-600 font-medium">
          Sincronizando com o GPS...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
      className="bg-bg"
    >
      <ScrollView
        className="flex-1 bg-bg"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className=" text-center text-3xl font-bold text-primaryDark">
            Bem-vindo ao EcoAssist
          </Text>
          <Text className=" text-center text-base text-slate-600 mt-2">
            Vamos personalizar sua experiência de cultivo.
          </Text>
        </View>

        {/* Pergunta 1: Experiência */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-primaryDark mb-4">
            1. Qual seu nível de experiência?
          </Text>
          <View className="flex-row justify-between">
            {["Iniciante", "Intermediário", "Avançado"].map((nivel) => (
              <TouchableOpacity
                key={nivel}
                onPress={() => setExperiencia(nivel)}
                className={`px-4 py-3 rounded-xl border ${
                  experiencia === nivel
                    ? "bg-primaryDark border-primaryDark"
                    : "bg-surface border-slate-200"
                }`}
              >
                <Text
                  className={`${experiencia === nivel ? "text-white" : "text-slate-700 font-medium"}`}
                >
                  {nivel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pergunta 2: Objetivos (Cards Retangulares) */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-primaryDark mb-4">
            2. Qual seu objetivo neste momento?
          </Text>
          {objetivos.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setObjetivo(item)}
              activeOpacity={0.7}
              className={`w-full p-5 mb-3 rounded-2xl flex-row items-center justify-between border ${
                objetivo === item
                  ? "bg-primaryDark border-primaryDark shadow-sm"
                  : "bg-surface border-slate-100 shadow-sm"
              }`}
            >
              <Text
                className={`text-base flex-1 ${objetivo === item ? "font-bold text-white" : "text-slate-700"}`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pergunta 3: Localização */}
        <View className="mb-10">
          <Text className="text-lg font-semibold text-primaryDark mb-4">
            3. Sua área é em: "{localizacao}"? Se não, diga abaixo
          </Text>

          <TextInput
            placeholder="Ex: Ribeirão Preto, SP"
            value={inputLocalizacao}
            onChangeText={setInputLocalizacao}
            className="bg-surface border border-border rounded-lg p-5 text-text focus:border-primary"
          />

          <Text className="text-xs text-slate-500 mt-2 italic">
            Usaremos isso para analisar o clima local na próxima etapa.
          </Text>
        </View>

        {/* Botão de Conclusão */}
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-primaryDark p-5 rounded-2xl mb-4 flex-row justify-center items-center shadow-lg"
        >
          <Text className="text-white text-lg font-bold">
            Começar Consultoria Digital
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGetLocation}
          className="bg-primaryDark p-5 rounded-2xl mb-12 flex-row justify-center items-center shadow-lg"
        >
          <Text className="text-white text-lg font-bold">
            Usar localização atual
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
