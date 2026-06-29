import { obterEndereco } from "@/services/location/locationService";
import { obterPermissao } from "@/services/location/permissionLocation";
import { useState } from "react";
import * as Location from "expo-location";

export function useLocation() {
  const [endereco, setEndereco] =
    useState<Location.LocationGeocodedAddress | null>();
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const temPermissao = await obterPermissao();

      if (!temPermissao) {
        setError(
          "O EcoAssist precisa da sua localização para funcionar corretamente",
        );
        return;
      }

      const dadosLocal = await obterEndereco();

      if (
        dadosLocal &&
        dadosLocal.latitude !== undefined &&
        dadosLocal.longitude !== undefined
      ) {
        setEndereco(dadosLocal.endereco);
        setLatitude(dadosLocal.latitude);
        setLongitude(dadosLocal.longitude);
      }
    } catch (err) {
      setError("Erro ao obter a localização");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    endereco,
    latitude,
    longitude,
    loading,
    error,
    handleGetLocation,
  };
}
