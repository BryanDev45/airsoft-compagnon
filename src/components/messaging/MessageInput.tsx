import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping, disabled = false }) => {
  const [newMessage, setNewMessage] = useState('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (newMessage.length > 0) {
      onTyping(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        onTyping(false);
      }, 3000);
    } else {
      onTyping(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [newMessage, onTyping]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || disabled) return;
    
    onTyping(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t bg-gradient-to-r from-white via-gray-50/30 to-white backdrop-blur-sm">
      <div className="flex gap-2 sm:gap-4 items-end w-full max-w-none">
        <div className="flex-1 relative">
          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            placeholder="Tapez votre message..." 
            disabled={disabled}
            className="w-full pr-4 py-3 sm:py-4 text-base rounded-3xl border-gray-200 bg-white/90 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-airsoft-red/20 focus:border-airsoft-red transition-all duration-200 resize-none min-h-[48px] sm:min-h-[56px]"
          />
        </div>
        <Button 
          type="submit" 
          size="icon" 
          disabled={!newMessage.trim() || disabled} 
          className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0"
        >
          <Send className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
