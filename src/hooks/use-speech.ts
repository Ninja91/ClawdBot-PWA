import { createSignal } from 'solid-js';

export function useSpeech(onResult: (transcript: string) => void) {
  const [isListening, setIsListening] = createSignal(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
    };
    
    recognition.start();
  };

  return { isListening, startListening };
}
