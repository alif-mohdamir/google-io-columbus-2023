# grAIt Recipes 🍜

### Welcome to the **grAIt Recipes** app! This is a revolutionary application that harnesses the power of AI to generate delicious recipes from the ingredients you already have in your kitchen. No more wondering what to cook with the items in your pantry – let AI do the thinking for you!

## Technologies Used 💻

- **[Next.js](https://nextjs.org/)**: A popular React framework for building efficient and dynamic web applications.
- **[OpenAI](https://platform.openai.com/overview):** Integrates the power of OpenAI's AI models for recipe generation.
- **[ElevenLabs](https://docs.elevenlabs.io/welcome/introduction):** Generative AI text to speech and voice cloning.
- **[ShadCN/UI](https://ui.shadcn.com/):** Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
- **[TailwindCSS](https://tailwindcss.com/):** A utility-first CSS framework packed with classes like **flex**, **pt-4**, **text-center**, and **rotate-90** that can be composed to build any design, directly in your markup.

## Getting Started 🚀

Follow these steps to get started with **grAIt Recipes**:

1. **Clone the Repository:** Start by cloning the repository to your local machine.

```
git clone https://github.com/alif-mohdamir/google-io-columbus-2023.git
cd google-io-columbus-2023
```

2. **Install Dependencies:** Inside the `frontend` folder, use npm or yarn to install the required dependencies.

```
npm install
# or
yarn install
```

3. **Environment Variables:** Create a `.env.development.local` file in the root of the `frontend` folder and add the following environment variables:

```
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
# see https://elevenlabs.io/voice-lab about generating a voice id
```

4. **Run the App:** Inside the `frontend` folder, start the development server to run the app locally.

```
npm run dev
# or
yarn dev
```

5. **Access the App:** Open your web browser and navigate to `http://localhost:3000` to access the grAIt Recipes app.
