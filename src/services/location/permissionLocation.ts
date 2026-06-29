import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { obterEndereco } from './locationService';

export async function obterPermissao() {
      // Pede a permissão
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Localização necessária",
          "O EcoAssist precisa da sua localização para funcionar corretamente."
        );
        return false;
      }
      return true
    }