
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import ConfigurationModal from '@/components/ConfigurationModal';
import { 
  Sparkles, 
  Brain, 
  Search, 
  Zap, 
  Moon, 
  Sun, 
  Copy, 
  Download,
  ArrowRight,
  Loader2,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

const modes = {
  "deep_research": "the prompt will be used by deep researching agent, it should enhance the quality such I get best research report covering each and every detail",
  "clarity": "Rewrite the prompt so that the LLM will produce an extremely clear and unambiguous response. Eliminate vagueness, add specific details, and enforce a logical structure.",
  "depth": "Rewrite the prompt to guide the LLM toward a thoughtful, multi-layered response. Encourage analysis, rationale, and contextual depth.",
  "creative": "Rewrite the prompt so the LLM delivers a highly imaginative and expressive response. Encourage the use of vivid examples, analogies, metaphors, and creative language.",
  "technical": "Rewrite the prompt so that the LLM generates precise, technically accurate content using domain-specific terminology, clear step-by-step logic, and relevant technical context.",
  "concise": "Rewrite the prompt to guide the LLM toward a brief, direct, and efficient response that retains clarity while reducing unnecessary verbosity.",
  "structured": "Rewrite the prompt to instruct the LLM to format the response cleanly, using bullet points, markdown tables, hierarchical sections, and clear headings.",
  "teaching": "Rewrite the prompt so that the LLM explains the topic progressively, with simple analogies, examples, and concepts tailored for a learning audience, including beginners.",
  "executive_summary": "Rewrite the prompt to elicit a high-level summary optimized for decision-makers. Prioritize key takeaways, actionable insights, and strategic framing.",
  "contrarian": "Rewrite the prompt to guide the LLM toward challenging conventional thinking. Encourage it to provide counterpoints, critique assumptions, and present alternative perspectives.",
  "step_by_step": "Rewrite the prompt to instruct the LLM to break down the response into clear, ordered steps or phases, with detailed explanations for each.",
  "journalistic": "Rewrite the prompt to elicit a response in the tone and structure of investigative or analytical journalism, including critical analysis, source-based reasoning, and consideration of bias.",
  "socratic": "Rewrite the prompt to instruct the LLM to ask probing, thought-provoking questions instead of providing direct answers—encouraging reflective or critical thinking from the user.",
  "controversial": "Rewrite the prompt to provoke the most controversial, unconventional, or polarizing response the LLM can generate. Push against mainstream assumptions while maintaining logical structure and factual support.",
  "devil_advocate": "Rewrite the prompt to make the LLM take a strong opposing stance or play devil's advocate. Encourage it to argue against popular opinion or the user's assumed position using logic, evidence, or satire.",
  "debate_ready": "Rewrite the prompt so that the LLM structures its answer like a formal argument — clearly outlining opposing viewpoints, rebuttals, and conclusion.",
  "startup_pitch": "Rewrite the prompt to generate a polished, concise startup pitch. Include value proposition, problem/solution, market fit, and potential differentiation.",
  "real_world_applications": "Rewrite the prompt to guide the LLM toward output that maps theoretical ideas to real-world use cases, industries, or everyday scenarios.",
  "personal_growth": "Rewrite the prompt so the LLM provides actionable advice, reflection prompts, and behavioral frameworks for improving mindset, habits, or emotional resilience.",
  "marketing_landing_page": "Rewrite the prompt to produce marketing copy suitable for a product or service landing page. Include headline, problem/solution framing, benefits, CTA, and testimonials.",
  "socratic_reverse": "Rewrite the prompt to make the LLM ask a sequence of layered, increasingly specific questions back to the user in order to clarify the problem or uncover blind spots.",
  "satirical": "Rewrite the prompt so that the LLM responds with sarcasm, exaggeration, or parody — in the style of satirical commentary or mockery of the topic."
};

const popularModes = ['clarity', 'controversial', 'deep_research'];

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [customStyle, setCustomStyle] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Check if API keys are configured
    const config = localStorage.getItem('promptlab_config');
    if (config) {
      try {
        const parsed = JSON.parse(config);
        setIsConfigured(!!parsed.googleApiKey);
      } catch (e) {
        setIsConfigured(false);
      }
    }
  }, []);

  const handleModeSelect = (mode: string) => {
    setCustomStyle(modes[mode as keyof typeof modes]);
    setSelectedMode(mode);
  };

  const handleOptimize = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "You need to provide a prompt to optimize.",
        variant: "destructive"
      });
      return;
    }

    // Check if configured
    if (!isConfigured) {
      setShowConfigModal(true);
      return;
    }

    const modeToUse = selectedMode || (customStyle ? 'custom' : 'clarity');
    
    setIsOptimizing(true);
    setIsStreaming(true);
    setStreamedContent('');
    
    try {
      // Get config from localStorage
      const config = JSON.parse(localStorage.getItem('promptlab_config') || '{}');
      
      // Call Google Gemini API directly
      const systemPrompt = customStyle || modes[selectedMode as keyof typeof modes] || modes.clarity;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${config.googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nOriginal prompt to optimize: "${originalPrompt}"\n\nPlease provide only the optimized prompt without any additional explanation or formatting.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Optimization failed');
      }

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to optimize prompt';
      
      // Simulate streaming effect for better UX
      let displayText = '';
      for (let i = 0; i < result.length; i++) {
        displayText += result[i];
        setStreamedContent(displayText);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      setOptimizedPrompt(result);
      
      toast({
        title: "Prompt optimized successfully!",
        description: "Your prompt has been enhanced and is ready to use."
      });
      
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization failed",
        description: "There was an error optimizing your prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
      setIsStreaming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard."
    });
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border/40 backdrop-blur-xl bg-background/50 sticky top-0 z-50"
        >
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  PromptLab
                </h1>
                <p className="text-sm text-muted-foreground">Next-gen prompt optimization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>Optimization Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Custom Style Input */}
                  <div className="space-y-3">
                    <Label htmlFor="custom-style" className="text-sm font-medium">
                      Custom Optimization Style
                    </Label>
                    <Textarea
                      id="custom-style"
                      placeholder="Describe how you want the LLM to behave... e.g., 'I want comprehensive and controversial output'"
                      value={customStyle}
                      onChange={(e) => setCustomStyle(e.target.value)}
                      className="min-h-[100px] bg-background/50 border-border/40 focus:border-primary/50 transition-all duration-300"
                    />
                  </div>

                  {/* Popular Modes */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <Label className="text-sm font-medium">Popular Modes</Label>
                       <Select value={selectedMode} onValueChange={handleModeSelect}>
                         <SelectTrigger className="w-[200px] bg-background/50">
                           <SelectValue placeholder="Other Modes" />
                         </SelectTrigger>
                        <SelectContent>
                          {Object.keys(modes).filter(mode => !popularModes.includes(mode)).map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {mode.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {popularModes.map((mode) => (
                        <motion.div
                          key={mode}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={selectedMode === mode ? "default" : "secondary"}
                            className={`cursor-pointer px-4 py-2 text-sm transition-all duration-300 ${
                              selectedMode === mode 
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                                : 'hover:bg-primary/10 hover:border-primary/20'
                            }`}
                            onClick={() => handleModeSelect(mode)}
                          >
                            {mode.replace('_', ' ')}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Original Prompt */}
                  <div className="space-y-3">
                    <Label htmlFor="original-prompt" className="text-sm font-medium">
                      Your Prompt
                    </Label>
                    <Textarea
                      id="original-prompt"
                      placeholder="Enter the prompt you want to optimize..."
                      value={originalPrompt}
                      onChange={(e) => setOriginalPrompt(e.target.value)}
                      className="min-h-[120px] bg-background/50 border-border/40 focus:border-primary/50 transition-all duration-300"
                    />
                  </div>

                  {/* Optimize Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleOptimize}
                      disabled={isOptimizing || !originalPrompt.trim()}
                      className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all duration-300"
                    >
                      {isOptimizing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Optimize Prompt
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence>
              {(optimizedPrompt || isStreaming) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2 text-xl">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span>Optimized Prompt</span>
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(optimizedPrompt)}
                            className="bg-background/50"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="bg-background/50"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Explain
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-background/30 rounded-lg p-4 border border-border/40">
                        <ScrollArea className="h-[300px]">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="prose prose-sm dark:prose-invert max-w-none"
                          >
                            {isStreaming ? (
                              <div className="space-y-2">
                                {streamedContent}
                                <motion.span
                                  animate={{ opacity: [1, 0] }}
                                  transition={{ repeat: Infinity, duration: 0.8 }}
                                  className="inline-block w-2 h-5 bg-primary rounded"
                                />
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                                {optimizedPrompt}
                              </p>
                            )}
                          </motion.div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation Section */}
            <AnimatePresence>
              {showExplanation && explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2 text-xl">
                        <Brain className="h-5 w-5 text-primary" />
                        <span>Prompt Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="strengths" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-background/50">
                          <TabsTrigger value="strengths">Strengths</TabsTrigger>
                          <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
                          <TabsTrigger value="improvements">Improvements</TabsTrigger>
                          <TabsTrigger value="tips">Tips</TabsTrigger>
                        </TabsList>
                        <TabsContent value="strengths" className="mt-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-green-600">Original Prompt Strengths</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li>• Clear intent and purpose</li>
                              <li>• Specific topic focus</li>
                            </ul>
                          </div>
                        </TabsContent>
                        {/* Add other tab contents similarly */}
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Configuration Modal */}
        <ConfigurationModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onConfigured={() => setIsConfigured(true)}
        />
      </div>
    </div>
  );
};

export default Index;
