export const parseLLMResponse = (response) => {
    try {
        let cleanedResponse = response.replace(/```json\s?|```/g, '').trim();

        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error('JSON ayrıştırma hatası:', error);
        throw new Error('LLM yanıtı geçerli JSON değil');
    }
};