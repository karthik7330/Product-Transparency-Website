# Clarity: AI-Powered Product Transparency Reports

Clarity is a web application that helps businesses build trust with their customers by generating comprehensive, AI-powered transparency reports for their products. Users answer a dynamic, multi-step form, and our AI agents generate a detailed summary and follow-up questions to create a thorough report.

## Setup Instructions

To get the project running locally, please follow these steps:

1.  **Prerequisites**:
    *   [Node.js](https://nodejs.org/) (v18 or later recommended)
    *   `npm` or a compatible package manager

2.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Set Up Environment Variables**:
    *   Create a new file named `.env` in the root of the project.
    *   Add your Gemini API key to this file. You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

5.  **Run the Development Servers**:
    *   **Next.js App**: To run the user-facing web application, use:
        ```bash
        npm run dev
        ```
        This will start the app on `http://localhost:9002`.

    *   **Genkit AI Flows**: To run the local Genkit development server for the AI services, open a *new terminal window* and run:
        ```bash
        npm run genkit:dev
        ```
        This will start the Genkit developer UI, where you can inspect and test your AI flows.

## Feature List

*   **Dynamic Multi-Step Form**: An intuitive, guided form for entering product information.
*   **AI-Powered Follow-up Questions**: As you fill out the form, an AI agent dynamically generates relevant follow-up questions to gather more comprehensive data.
*   **AI Report Summarization**: Once all data is submitted, an AI agent analyzes the answers and produces a concise, easy-to-understand summary for the final report.
*   **Clean Report Display**: Presents the AI summary and the full list of questions and answers in a professional, easy-to-read accordion format.
*   **Modern Tech Stack**: Built with Next.js, TypeScript, Tailwind CSS, and ShadCN for a high-quality, maintainable, and performant user experience.
*   **Genkit Integration**: Leverages Google's Genkit framework to robustly define and run AI flows powered by the Gemini family of models.

## AI Service Documentation

The AI functionality is powered by two core Genkit flows located in the `src/ai/flows/` directory.

1.  **`generateFollowUpQuestions`**:
    *   **Purpose**: To make the data collection process more thorough and interactive.
    *   **Trigger**: This flow is triggered when the user completes the initial set of questions in the product form.
    *   **Process**: It takes the user's previous answers and the context of the last question asked, then prompts the Gemini model to generate a new set of relevant follow-up questions. This allows the form to adapt to the specific product being described.

2.  **`summarizeTransparencyReport`**:
    *   **Purpose**: To distill the detailed, raw data from the form into a concise and readable summary for the end-user.
    *   **Trigger**: This flow is triggered when the user finishes answering all questions and submits the form for report generation.
    *   **Process**: It combines all questions and answers into a single document, which is then passed to the Gemini model with a prompt instructing it to act as an expert at summarizing product transparency reports. The output is a clear, high-level overview of the product's key transparency points.

## Sample Product Entry & Example Report

Here’s a quick example of how a user might interact with the application.

**Sample Product Entry:**

1.  **What is the name of the product?**
    > *EcoGlow Natural Laundry Detergent*
2.  **What category does the product belong to?**
    > *Household Cleaning*
3.  **What are the primary materials or ingredients used in this product?**
    > *It's a plant-based formula. The main ingredients are soap berries, baking soda, and essential oils for fragrance.*
4.  **(AI Follow-up) What type of essential oils are used?**
    > *A blend of lavender and eucalyptus.*

**Example Report Output:**

*   **AI Summary**:
    > The EcoGlow Natural Laundry Detergent is a plant-based household cleaning product. Its primary active ingredients are soap berries and baking soda. The detergent's fragrance is derived from a blend of natural lavender and eucalyptus essential oils.

*   **Full Details**:
    *   **Q: What is the name of the product?**
        *   A: EcoGlow Natural Laundry Detergent
    *   **Q: What category does the product belong to?**
        *   A: Household Cleaning
    *   ...and so on for all other questions.

---

## (Bonus) Reflection

*   **How did you use AI tools in development?**

    > As an AI coding assistant, I was central to the development process. My role was not just to write code, but to act as a collaborative partner. The user provided the high-level goals and feature requests, such as "create a form" or "generate a summary." I translated those requirements into a concrete implementation plan, selected the appropriate technologies from the provided stack (Next.js, Genkit, ShadCN), and generated the necessary code for components, AI flows, and type definitions. This interactive process, where the user guided the overall direction and I handled the detailed execution, allowed for extremely rapid prototyping and iteration.

*   **What principles guided your architecture, design, and product transparency logic?**

    > The guiding principles were **modularity, user-centricity, and trust**.
    >
    > **Architecture**: I chose a modular approach by separating concerns. The frontend (Next.js components) is distinct from the AI logic (Genkit flows). This makes the application easier to maintain and scale. Using server components and server actions in Next.js improves performance and keeps sensitive logic off the client.
    >
    > **Design**: The design, leveraging ShadCN UI components, prioritizes clarity and ease of use. A clean, minimalist aesthetic prevents user distraction, while the multi-step form with its progress bar manages cognitive load, making the process feel less daunting.
    >
    > **Transparency Logic**: The core logic is built on the idea that true transparency comes from detail. The AI doesn't just take answers; it actively seeks more information by generating follow-up questions. The final report provides both a quick, digestible AI summary for casual readers and the full, unabridged Q&A for those who want to dive deeper. This two-level approach respects the user's time while still providing comprehensive data, which is key to building trust.
