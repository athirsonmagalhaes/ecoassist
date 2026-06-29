import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { Search, X, Check } from "lucide-react-native";
import type { iPlanta } from "@/types/index";

interface PlantaSearchModalProps {
  visible: boolean;
  plantas: iPlanta[];
  selecionada: iPlanta | null;
  onSelect: (planta: iPlanta) => void;
  onClose: () => void;
}

export function PlantaSearchModal({
  visible,
  plantas,
  selecionada,
  onSelect,
  onClose,
}: PlantaSearchModalProps) {
  const [busca, setBusca] = useState("");

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return plantas;
    return plantas.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.estrato.toLowerCase().includes(q) ||
        p.consorcio.some((c) => c.toLowerCase().includes(q)),
    );
  }, [busca, plantas]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="max-h-[85%] rounded-t-3xl bg-surface px-4 pb-8 pt-4"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">Escolher planta</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12} activeOpacity={0.7}>
              <X size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View className="mb-4 flex-row items-center rounded-2xl border border-slate-100 bg-surfaceAlt px-3 py-2">
            <Search size={18} color="#64748b" />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar entre as 33 espécies…"
              placeholderTextColor="#94a3b8"
              className="ml-2 flex-1 text-base text-slate-800"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filtradas}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="py-8 text-center text-sm text-slate-500">
                Nenhuma planta encontrada para &quot;{busca}&quot;.
              </Text>
            }
            renderItem={({ item }) => {
              const ativa = selecionada?.id === item.id;
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    onClose();
                    setBusca("");
                  }}
                  className={`mb-2 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
                    ativa ? "border-primaryDark bg-greenMuted" : "border-slate-100 bg-surface"
                  }`}
                  activeOpacity={0.85}
                >
                  <View className="flex-1 pr-2">
                    <Text className="font-semibold text-slate-900">{item.nome}</Text>
                    <Text className="mt-0.5 text-xs text-slate-500">
                      {item.espacamento_cm} cm · {item.ciclo_dias} dias · {item.estrato}
                    </Text>
                  </View>
                  {ativa ? <Check size={20} color="#065F46" /> : null}
                </TouchableOpacity>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
