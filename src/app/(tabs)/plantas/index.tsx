import { usePlants } from "@/hooks/usePlants";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import {  SafeAreaView } from 'react-native-safe-area-context'

export default function Plantas() {
  const { data: plantas, loading, error } = usePlants();
  const [busca, setBusca] = useState("");

  const plantasFiltradas = useMemo(() => {
    return plantas.filter((planta) =>
      planta.nome.toLowerCase().includes(busca.toLowerCase()) ||
      planta.estrato?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, plantas]);

  if (loading) {
    return (
      <View className="flex-1 bg-bg justify-center items-center">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="mt-4 text-emerald-800 font-medium">Carregando base da Embrapa...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-3xl  text-center font-bold text-emerald-900 mb-1 mt-10">EcoAssist</Text>
        <Text className="text-stone-500 text-center  mb-6 italic">Seu Consultor Agrícola Digital</Text>

        {/* Barra de Pesquisa Estilizada */}
        <View className="bg-surface border border-stone-200 rounded-2xl px-4 py-3 shadow-sm mb-4">
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Pesquisar por planta ou estrato (Ex: Alto)..."
            placeholderTextColor="#a8a29e"
            className="text-stone-800 text-base"
          />
        </View>
      </View>

      <FlatList
        data={plantasFiltradas}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-surface rounded-3xl p-5 mb-4 shadow-sm border border-stone-100">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold text-emerald-900">{item.nome}</Text>
              
              {/* Badge de Estrato Sintrópico */}
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-700 text-xs font-bold uppercase">
                  {item.estrato}
                </Text>
              </View>
            </View>

            <Text className="text-stone-600 leading-5 text-sm mb-2">
              {item.descricao_embrapa}
            </Text>
            
            <View className="flex-row items-center pt-3 border-t border-stone-50">
               <Text className="text-stone-400 text-xs italic">Fonte: Base Técnica Embrapa</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-stone-400 text-lg">Nenhuma planta encontrada...</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}