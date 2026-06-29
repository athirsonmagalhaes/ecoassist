import * as Location from "expo-location";

export async function obterEndereco() {

  const local = await Location.getCurrentPositionAsync({});
  console.log("Localização obtida:", local.coords);

  const latitude = local.coords.latitude;
  const longitude = local.coords.longitude;


  try {

    const res = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });


    if (res.length > 0) {

      const endereco = res[0];


      const enderecoFormatado = `
      Rua: ${endereco.street || "Rua não encontrada"},
      Numero da rua: ${endereco.streetNumber || "S/N"},  
      Bairro: ${endereco.district || "Bairro não encontrado"},
      Cidade: ${endereco.subregion || "Cidade 2 não encontrada"},
      Estado: ${endereco.region || 'Estado não encontrado' }`;

      console.log("Endereço tratado:", enderecoFormatado);

      return {
        endereco,
        latitude,
        longitude
      };

    }
  } catch (error) {

    console.error("Erro ao traduzir coordenadas:", error);
    return null;

  }
}
