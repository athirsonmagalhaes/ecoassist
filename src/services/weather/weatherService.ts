const API_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY;

export async function obterDadosClimaticos(lat:number, lon:number){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`);

        const dados = await response.json();
        return dados;

    } catch (error) {
        console.error("Erro ao buscar clima via API:", error)
        throw error;
    }
}