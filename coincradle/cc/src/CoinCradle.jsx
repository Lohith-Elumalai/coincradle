import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';

export default function CoinCradle() {
  const [messages, setMessages] = useState([
    { text: 'Hello! I am your AI financial assistant. How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    // Dummy AI Response
    const botReply = { text: "That's a great question! I'm still learning, but I can provide basic budgeting tips.", sender: 'bot' };
    setTimeout(() => setMessages((prev) => [...prev, botReply]), 1000);

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">CoinCradle</h1>
      <Card className="w-full max-w-2xl">
        <CardContent className="p-4 space-y-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>              
              <div className={`p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-4 w-full max-w-2xl flex items-center space-x-2">
        <Input
          placeholder="Ask your financial assistant..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
