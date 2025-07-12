import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Settings, Key, Save, AlertCircle } from 'lucide-react';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

interface ApiConfig {
  googleApiKey: string;
  supabaseUrl: string;
  supabaseKey: string;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ isOpen, onClose, onConfigured }) => {
  const [config, setConfig] = useState<ApiConfig>({
    googleApiKey: '',
    supabaseUrl: '',
    supabaseKey: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load existing config from localStorage
      const saved = localStorage.getItem('promptlab_config');
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved config:', e);
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!config.googleApiKey.trim()) {
      toast({
        title: "Missing Google API Key",
        description: "Please provide your Google API key to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('promptlab_config', JSON.stringify(config));
      
      toast({
        title: "Configuration saved",
        description: "Your API keys have been saved securely in your browser."
      });
      
      onConfigured();
      onClose();
    } catch (error) {
      toast({
        title: "Failed to save configuration",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ApiConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/40">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Settings className="h-5 w-5 text-primary" />
            <span>API Configuration</span>
          </DialogTitle>
          <DialogDescription>
            Configure your API keys to start optimizing prompts. Keys are stored securely in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="border-amber-200/20 bg-amber-50/5">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Security Notice
                  </p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                    Your API keys are stored locally in your browser and never sent to our servers. 
                    For production use, consider using Supabase Edge Functions instead.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google-api-key" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Google API Key *</span>
              </Label>
              <Input
                id="google-api-key"
                type="password"
                placeholder="Enter your Google Gemini API key"
                value={config.googleApiKey}
                onChange={(e) => handleInputChange('googleApiKey', e.target.value)}
                className="bg-background/50 border-border/40 focus:border-primary/50"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-url" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Supabase URL (Optional)</span>
              </Label>
              <Input
                id="supabase-url"
                placeholder="https://your-project.supabase.co"
                value={config.supabaseUrl}
                onChange={(e) => handleInputChange('supabaseUrl', e.target.value)}
                className="bg-background/50 border-border/40 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-key" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Supabase Anon Key (Optional)</span>
              </Label>
              <Input
                id="supabase-key"
                type="password"
                placeholder="Enter your Supabase anonymous key"
                value={config.supabaseKey}
                onChange={(e) => handleInputChange('supabaseKey', e.target.value)}
                className="bg-background/50 border-border/40 focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSave}
                disabled={isSaving || !config.googleApiKey.trim()}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Save className="h-4 w-4" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;