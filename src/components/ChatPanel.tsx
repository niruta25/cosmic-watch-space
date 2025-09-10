import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Satellite, Sun, AlertTriangle, Key } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "info" | "warning" | "data";
}

interface ChatPanelProps {
  impactedSatellites: any[];
}

export const ChatPanel = ({ impactedSatellites }: ChatPanelProps) => {
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
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
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

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyInput(false);
    }
  };

  const generateGroundedResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Ground responses with current system data
    if (lowerInput.includes("cme") || lowerInput.includes("impact") || lowerInput.includes("hit")) {
      const impactCount = impactedSatellites.length;
      if (impactCount > 0) {
        const nextImpact = impactedSatellites[0];
        return `Current CME analysis shows ${impactCount} satellites in the impact zone. The first satellite (${nextImpact?.name || 'SAT-1'}) is expected to be affected within the next few hours. Based on current solar wind velocity of ~450 km/s, the main CME arrival at Earth is forecast for approximately 2.5 hours from now.`;
      } else {
        return "Current CME tracking shows no satellites directly in the impact path at this time. However, continue monitoring as the CME cone expands during propagation.";
      }
    }
    
    if (lowerInput.includes("satellite") || lowerInput.includes("orbit")) {
      return `Currently tracking 8 satellites across different orbital regimes. Impact analysis shows ${impactedSatellites.length} satellites currently at risk from the active CME. LEO satellites have natural protection from Earth's magnetosphere, while GEO satellites are more vulnerable to charging effects.`;
    }
    
    if (lowerInput.includes("gps")) {
      return "GPS accuracy degradation is expected during the current geomagnetic disturbance. Position errors may increase from typical 3-meter accuracy to 10-50 meters during peak storm conditions. Aviation and precision surveying applications should implement backup navigation systems.";
    }
    
    return "Please refer to NOAA SWPC for official information.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      if (!apiKey) {
        throw new Error('API key required');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a space weather assistant for an educational monitoring system. You help users understand solar flares, CMEs, and satellite impacts. Always provide educational information but remind users to refer to NOAA SWPC for official alerts. Keep responses concise and technical but accessible.
              
Current system data:
- ${impactedSatellites.length} satellites currently in CME impact zone
- Active G2 geomagnetic storm in progress
- CME launched 18 hours ago, expected Earth arrival in ~2.5 hours

If asked about topics outside space weather, politely redirect to NOAA SWPC.`
            },
            {
              role: 'user',
              content: currentInput
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || generateGroundedResponse(currentInput);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        type: "info"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to grounded response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateGroundedResponse(currentInput),
        timestamp: new Date(),
        type: "info"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
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

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="p-4 border-t border-border bg-secondary/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">OpenAI API Key Required</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key..."
                className="flex-1 text-xs"
              />
              <Button 
                onClick={handleApiKeySubmit}
                disabled={!apiKey.trim()}
                size="sm"
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about solar weather, CMEs, or satellites..."
            className="flex-1"
            disabled={!apiKey}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || !apiKey}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!apiKey && (
          <p className="text-xs text-muted-foreground mt-1">
            Enter your OpenAI API key to enable the chatbot
          </p>
        )}
      </div>
    </div>
  );
};