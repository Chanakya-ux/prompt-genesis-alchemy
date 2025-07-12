
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, MessageSquare, Download, Sparkles } from 'lucide-react';
import StreamingText from './StreamingText';

interface OptimizedPromptDisplayProps {
  optimizedPrompt: string;
  isStreaming: boolean;
  streamedContent: string;
  onCopy: () => void;
  onExplain: () => void;
  onDownload?: () => void;
}

const OptimizedPromptDisplay: React.FC<OptimizedPromptDisplayProps> = ({
  optimizedPrompt,
  isStreaming,
  streamedContent,
  onCopy,
  onExplain,
  onDownload
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Optimized Prompt
              </span>
            </CardTitle>
            <div className="flex space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCopy}
                  className="bg-background/50 border-border/40 hover:bg-background/80 transition-all duration-300"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExplain}
                  className="bg-background/50 border-border/40 hover:bg-background/80 transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Explain
                </Button>
              </motion.div>
              {onDownload && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownload}
                    className="bg-background/50 border-border/40 hover:bg-background/80 transition-all duration-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-background/30 rounded-xl p-6 border border-border/40 backdrop-blur-sm">
            <ScrollArea className="h-[350px] pr-4">
              {isStreaming ? (
                <StreamingText
                  text={streamedContent}
                  speed={30}
                  className="text-foreground leading-relaxed text-sm"
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="prose prose-sm dark:prose-invert max-w-none"
                >
                  <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-sm">
                    {optimizedPrompt}
                  </p>
                </motion.div>
              )}
            </ScrollArea>
          </div>
          
          {/* Metrics Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex space-x-4">
              <span>Characters: {optimizedPrompt.length}</span>
              <span>Words: {optimizedPrompt.split(' ').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Ready to use</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OptimizedPromptDisplay;
