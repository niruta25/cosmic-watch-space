import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Satellite, Sun, AlertTriangle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "info" | "warning" | "data";
}

export const ChatPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to the Space Weather Monitor! I can help you understand solar flares, CME impacts, and satellite tracking. What would you like to know?",
      timestamp: new Date(),
      type: "info"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const predefinedResponses: Record<string, string> = {
    "cme impact": "Based on current solar wind data, the CME launched 18 hours ago is expected to reach Earth's magnetosphere in approximately 2.5 hours. Impact velocity: ~450 km/s. Geomagnetic storm level G2 (Moderate) is forecast.",
    "satellites": "Currently tracking 8 satellites in various orbits. 3 are in polar orbits (most vulnerable to solar particle events), 2 in GEO (sensitive to charging effects), and 3 in LEO (protected by Earth's magnetic field).",
    "gps": "During solar flares and geomagnetic storms, GPS accuracy can degrade due to ionospheric disturbances. Position errors may increase from ~3m to 10-50m. Aviation and surveying applications are most affected.",
    "solar flare": "The latest X2.1 solar flare occurred at 14:23 UTC from Active Region 3842. Associated CME launched at ~1200 km/s. Radio blackouts affecting HF communications on sunlit side of Earth.",
    "protection": "Satellite operators can implement protective measures: orienting solar panels edge-on to particle flux, powering down non-essential systems, and switching to radiation-hardened backup components."
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate processing time
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let response = "I understand you're asking about space weather. Let me provide some current data based on our monitoring systems.";
      let responseType: "info" | "warning" | "data" = "info";

      // Simple keyword matching for demo
      if (lowerInput.includes("cme") || lowerInput.includes("impact") || lowerInput.includes("hit")) {
        response = predefinedResponses["cme impact"];
        responseType = "warning";
      } else if (lowerInput.includes("satellite") || lowerInput.includes("orbit")) {
        response = predefinedResponses["satellites"];
        responseType = "data";
      } else if (lowerInput.includes("gps")) {
        response = predefinedResponses["gps"];
        responseType = "warning";
      } else if (lowerInput.includes("flare") || lowerInput.includes("solar")) {
        response = predefinedResponses["solar flare"];
        responseType = "warning";
      } else if (lowerInput.includes("protect") || lowerInput.includes("safe")) {
        response = predefinedResponses["protection"];
        responseType = "info";
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: responseType
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "When will the CME hit Earth?",
    "Which satellites are impacted?", 
    "What happens to GPS during solar flares?",
    "How can satellites protect themselves?"
  ];

  const MessageIcon = ({ role, type }: { role: string; type?: string }) => {
    if (role === "user") return <User className="w-4 h-4" />;
    
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-cme-warning" />;
      case "data":
        return <Satellite className="w-4 h-4 text-satellite" />;
      default:
        return <Bot className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Space Weather Assistant</h2>
          <Badge variant="secondary" className="ml-auto">Online</Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageIcon role={message.role} type={message.type} />
                <span>{message.role === "user" ? "You" : "Assistant"}</span>
                <span>{message.timestamp.toLocaleTimeString()}</span>
              </div>
              
              <Card className={`p-3 ${
                message.role === "user" 
                  ? "bg-primary/10 border-primary/20 ml-8" 
                  : "bg-secondary/10 border-secondary/20 mr-8"
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Bot className="w-4 h-4 text-primary animate-pulse" />
                <span>Assistant is typing...</span>
              </div>
              <Card className="p-3 bg-secondary/10 border-secondary/20 mr-8">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick questions:</p>
          <div className="grid grid-cols-1 gap-1">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => setInputValue(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about solar weather, CMEs, or satellites..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};