'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { multilingualChatbotAssistance } from '@/ai/flows/multilingual-chatbot-assistance';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, LoaderCircle, Send, User, Wheat } from 'lucide-react';
import { VoiceInputButton } from './voice-input-button';
import { SpeakButton } from './speak-button';
import { useTranslations } from 'next-intl';

type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
};

const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'as', label: 'Assamese' },
    { value: 'bn', label: 'Bengali' },
    { value: 'brx', label: 'Bodo' },
    { value: 'doi', label: 'Dogri' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ks', label: 'Kashmiri' },
    { value: 'kok', label: 'Konkani' },
    { value: 'mai', label: 'Maithili' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mni', label: 'Manipuri' },
    { value: 'mr', label: 'Marathi' },
    { value: 'ne', label: 'Nepali' },
    { value: 'or', label: 'Odia' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'sa', label: 'Sanskrit' },
    { value: 'sat', label: 'Santali' },
    { value: 'sd', label: 'Sindhi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'ur', label: 'Urdu' },
    { value: 'ady', label: 'Adi' },
    { value: 'af', label: 'Afghani' },
    { value: 'mag', label: 'Magahi' },
    { value: 'hoc', label: 'Ho' },
    { value: 'awa', label: 'Awadhi' },
    { value: 'bh', label: 'Bhojpuri' },
    { value: 'bjj', label: 'Bajjika' },
    { value: 'bgc', label: 'Haryanvi' },
    { value: 'hne', label: 'Chhattisgarhi' },
    { value: 'gon', label: 'Gondi' },
    { value: 'kha', label: 'Khasi' },
    { value: 'lus', label: 'Lushai' },
    { value: 'kru', label: 'Kurukh' },
    { value: 'mun', label: 'Mundari' },
    { value: 'raj', label: 'Rajasthani' },
    { value: 'lif', label: 'Limbu' },
    { value: 'lep', label: 'Lepcha' },
    { value: 'btr', label: 'Baori' },
    { value: 'bhi', label: 'Bhili' },
    { value: 'dhd', label: 'Dhodia' },
    { value: 'gbm', label: 'Garhwali' },
    { value: 'kfy', label: 'Kumaoni' },
    { value: 'xnr', label: 'Kangri' },
    { value: 'kft', label: 'Gaddi' },
    { value: 'sck', label: 'Sadri' },
    { value: 'unr', label: 'Mundari' },
    { value: 'sdr', label: 'Oraon Sadri' },
    { value: 'sjp', label: 'Surjapuri' },
    { value: 'sm', label: 'Sema' },
    { value: 'njo', label: 'Ao' },
    { value: 'lmn', label: 'Lamgang' },
    { value: 'thl', label: 'Thadou' },
    { value: 'anp', label: 'Angika' },
    { value: 'bnp', label: 'Bishnupriya Manipuri' },
    { value: 'unx', label: 'Munda' },
    { value: 'crp', label: 'Creole' },
    { value: 'dra', label: 'Dravidian' },
    { value: 'grt', label: 'Garo' },
    { value: 'kfr', label: 'Kachhi' },
    { value: 'kfx', label: 'Koli' },
    { value: 'kxb', label: 'Kharia' },
    { value: 'lah', label: 'Lahnda' },
    { value: 'noe', label: 'Nimadi' },
    { value: 'pgg', label: 'Pangwali' },
    { value: 'pmy', label: 'Papuan' },
    { value: 'saora', label: 'Saora' },
    { value: 'sgw', label: 'Sebat Bet' },
    { value: 'skt', label: 'Sikkimese' },
    { value: 'srb', label: 'Sora' },
    { value: 'tbz', label: 'Tibetan' },
    { value: 'tcy', label: 'Tulu' },
    { value: 'trp', label: 'Tripuri' },
    { value: 'vgr', label: 'Vagri' },
    { value: 'wbk', label: 'Wa' },
    { value: 'yid', label: 'Yiddish' },
    { value: 'zyp', label: 'Zyphe' },
    { value: 'adp', label: 'Adap' },
    { value: 'anal', label: 'Anal' },
    { value: 'ao', label: 'Ao Naga' },
    { value: 'bgt', label: 'Bodo Gadaba' },
    { value: 'bhil', label: 'Bhili' },
    { value: 'chn', label: 'Chin' },
    { value: 'dim', label: 'Dimasa' },
    { value: 'gab', label: 'Gabadi' },
    { value: 'hal', label: 'Halabi' },
    { value: 'jra', label: 'Juang' },
    { value: 'karbi', label: 'Karbi' },
    { value: 'kch', label: 'Khasi' },
    { value: 'konda', label: 'Konda-Dora' },
    { value: 'kor', label: 'Korwa' },
    { value: 'kui', label: 'Kui' },
    { value: 'lad', label: 'Ladakhi' },
    { value: 'lotha', label: 'Lotha' },
    { value: 'malto', label: 'Malto' },
    { value: 'mik', label: 'Mikir' },
    { value: 'mis', label: 'Mishing' },
    { value: 'naga', label: 'Naga' },
    { value: 'par', label: 'Parji' },
    { value: 'rab', label: 'Rabha' },
    { value: 'reng', label: 'Rengma' },
    { value: 'shina', label: 'Shina' },
    { value: 'tang', label: 'Tangkhul' },
    { value: 'thado', label: 'Thado' },
    { value: 'vai', label: 'Vai' },
    { value: 'wan', label: 'Wancho' },
    { value: 'yere', label: 'Yere' },
    { value: 'zemi', label: 'Zemi' }
];

export default function Chatbot() {
  const t = useTranslations('Chatbot');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const response = await multilingualChatbotAssistance({ query: input, language });
      const botMessage: Message = { id: Date.now() + 1, role: 'bot', text: response.answer };
      setMessages((prev) => [...prev, botMessage]);
    });
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" size="icon">
          <Bot className="h-8 w-8" />
          <span className="sr-only">{t('openChatbot')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Wheat className="text-primary" /> {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] border-y" ref={scrollAreaRef}>
          <div className="p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'bot' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs rounded-lg p-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.text}</p>
                   {message.role === 'bot' && <SpeakButton textToSpeak={message.text} lang={language} />}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-primary">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs rounded-lg p-3 text-sm bg-muted flex items-center">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 sm:justify-start">
          <div className="flex w-full gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('inputPlaceholder')}
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                 <VoiceInputButton onTranscript={handleVoiceInput} lang={language} />
              </div>
            </div>
            <Button size="icon" onClick={handleSend} disabled={isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
