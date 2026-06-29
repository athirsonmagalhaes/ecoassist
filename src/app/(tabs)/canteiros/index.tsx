import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Plus, Sprout, Calendar, Info } from 'lucide-react-native';
import { iCanteiro } from '@/types/index';
import { useFocusEffect, useRouter } from 'expo-router';
import Header from '@/components/ui/header'
import { listarCanteiros } from '@/database/queries';




export default function GestaoCanteiros() {


  const [canteirosDb, setCanteirosDb] = useState<iCanteiro[]>()

  // useFocusEffect roda TODA VEZ que a tela volta a ficar visível
  useFocusEffect(
    useCallback(() => {
      async function recuperarCanteiros() {
        const canteiros = await listarCanteiros();

        setCanteirosDb(canteiros);

        console.log("Canteiros da tela->", canteirosDb);
      };
      recuperarCanteiros();
    }, [])
  );

  const router = useRouter();

  const renderCanteiroCard = ({ item }: { item: iCanteiro }) => (
    <TouchableOpacity
      onPress={() => { router.push(`/(tabs)/canteiros/detalhes/${item.id}`) }}
      className="bg-surface p-5 mb-4 rounded-3xl shadow-sm border border-slate-100"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start">


        <View>
          <View className='flex-row mb-3'>
            <Sprout size={23} color="#4A6D41" />
            <Text className="text-xl font-bold text-slate-800 ml-2">{item.nome}</Text>
          </View>
          <Text className="text-sm text-slate-500 mt-1">
            {item.largura}cm x {item.comprimento}cm - {item.tipo_solo}
          </Text>
        </View>

        {item.tem_cobertura && (
          <View className="bg-surfaceAlt px-3 py-1 rounded-full">
            <Text className="text-[10px] font-bold text-primaryDark uppercase">Coberto</Text>
          </View>
        )}

      </View>

    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center p-10 mt-20">
      <View className="bg-surfaceAlt p-6 rounded-full mb-4">
        <Info size={40} color="#4A6D41" />
      </View>
      <Text className="text-lg font-bold text-slate-800 text-center">
        Nenhum canteiro por aqui
      </Text>
      <Text className="text-sm text-slate-500 text-center mt-2 leading-5">
        Comece cadastrando seu primeiro espaço para que o Consultor Digital possa te ajudar no manejo.
      </Text>
    </View>
  );

  return (
    <>
      <Header />
      <View className="flex-1 bg-bg px-4 pt-6">

        <FlatList
          data={canteirosDb}
          keyExtractor={(item) => item.id!.toString() ?? Math.random().toString()}//Garantir que seja um número
          renderItem={renderCanteiroCard}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View className="mb-6">
              <Text className="text-2xl font-bold text-slate-900">Seus Canteiros</Text>
              <Text className="text-sm text-slate-500">Gerencie a estrutura física da sua horta</Text>
            </View>
          )}
        />

        <TouchableOpacity
          className="absolute bottom-8 right-8 bg-primaryDark w-16 h-16 rounded-full justify-center items-center shadow-lg"
          onPress={() => router.push("/canteiros/cadastro")}
        >
          <Plus color="#FFFFFF" size={32} />
        </TouchableOpacity>
      </View>
    </>
  );
}