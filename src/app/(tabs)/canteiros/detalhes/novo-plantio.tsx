import { PlantaSearchModal } from "@/components/plantas/PlantaSearchModal";
import { salvarPlantio } from "@/database/queries";
import { useCanteiro } from "@/hooks/useCanteiro";
import { usePlantiosCanteiro } from "@/hooks/usePlantiosCanteiro";
import { usePlants } from "@/hooks/usePlants";
import type { iPlanta } from "@/types/index";
import {
  BUFFER_GERMINACAO_DIAS,
  calcularDensidade,
  calcularPrevisaoColheita,
  hojeIso,
  montarConsorcio,
  type TipoPropagacao,
} from "@/utils/plantioCalculations";  
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Hash,
  Leaf,
  Sprout,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function parseParamId(raw: string | string[] | undefined): number | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatarDimensao(cm: number | null | undefined): string {
  if (cm == null) return "—";
  if (cm >= 100) return `${(cm / 100).toFixed(1)} m`;
  return `${cm} cm`;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default function NovoPlantio() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id_canteiro?: string | string[] }>();
  const idCanteiro = useMemo(() => parseParamId(params.id_canteiro), [params.id_canteiro]);

  const { data: plantasDb, loading: loadingPlantas, error: erroPlantas } = usePlants();
  const { canteiro, loading: carregandoCanteiro } = useCanteiro(idCanteiro);
  const { nomesAtivos: companheirasNoCanteiro } = usePlantiosCanteiro(idCanteiro);

  const [modalPlantas, setModalPlantas] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState<iPlanta | null>(null);
  const [tipoPropagacao, setTipoPropagacao] = useState<TipoPropagacao>("muda");
  const [quantidade, setQuantidade] = useState("");
  const [dataPlantio, setDataPlantio] = useState(hojeIso());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [obs, setObs] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (plantasDb.length === 0) return;
    setPlantaSelecionada((atual) => atual ?? plantasDb[0] ?? null);
  }, [plantasDb]);

  const qNum = useMemo(() => {
    const q = Number(quantidade.replace(",", "."));
    return Number.isFinite(q) && q >= 1 ? Math.floor(q) : 0;
  }, [quantidade]);

  const densidade = useMemo(() => {
    if (
      !plantaSelecionada ||
      !canteiro?.largura ||
      !canteiro?.comprimento ||
      qNum < 1
    ) {
      return null;
    }
    return calcularDensidade(
      canteiro.largura,
      canteiro.comprimento,
      plantaSelecionada.espacamento_cm,
      qNum,
    );
  }, [plantaSelecionada, canteiro, qNum]);

  const previsaoColheita = useMemo(() => {
    if (!plantaSelecionada) return null;
    return calcularPrevisaoColheita(
      dataPlantio,
      plantaSelecionada.ciclo_dias,
      tipoPropagacao,
    );
  }, [plantaSelecionada, dataPlantio, tipoPropagacao]);

  const consorcio = useMemo(() => {
    if (!plantaSelecionada) return null;
    return montarConsorcio(plantaSelecionada, companheirasNoCanteiro);
  }, [plantaSelecionada, companheirasNoCanteiro]);

  useEffect(() => {
    if (!sucesso || idCanteiro == null) return;
    const timer = setTimeout(() => {
      router.replace({
        pathname: "/(tabs)/canteiros/detalhes/[id]",
        params: { id: String(idCanteiro) },
      });
    }, 1400);
    return () => clearTimeout(timer);
  }, [sucesso, idCanteiro, router]);


  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      const ano = selectedDate.getFullYear();
      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dia = String(selectedDate.getDate()).padStart(2, '0');
      setDataPlantio(`${ano}-${mes}-${dia}`);
    };
  };

  const dataPlantioObjeto = useMemo(() => {
    if (!dataPlantio) return new Date();
    const [ano, mes, dia] = dataPlantio.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
  }, [dataPlantio]);

  async function handleConfirmar() {
    if (idCanteiro == null) {
      Alert.alert("Canteiro inválido", "Volte aos detalhes do canteiro e tente novamente.");
      return;
    }
    if (!plantaSelecionada) {
      Alert.alert("Planta", "Selecione uma planta na lista.");
      return;
    }
    if (!ISO_DATE.test(dataPlantio.trim())) {
      Alert.alert("Data", "Use o formato AAAA-MM-DD (ex.: 2026-05-18).");
      return;
    }
    if (qNum < 1) {
      Alert.alert("Quantidade", "Informe um número inteiro maior ou igual a 1.");
      return;
    }

    setSalvando(true);
    try {
      await salvarPlantio(
        plantaSelecionada.id,
        idCanteiro,
        dataPlantio.trim(),
        qNum,
        obs.trim() || null,
        "ativo",
        tipoPropagacao,
      );
      setSucesso(true);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o plantio. Tente de novo.");
    } finally {
      setSalvando(false);
    }
  }

  if (idCanteiro == null) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center text-lg font-bold text-slate-800">Canteiro não identificado</Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          Abra esta tela a partir dos detalhes de um canteiro.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 rounded-2xl bg-primaryDark px-6 py-3"
          activeOpacity={0.85}
        >
          <Text className="font-bold text-white">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loadingPlantas || carregandoCanteiro) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color="#065F46" />
        <Text className="mt-4 text-slate-600">Carregando dados do canteiro…</Text>
      </View>
    );
  }

  if (erroPlantas || plantasDb.length === 0) {
    return (
      <View className="flex-1 justify-center bg-bg px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center" activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#065F46" />
          <Text className="ml-1 text-lg font-medium text-primaryDark">Voltar</Text>
        </TouchableOpacity>
        <Text className="text-center text-base text-slate-600">
          {erroPlantas ?? "Nenhuma planta na base local. Reinicie o app para popular o catálogo."}
        </Text>
      </View>
    );
  }

  if (sucesso && plantaSelecionada) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-8">
        <CheckCircle2 size={56} color="#15803d" />
        <Text className="mt-4 text-center text-2xl font-bold text-green-700">
          Plantio registrado!
        </Text>
        <Text className="mt-2 text-center text-base text-slate-600">
          {plantaSelecionada.nome} foi adicionado ao canteiro com status ativo.
        </Text>
        <Text className="mt-4 text-sm text-green-700">Redirecionando para os detalhes…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center" activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#065F46" />
          <Text className="ml-1 text-lg font-medium text-primaryDark">Voltar</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-slate-900">Novo plantio</Text>

        <View className="mt-3 rounded-2xl border border-slate-100 bg-surfaceAlt p-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="flex-row items-center rounded-full bg-surface px-3 py-1">
              <Hash size={14} color="#64748b" />
              <Text className="ml-1 text-xs font-semibold text-slate-600">
                {canteiro?.nome ?? `Canteiro #${idCanteiro}`}
              </Text>
            </View>
            {canteiro?.largura != null && canteiro?.comprimento != null ? (
              <View className="flex-row items-center rounded-full bg-surface px-3 py-1">
                <Sprout size={14} color="#4A6D41" />
                <Text className="ml-1 text-xs font-semibold text-slate-700">
                  {formatarDimensao(canteiro.largura)} × {formatarDimensao(canteiro.comprimento)}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-2 text-xs text-slate-500">
            Dimensões herdadas automaticamente — você não precisa selecionar o canteiro de novo.
          </Text>
        </View>

        <Text className="mb-2 ml-1 mt-6 text-sm font-semibold text-slate-600">O QUE VAI PLANTAR?</Text>
        <TouchableOpacity
          onPress={() => setModalPlantas(true)}
          className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-100 bg-surface p-4 shadow-sm"
          activeOpacity={0.85}
        >
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900">
              {plantaSelecionada?.nome ?? "Selecionar planta"}
            </Text>
            {plantaSelecionada ? (
              <Text className="mt-0.5 text-xs text-slate-500">
                Espaçamento {plantaSelecionada.espacamento_cm} cm · Ciclo {plantaSelecionada.ciclo_dias} dias
              </Text>
            ) : null}
          </View>
          <ChevronDown size={22} color="#065F46" />
        </TouchableOpacity>

        {consorcio && plantaSelecionada ? (
          <View className="mb-4 rounded-2xl border border-green-100 bg-surfaceAlt p-4">
            <Text className="text-sm text-slate-700">
              <Text className="font-bold text-primaryDark">Combina bem com: </Text>
              {consorcio.texto}
            </Text>
            {consorcio.companheirasAtivas.length > 0 ? (
              <View className="mt-2 rounded-xl bg-greenMuted px-3 py-2">
                <Text className="text-xs font-bold text-green-700">
                  Já ativas neste canteiro: {consorcio.companheirasAtivas.join(", ")}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {plantaSelecionada ? (
          <View className="mb-6 rounded-2xl border border-slate-100 bg-surface p-4">
            <View className="mb-2 flex-row items-center">
              <Leaf size={18} color="#065F46" />
              <Text className="ml-2 text-sm font-bold text-primaryDark">Ficha rápida</Text>
            </View>
            <Text className="text-sm text-slate-600">
              Luz: {plantaSelecionada.luz} · Rega: {plantaSelecionada.rega} · Estrato:{" "}
              {plantaSelecionada.estrato}
            </Text>
          </View>
        ) : null}

        <Text className="mb-2 ml-1 text-sm font-semibold text-slate-600">PROPAGAÇÃO</Text>
        <View className="mb-6 flex-row gap-3">
          {(
            [
              { label: "Muda", value: "muda" as const },
              { label: "Semente", value: "semente" as const },
            ] as const
          ).map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              onPress={() => setTipoPropagacao(value)}
              className={`flex-1 items-center rounded-2xl border-2 p-4 ${tipoPropagacao === value
                ? "border-primaryDark bg-greenMuted"
                : "border-transparent bg-surface"
                }`}
              activeOpacity={0.85}
            >
              <Text
                className={`font-bold ${tipoPropagacao === value ? "text-primaryDark" : "text-slate-400"}`}
              >
                {label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-4 flex-row gap-4">
          <View className="flex-1">
            <Text className="mb-2 ml-1 text-sm font-semibold text-slate-600">QUANTIDADE</Text>
            <View className="flex-row items-center rounded-2xl border border-slate-100 bg-surface p-4">
              <TextInput
                placeholder="Ex.: 5"
                keyboardType="number-pad"
                value={quantidade}
                onChangeText={setQuantidade}
                className="flex-1 text-lg text-slate-800"
              />
            </View>
          </View>

          <View className="flex-1">
            <Text className="mb-2 ml-1 text-sm font-semibold text-slate-600">DATA DO PLANTIO</Text>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center rounded-2xl border border-slate-100 bg-surface p-4"
              activeOpacity={0.7}
            >
              <Calendar size={20} color="#065F46" />
              <Text className="ml-2 flex-1 text-lg text-slate-800">
                {/* Exibe formatado visualmente para o usuário brasileiro (DD/MM/AAAA) */}
                {dataPlantio.split('-').reverse().join('/')}
              </Text>
            </TouchableOpacity>

            <Text className="ml-1 mt-1 text-[10px] text-slate-400">Toque para alterar a data</Text>

            {showDatePicker && (
              <DateTimePicker
                value={dataPlantioObjeto}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()} // Opcional: impede selecionar datas futuras
              />
            )}
          </View>
        </View>

        {densidade && qNum >= 1 ? (
          <View
            className={`mb-4 rounded-2xl border p-4 ${densidade.superlotado
              ? "border-warning bg-amber-50"
              : "border-slate-100 bg-surfaceAlt"
              }`}
          >
            <View className="flex-row items-start">
              {densidade.superlotado ? (
                <AlertTriangle size={20} color="#D97706" style={{ marginTop: 2 }} />
              ) : (
                <Sprout size={20} color="#065F46" style={{ marginTop: 2 }} />
              )}
              <View className="ml-3 flex-1">
                <Text
                  className={`mb-1 font-bold ${densidade.superlotado ? "text-warning" : "text-primaryDark"
                    }`}
                >
                  Validador de densidade
                </Text>
                <Text className="text-sm leading-5 text-slate-700">{densidade.mensagem}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {previsaoColheita ? (
          <View className="mb-6 rounded-2xl border border-green-100 bg-surface p-4">
            <Text className="text-sm font-bold text-primaryDark">Previsão de colheita</Text>
            <Text className="mt-1 text-lg font-bold text-green-700">
              {previsaoColheita.dataColheitaFormatada}
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              {tipoPropagacao === "semente"
                ? `Ciclo ${plantaSelecionada?.ciclo_dias} dias + ${BUFFER_GERMINACAO_DIAS} dias de germinação`
                : `Ciclo estimado: ${plantaSelecionada?.ciclo_dias} dias (muda)`}{" "}
              · Total {previsaoColheita.diasTotais} dias
            </Text>
          </View>
        ) : null}

        <Text className="mb-2 ml-1 text-sm font-semibold text-slate-600">OBSERVAÇÕES</Text>
        <TextInput
          placeholder="Relate pragas ou adubação para o Consultor de IA"
          multiline
          numberOfLines={4}
          value={obs}
          onChangeText={setObs}
          className="mb-8 rounded-2xl border border-slate-100 bg-surface p-4 text-base text-slate-800"
          textAlignVertical="top"
        />

        <TouchableOpacity
          className="items-center rounded-3xl bg-primaryDark p-5 shadow-lg"
          activeOpacity={0.85}
          disabled={salvando}
          onPress={handleConfirmar}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-lg font-bold text-white">Confirmar plantio</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <PlantaSearchModal
        visible={modalPlantas}
        plantas={plantasDb}
        selecionada={plantaSelecionada}
        onSelect={setPlantaSelecionada}
        onClose={() => setModalPlantas(false)}
      />
    </KeyboardAvoidingView>
  );
}
