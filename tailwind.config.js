/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
    "./src/utils/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       colors:{ 
      // Tons Terrosos (Fundo e Superfícies)
      bg: "#F8F7F2", // Um "off-white" levemente areia/pedra para reduzir o cansaço visual no campo
      surface: "#FFFFFF", // Branco puro para os Cards de plantas e canteiros
      surfaceAlt: "#F1F2E9", // Um tom de musgo muito claro para áreas de destaque ou listas

      // Texto e Contrastes
      text: "#1A2E1A", // Verde floresta profundo (quase preto) para leitura profissional e nítida
      textMuted: "#5C6356", // Cinza oliva para descrições da Embrapa e informações secundárias

      // Identidade de Marca
      primary: "#10B981", // Verde Esmeralda: representa vida e tecnologia sustentável
      primaryDark: "#065F46", // Verde escuro para botões de ação principal e estados ativos

      // Status e Alertas Agrícolas
      success: "#22C55E", // Verde vibrante para indicar plantas saudáveis ou colheita pronta
      warning: "#F59E0B", // Âmbar: Alerta de evapotranspiração ou calor acima de 30°C 
      danger: "#EF4444", // Vermelho: Alerta de geada, seca extrema ou pragas detectadas 
      error: "#B91C1C", // Vermelho profundo para erros críticos de sistema

      // Cores de Apoio Contextual
      terracotta: "#78350F", // Cor de barro/terra para elementos que remetam ao solo e canteiros
      blueMuted: "#60A5FA", // Azul suave para dados de umidade, chuva e irrigação 
      greenMuted: "#D1FAE5", // Menta clarinho para badges de "Estrato" (Baixo, Médio, Alto)
      border: "#E2E8F0", // Cinza neutro para divisórias sutis entre especificações técnicas
    }
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
