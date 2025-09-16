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
import { Bot, LoaderCircle, Send, User, Wheat } from 'lucide-react';
import { VoiceInputButton } from './voice-input-button';
import { SpeakButton } from './speak-button';
import {useTranslations, useLocale} from 'next-intl';

type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
};

export default function Chatbot() {
  const t = useTranslations('Chatbot');
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
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
      const response = await multilingualChatbotAssistance({ query: input, language: locale });
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
                   {message.role === 'bot' && <SpeakButton textToSpeak={message.text} />}
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
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('inputPlaceholder')}
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                 <VoiceInputButton onTranscript={handleVoiceInput} />
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
