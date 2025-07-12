
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ModeSelectorProps {
  modes: Record<string, string>;
  popularModes: string[];
  selectedMode: string;
  onModeSelect: (mode: string) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  modes,
  popularModes,
  selectedMode,
  onModeSelect
}) => {
  const otherModes = Object.keys(modes).filter(mode => !popularModes.includes(mode));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Popular Modes</Label>
        <Select value={selectedMode} onValueChange={onModeSelect}>
          <SelectTrigger className="w-[200px] bg-background/50 border-border/40">
            <SelectValue placeholder="Other Modes" />
          </SelectTrigger>
          <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/40">
            {otherModes.map((mode) => (
              <SelectItem 
                key={mode} 
                value={mode}
                className="hover:bg-accent/50"
              >
                <span className="capitalize">{mode.replace('_', ' ')}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {popularModes.map((mode, index) => (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={selectedMode === mode ? "default" : "secondary"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all duration-300 ${
                selectedMode === mode 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-primary' 
                  : 'hover:bg-primary/10 hover:border-primary/20 bg-background/50'
              }`}
              onClick={() => onModeSelect(mode)}
            >
              <span className="capitalize">{mode.replace('_', ' ')}</span>
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;
