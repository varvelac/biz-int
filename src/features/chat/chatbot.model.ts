export interface Chatbot {
    model: string,
    prompt: string,
    temperature: number,
    max_tokens: number,
    prefixes: string[],
}