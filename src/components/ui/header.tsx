 import { View, Text, ActivityIndicator } from "react-native";
import { useWeather } from "@/hooks/useWeather";
import { useEffect } from "react";

const { handleGetWeather, loading, localizacao, clima, error } = useWeather();
export default function Header() {

  useEffect(() => {

    handleGetWeather();
  }, []);

  const temp = clima?.main?.temp;
  const humidity = clima?.main?.humidity;
  const feelsLike = clima?.main?.feels_like;

  //Tela de Loading
  if (loading) {
    return (
      <View className="bg-bg p-6 flex-row justify-center items-center">
        <ActivityIndicator color="#2D5A27" />
        <Text className="ml-2 text-slate-600">Sincronizando clima...</Text>
      </View>
    );
  }

  return (
    <View className="bg-bg p-6 shadow-sm border-b border-slate-100">
      {/* Use template literal dentro do Text para evitar quebras */}
      <Text className="text-primaryDark font-bold text-lg">
        {`📍 ${localizacao || "Localização não identificada"}`}
      </Text>

      {clima?.main ? (
        <View className="flex-row justify-between mt-4 bg-surfaceAlt p-4 rounded-2xl">
          <View>
            <Text className="text-xs text-slate-500 uppercase font-bold">
              Temperatura
            </Text>
            {/* Garantia de que o valor existe antes de colocar o °C */}
            <Text className="text-xl font-bold text-slate-800">
              {temp !== undefined ? `${temp}°C` : "--"}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-slate-500 uppercase font-bold">
              Umidade
            </Text>
            <Text className="text-xl font-bold text-slate-800">
              {humidity !== undefined ? `${humidity}%` : "--"}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-slate-500 uppercase font-bold">
              Sensação
            </Text>
            <Text className="text-xl font-bold text-slate-800">
              {feelsLike !== undefined ? `${feelsLike}°C` : "--"}
            </Text>
          </View>
        </View>
      ) : (
        <Text className="text-red-400 mt-2 text-xs italic">
          {String(error || "Aguardando dados climáticos...")}
        </Text>
      )}
    </View>
  );
}
