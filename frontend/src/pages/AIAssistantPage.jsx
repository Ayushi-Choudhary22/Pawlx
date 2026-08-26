import { useRef, useState, useEffect } from 'react';
import { FiSend, FiZap, FiAlertTriangle } from 'react-icons/fi';
import { aiService } from '@/services/miscServices';
import { usePets } from '@/hooks/usePets';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';

const TOPIC_CHIPS = [
  { label: 'Breed Info', value: 'breed_info' },
  { label: 'Diet Planner', value: 'diet_planner' },
  { label: 'Symptom Checker', value: 'symptom_checker' },
  { label: 'General Tips', value: 'general' },
];

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [historyId, setHistoryId] = useState(null);
  const [topic, setTopic] = useState('general');
  const [petId, setPetId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { pets } = usePets();
  const { showToast } = useToast();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await aiService.sendMessage({ content: input, topic, historyId, petId: petId || undefined });
      setHistoryId(res.data._id);
      setMessages(res.data.messages);
    } catch (error) {
      showToast(error.response?.data?.message || 'AI Assistant is unavailable right now', 'error');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  const startNewConversation = (nextPetId) => {
    setPetId(nextPetId);
    setHistoryId(null);
    setMessages([]);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 mb-2">
        <FiZap className="text-primary" size={18} />
        <h1 className="text-xl font-bold text-ink">AI Pet Assistant</h1>
      </div>

      <div className="flex items-start gap-2 bg-accent-light text-accent-dark text-xs rounded-lg px-3.5 py-2.5 mb-4">
        <FiAlertTriangle size={14} className="shrink-0 mt-0.5" />
        <span>
          This assistant offers general guidance only and never diagnoses conditions. Always consult a licensed
          veterinarian for medical concerns, and seek emergency care immediately if your pet is in distress.
        </span>
      </div>

      {pets.length > 0 && (
        <div className="mb-4">
          <label className="text-xs font-medium text-ink-muted mb-1.5 block">Asking about</label>
          <select
            className="input text-sm max-w-xs"
            value={petId}
            onChange={(e) => startNewConversation(e.target.value)}
          >
            <option value="">General questions (no specific pet)</option>
            {pets.map((pet) => (
              <option key={pet._id} value={pet._id}>{pet.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {TOPIC_CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setTopic(chip.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              topic === chip.value ? 'bg-primary text-white' : 'bg-white border border-border text-ink-muted'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto card p-5 mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-ink-muted text-sm">
            {petId
              ? `Ask me anything about ${pets.find((p) => p._id === petId)?.name}'s diet, breed, or wellness.`
              : "Ask me anything about your pet's diet, breed, or general wellness."}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface text-ink'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about diet, breed traits, or general care..."
          className="input"
        />
        <Button onClick={sendMessage} isLoading={isSending} icon={<FiSend size={15} />}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default AIAssistantPage;
