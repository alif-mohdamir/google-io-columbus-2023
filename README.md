# grAIt Recipes 🍜

Welcome to the **grAIt Recipes** app! This is a revolutionary application that harnesses the power of AI to generate delicious recipes from the ingredients you already have in your kitchen. No more wondering what to cook with the items in your pantry – let AI do the thinking for you!

## Technologies Used 💻

- **[Next.js](https://nextjs.org/)**: A popular React framework for building efficient and dynamic web applications.
- **[OpenAI](https://platform.openai.com/overview):** Integrates the power of OpenAI's AI models for recipe and meal image generation.
- **[PaLM API](https://developers.generativeai.google/guide/palm_api_overview):** Utilizes Google's LLM for recipe generation.
- **[ElevenLabs](https://docs.elevenlabs.io/welcome/introduction):** Generative AI text to speech and voice cloning.
- **[Shadcn/ui](https://ui.shadcn.com/):** Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
- **[TailwindCSS](https://tailwindcss.com/):** A utility-first CSS framework packed with classes like **flex**, **pt-4**, **text-center** and **rotate-90** that can be composed to build any design, directly in your markup.

## Getting Started 🚀

Follow these steps to get started with **grAIt Recipes**:

1. **Clone the Repository:** Start by cloning the repository to your local machine.

```
git clone https://github.com/alif-mohdamir/google-io-columbus-2023.git
cd google-io-columbus-2023
```

2. **Install Dependencies:** Use npm or yarn to install the required dependencies.

```
npm install
# or
yarn install
```

3. **Environment Variables:** Create a `.env.development.local` file in the root directory and add the following environment variables:

```
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
PALM_API_KEY=your_palm_api_key
# see https://elevenlabs.io/voice-lab about generating a voice id
```

4. **Run the App:** Start the development server to run the app locally.

```
npm run dev
# or
yarn dev
```

5. **Access the App:** Open your web browser and navigate to `http://localhost:3000` to access the grAIt Recipes app.

## Environment Variables 🔑

- **OPENAI_API_KEY:** Obtain your OpenAI API key by signing up on the [OpenAI website](https://platform.openai.com/overview) and create a new API key in your account dashboard.
- **ELEVENLABS_VOICE_ID:** Obtain the voice ID by signing up on the [Eleven Labs website](https://elevenlabs.io/) and creating an account.
- **ELEVENLABS_API_KEY:** Get the API key from your Eleven Labs account dashboard.
- **PALM_API_KEY:** Get your PaLM api key from the [Google Generative AI Developer's website](https://developers.generativeai.google/tutorials/chat_node_quickstart#obtain_an_api_key)
