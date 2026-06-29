import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Sprout,
  Ruler,
  Sun,
  Layers,
  Shield,
  Hash,
  Leaf,
} from "lucide-react-native";
import { useCanteiro } from "@/hooks/useCanteiro";
import { usePlantiosCanteiro } from "@/hooks/usePlantiosCanteiro";
import { deletarCanteiro, deletarPlantio, listarObservacoesPlantio, salvarObservacoes } from "@/database/queries";

function rotuloTipoSolo(valor: string | null | undefined): string {
  if (!valor) return "—";
  const mapa: Record<string, string> = {
    argiloso: "Argiloso",
    arenoso: "Arenoso",
    franco: "Franco",
    humifero: "Humífero",
    latossolo: "Latossolo",
    compactado: "Compactado",
    degradado: "Degradado",
    pedregoso: "Pedregoso",
    varzea: "Várzea",
  };
  return mapa[valor] ?? valor;
}

function rotuloPropagacao(tipo: string | null | undefined): string {
  if (tipo === "semente") return "Semente";
  if (tipo === "muda") return "Muda";
  return "—";
}

export default function DetalhesCanteiro() {
  const { id } = useLocalSearchParams();
  const idFormatado = Number(id);
  const router = useRouter();
  const { canteiro, loading: loadingCanteiro, refresh: refreshCanteiro } = useCanteiro(
    Number.isFinite(idFormatado) ? idFormatado : null,
  );
  const {
    plantios,
    loading: loadingPlantios,
    refresh: refreshPlantios,
  } = usePlantiosCanteiro(Number.isFinite(idFormatado) ? idFormatado : null);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [plantioSelecionado, setPlantioSelecionado] = useState<any>(null);
  const [observacoesPrev, setObservacoesPrevia] = useState<string|null>("");
  const [observacao, setObservacao] = useState("");

  const recarregar = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshCanteiro(), refreshPlantios()]);
    setRefreshing(false);
  }, [refreshCanteiro, refreshPlantios]);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar])
  );


  // Função para abrir o modal com as informações do plantio
  async function abrirModalEditar (plantio: any)  {
    setPlantioSelecionado(plantio);
    setModalVisivel(true);
    const obsPrev = await listarObservacoesPlantio(plantio.id);
    setObservacoesPrevia(obsPrev);
  };

  async function handleSalvarObservacao(idPlantio: number){
    try {
      await salvarObservacoes(idPlantio, observacao);
      setObservacao("");
      const obsPrev = await listarObservacoesPlantio(idPlantio);
      setObservacoesPrevia(obsPrev);
      await refreshPlantios();
      Alert.alert("Sucesso", "Observação salva no diário de bordo!");
    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar observações, tente novamente.");
      console.error("Erro ao salvar observações: ", error);
      throw error;
    }
  };

  async function handleDeletarPlantio(idPlantio: number){
    Alert.alert(
      "Confirmar Exclusão",
    "Tem certeza que deseja remover este plantio?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletarPlantio(idPlantio);
            Alert.alert("Sucesso", "Plantio excluído com sucesso!");
            if (refreshPlantios) {
              await refreshPlantios();
            }
          } catch (error) {
            console.error("Erro ao deletar plantio:", error);
            Alert.alert("Erro", "Não foi possível excluir o plantio.");
          }
        }
      }
    ]
    )
  };

  async function handleDeletarCanteiro(){
    if(!idFormatado){
      Alert.alert("Erro", "Não foi possível identificar o canteiro para exclusão.");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o canteiro "${canteiro?.nome ?? ''}" `,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarCanteiro(idFormatado);
              Alert.alert("Sucesso", "Canteiro excluído com sucesso!", [
                {
                  text: "OK",
                  onPress: () => router.back()
                }
              ])
            } catch (error) {
              console.error("Erro ao excluir canteiro: ", error);
              Alert.alert(
                "Erro ao excluir",
                "Não foi possível excluir o canteiro no momento. Tente novamente."
              )
            }
          }
        }
      ]
    );
  }

  const loading = loadingCanteiro || loadingPlantios || refreshing;
  const resultado = canteiro ? [canteiro] : [];

  if (loading && !canteiro) {
    return (
      <View className="bg-bg flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" color="#065F46" />
        <Text className="mt-4 text-slate-600">Carregando detalhes do canteiro</Text>
      </View>
    );
  }

  if (!resultado || resultado.length === 0) {
    return (
      <View className="bg-bg flex-1 p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mb-6 mt-2 flex-row items-center"
        >
          <Ionicons name="chevron-back" size={24} color="#065F46" />
          <Text className="ml-1 text-lg font-medium text-primaryDark">Voltar</Text>
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center px-6">
          <Sprout size={48} color="#94A3B8" />
          <Text className="mt-4 text-center text-lg font-bold text-slate-800">
            Nenhum registro encontrado
          </Text>
          <Text className="mt-2 text-center text-sm text-slate-500">
            Não há dados para este canteiro no momento.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        className="flex-1 bg-bg mt-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="mb-4 flex-row items-center"
          >
            <Ionicons name="chevron-back" size={24} color="#065F46" />
            <Text className="ml-1 text-lg font-medium text-primaryDark">Voltar</Text>
          </TouchableOpacity>

          <Text className="mb-1 text-2xl font-bold text-slate-900">Detalhes do canteiro</Text>
          <Text className="mb-6 text-sm text-slate-500">
            {resultado.length === 1
              ? "Informações do espaço selecionado"
              : `${resultado.length} registros retornados`}
          </Text>

          {resultado.map((canteiro, index) => (
            <View
              key={canteiro.id != null ? String(canteiro.id) : `idx-${index}`}
              className="mb-6 rounded-3xl border border-slate-100 bg-surface p-5 shadow-sm"
            >
              <View className="mb-4 flex-row items-center justify-between border-b border-slate-50 pb-4">
                <View className="flex-row items-center">
                  <Sprout size={26} color="#4A6D41" />
                  <Text className="ml-2 text-xl font-bold text-slate-800">
                    {canteiro.nome ?? "Sem nome"}
                  </Text>
                </View>
                {canteiro.tem_cobertura ? (
                  <View className="rounded-full bg-surfaceAlt px-3 py-1">
                    <Text className="text-[10px] font-bold uppercase text-primaryDark">
                      Coberto
                    </Text>
                  </View>
                ) : null}
              </View>

              <View className="gap-4">
                <View className="flex-row items-start">
                  <View className="mt-0.5 rounded-xl bg-surfaceAlt p-2">
                    <Hash size={18} color="#64748b" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-xs font-bold uppercase text-slate-400">ID</Text>
                    <Text className="text-base text-slate-800">
                      {canteiro.id != null ? String(canteiro.id) : "—"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-0.5 rounded-xl bg-surfaceAlt p-2">
                    <Ruler size={18} color="#64748b" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-xs font-bold uppercase text-slate-400">Dimensões</Text>
                    <Text className="text-base text-slate-800">
                      {canteiro.largura != null && canteiro.comprimento != null
                        ? `${canteiro.largura} cm × ${canteiro.comprimento} cm`
                        : "—"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-0.5 rounded-xl bg-surfaceAlt p-2">
                    <Layers size={18} color="#64748b" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-xs font-bold uppercase text-slate-400">Tipo de solo</Text>
                    <Text className="text-base text-slate-800">
                      {rotuloTipoSolo(canteiro.tipo_solo)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-0.5 rounded-xl bg-surfaceAlt p-2">
                    <Sun size={18} color="#64748b" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-xs font-bold uppercase text-slate-400">
                      Horas de sol
                    </Text>
                    <Text className="text-base text-slate-800">
                      {canteiro.horas_de_sol != null
                        ? `${canteiro.horas_de_sol} h/dia`
                        : "—"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-0.5 rounded-xl bg-surfaceAlt p-2">
                    <Shield size={18} color="#64748b" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-xs font-bold uppercase text-slate-400">Cobertura</Text>
                    <Text className="text-base text-slate-800">
                      {canteiro.tem_cobertura === true
                        ? "Sim, área coberta"
                        : canteiro.tem_cobertura === false
                          ? "Não, exposição direta"
                          : "—"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <Text className="mb-3 mt-2 text-lg font-bold text-slate-900">Plantios neste canteiro</Text>
          {plantios.length === 0 ? (
            <View className="mb-6 rounded-2xl border border-dashed border-slate-200 bg-surfaceAlt p-6">
              <Text className="text-center text-sm text-slate-500">
                Nenhum plantio registrado ainda. Adicione o primeiro plantio abaixo.
              </Text>
            </View>
          ) : (
            plantios.map((plantio) => (
              <View
                key={plantio.id}
                className="mb-3 flex-row items-center rounded-2xl border border-slate-100 bg-surface p-4 shadow-sm"
              >
                <View className="rounded-xl bg-surfaceAlt p-2">
                  <Leaf size={20} color="#065F46" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-slate-900">
                    {plantio.nome_planta ?? "Planta"}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-500">
                    {plantio.quantidade ?? 0} un. · {rotuloPropagacao(plantio.tipo_propagacao)} ·{" "}
                    {plantio.data_plantio ?? "—"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 pl-2">
                  {/* Botão Editar alterado para abrir o modal de observações */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => abrirModalEditar(plantio)}
                    className="rounded-xl bg-slate-50 p-2.5"
                  >
                    <Ionicons name="pencil-sharp" size={18} color="#475569" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {handleDeletarPlantio(plantio.id)}}
                    className="rounded-xl bg-red-50 p-2.5"
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View> 
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal do Diário de Bordo (Observações do Plantio) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          {/* Container Principal do Modal */}
          <View className="bg-surface rounded-t-3xl p-6 border border-slate-100 shadow-xl max-h-[85%] flex-col">
            
            {/* 1. CABEÇALHO (Fixo no Topo) */}
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xl font-bold text-slate-900">Diário de Bordo</Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  Plantio: {plantioSelecionado?.nome_planta}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalVisivel(false)}
                className="bg-slate-100 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#475569" />
              </TouchableOpacity>
            </View>
            
            {/* 2. CONTEÚDO ROLÁVEL (Estilizado corretamente para não sumir) */}
            <ScrollView 
              className="flex-grow-1"
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={true}
            >
              {/* Seção: Nova Anotação / Edição */}
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Escreva suas observações técnicas:
              </Text>
              
              <TextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Ex: Germinação iniciada, necessita de mais rega pela manhã..."
                placeholderTextColor="#94A3B8"
                value={observacao}
                onChangeText={setObservacao}
                className="w-full min-h-[100px] rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 text-sm mb-5"
              />

              {/* Seção: Observações Registradas */}
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Observações Registradas
              </Text>
              
              {observacoesPrev && observacoesPrev.trim() !== "" ? (
                <View className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-4 flex-row items-start">
                  <Ionicons name="journal-outline" size={18} color="#065F46" className="mt-0.5" />
                  <Text className="ml-2.5 text-sm text-slate-700 flex-1 leading-relaxed">
                    {observacoesPrev}
                  </Text>
                </View>
              ) : (
                <View className="w-full rounded-2xl border border-dashed border-slate-200 p-4 items-center justify-center bg-slate-50/50">
                  <Ionicons name="information-circle-outline" size={20} color="#94A3B8" />
                  <Text className="mt-1 text-xs text-slate-400 text-center">
                    Não há observações registradas sobre este plantio.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* 3. BOTÕES DE AÇÃO (Fixos na base) */}
            <View className="flex-row gap-3 pt-4 border-t border-slate-100 bg-surface">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisivel(false)}
                className="flex-1 items-center justify-center rounded-2xl border border-slate-200 py-3.5"
              >
                <Text className="text-sm font-bold text-slate-600">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSalvarObservacao(plantioSelecionado?.id)}
                className="flex-1 items-center justify-center rounded-2xl bg-primaryDark py-3.5"
              >
                <Text className="text-sm font-bold text-white">Salvar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>    

      <View className="border-t border-slate-100 bg-surface px-4 pb-6 pt-4">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            const cid = resultado[0]?.id;
            if (cid == null) return;
            router.push({
              pathname: "/(tabs)/canteiros/detalhes/novo-plantio",
              params: { id_canteiro: String(cid) },
            });
          }}
          className="mb-3 flex-row items-center justify-center rounded-2xl bg-primaryDark py-4"
        >
          <Sprout color="#FFFFFF" size={22} />
          <Text className="ml-2 text-base font-bold text-white">
            Adicionar plantio neste canteiro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {handleDeletarCanteiro()}}
          className="flex-row items-center justify-center rounded-2xl border-2 border-danger bg-white py-4"
        >
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
          <Text className="ml-2 text-base font-bold text-danger">Excluir canteiro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}