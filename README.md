# EcoAssist 🌿🚜
Aplicativo mobile para planejamento agroecológico, gestão de plantios e assistência inteligente (Em desenvolvimento).

## 🚀 Tecnologias Utilizadas
- **Core:** React Native, TypeScript, Expo (v55) e Expo Router
- **Estilização:** NativeWind (Tailwind CSS)
- **Banco de Dados Local:** Expo SQLite com Drizzle ORM (Persistência de dados offline)
- **Localização & Clima:** Expo Location e integração com a **API OpenWeather** para monitoramento climático em tempo real
- **Ícones & Animações:** Lucide React Native e React Native Reanimated

## 🛠️ O que já está funcionando (Offline First)
- **Arquitetura Base:** Navegação estruturada via Expo Router.
- **Persistência Local:** Modelagem de banco de dados e migrações estruturadas com Drizzle Kit e SQLite.
- **Geolocalização & Clima:** Captura automatizada das coordenadas do usuário via Expo Location e consumo da API OpenWeather, com renderização dinâmica da temperatura local.

## 📅 Próximo Sprint
- Integrar a **Gemini API** para processamento de linguagem natural e recomendações personalizadas de forma integrada aos dados locais.


## 🚀 Como Instalar e Executar o Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento do **EcoAssist** localmente.

### 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* **Node.js** (LTS recomendado)
* **Git**
* Um gerenciador de pacotes (**npm** ou **yarn**)
* O aplicativo do **Expo Go** instalado no seu celular (para testar em um dispositivo físico) ou um emulador configurado (Android Studio / Xcode).

---

### 📦 Instalação

#### 1. Clonar o Repositório 
Abra o terminal e clone o projeto:
```bash
git clone [https://github.com/seu-usuario/ecoassist.git](https://github.com/seu-usuario/ecoassist.git)
cd ecoassist

```

#### 2. Instalar as Dependências

Instale todos os pacotes necessários do projeto:

```bash
# Se você usa npm:
npm install

# Se você usa yarn:
yarn install

```

#### 3. Variáveis de Ambiente (`.env`)

O projeto utiliza a API do **OpenWeather** e a API do **Gemini**. Crie um arquivo chamado `.env` na raiz do projeto e preencha com as suas credenciais:

```env
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_do_gemini
EXPO_PUBLIC_OPEN_WEATHER_API_KEY=sua_chave_da_OpenWeather
```

### 🏃‍♂️ Executando a Aplicação

Com tudo instalado e configurado, inicie o servidor de desenvolvimento do Expo:

```bash
# Se você usa npm:
npm start

# Se você usa yarn:
yarn start

```

Agora é só escanear o **QR Code** que aparecer no terminal usando o aplicativo do **Expo Go** no seu celular, ou pressionar `a` para abrir no emulador Android / `i` para o simulador iOS.
