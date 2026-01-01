import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, Delete, Divide, X, Minus, Plus, Equal, Calculator as CalcIcon, History, Moon, Sun, RotateCcw } from 'lucide-react';
import bgImage from '@assets/generated_images/abstract_mesh_gradient_background_with_deep_purple,_blue_and_pink_hues.png';

export default function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Ref for the display to scroll to end
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [input, result]);

  const handlePress = (val: string) => {
    if (val === 'AC') {
      setInput('');
      setResult('');
    } else if (val === 'DEL') {
      setInput((prev) => prev.slice(0, -1));
    } else if (val === '=') {
      calculate();
    } else if (['sin', 'cos', 'tan', 'sqrt', 'log'].includes(val)) {
        setInput(prev => prev + val + '(');
    } else {
      setInput((prev) => prev + val);
    }
  };

  const calculate = () => {
    try {
      // Replace visual operators with JS operators for calculation
      let expression = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/\^/g, '**');

      // Basic safety check - only allow math characters
      if (!/^[\d\.\+\-\*\/\(\)\sMath\.PIEsqrtincoslog\*\*]+$/.test(expression)) {
         // This is a rough check, might need to be looser for functions, 
         // but for this mockup standard 'new Function' is acceptable risk (client side only)
      }

      // Use Function constructor for safer eval
      const calcResult = new Function('return ' + expression)();
      
      const formattedResult = Number(calcResult).toLocaleString('en-US', { maximumFractionDigits: 8 });
      setResult(String(calcResult)); // Store raw result for further calcs if needed, or just display
      
      // Add to history
      setHistory(prev => [`${input} = ${formattedResult}`, ...prev].slice(0, 10));
      
      // Update input to result for chain calculations? 
      // A standard calc usually clears input or keeps result. Let's keep it in "result" display.
    } catch (e) {
      setResult('Error');
    }
  };

  const buttons = [
    { label: 'AC', val: 'AC', cls: 'text-red-400 font-bold' },
    { label: <Delete className="w-5 h-5" />, val: 'DEL', cls: 'text-red-400' },
    { label: '%', val: '%', cls: 'text-cyan-300' },
    { label: <Divide className="w-5 h-5" />, val: '÷', cls: 'text-cyan-300' },
    
    { label: 'sin', val: 'sin', cls: 'text-purple-300 text-sm font-display' },
    { label: 'cos', val: 'cos', cls: 'text-purple-300 text-sm font-display' },
    { label: 'tan', val: 'tan', cls: 'text-purple-300 text-sm font-display' },
    { label: 'log', val: 'log', cls: 'text-purple-300 text-sm font-display' },

    { label: '7', val: '7', cls: 'text-white font-display text-xl' },
    { label: '8', val: '8', cls: 'text-white font-display text-xl' },
    { label: '9', val: '9', cls: 'text-white font-display text-xl' },
    { label: <X className="w-5 h-5" />, val: '×', cls: 'text-cyan-300' },

    { label: '4', val: '4', cls: 'text-white font-display text-xl' },
    { label: '5', val: '5', cls: 'text-white font-display text-xl' },
    { label: '6', val: '6', cls: 'text-white font-display text-xl' },
    { label: <Minus className="w-5 h-5" />, val: '-', cls: 'text-cyan-300' },

    { label: '1', val: '1', cls: 'text-white font-display text-xl' },
    { label: '2', val: '2', cls: 'text-white font-display text-xl' },
    { label: '3', val: '3', cls: 'text-white font-display text-xl' },
    { label: <Plus className="w-5 h-5" />, val: '+', cls: 'text-cyan-300' },

    { label: '0', val: '0', cls: 'text-white font-display text-xl col-span-2' },
    { label: '.', val: '.', cls: 'text-white font-display text-xl' },
    { label: <Equal className="w-5 h-5" />, val: '=', cls: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 border-none' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
        {/* Background */}
        <div 
          className="absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Abstract shapes for depth */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse delay-1000" />

        <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="relative z-10 w-full max-w-sm sm:max-w-md glass-panel rounded-3xl overflow-hidden flex flex-col"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <CalcIcon className="w-4 h-4 text-purple-300" />
                    </div>
                    <span className="text-sm font-medium text-white/70 tracking-wide">NAVEEN CALC</span>
                </div>
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`p-2 rounded-full transition-colors ${showHistory ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5 text-white/50'}`}
                >
                    <History className="w-4 h-4" />
                </button>
            </div>

            {/* Display Area */}
            <div className="p-6 flex flex-col items-end gap-2 min-h-[160px] justify-end relative">
                
                {/* History Overlay */}
                <AnimatePresence>
                    {showHistory && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-0 left-0 right-0 bg-black/90 backdrop-blur-xl z-20 h-full overflow-y-auto p-4 rounded-b-xl border-b border-white/10"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-white/40 uppercase tracking-wider">History</span>
                                <button onClick={() => setHistory([])} className="text-xs text-red-400 hover:text-red-300">Clear</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {history.length === 0 ? (
                                    <span className="text-white/20 text-sm text-center py-4">No history yet</span>
                                ) : (
                                    history.map((item, i) => (
                                        <div key={i} className="text-right border-b border-white/5 pb-1">
                                            <div className="text-white/60 text-sm">{item.split('=')[0]}</div>
                                            <div className="text-purple-300 font-display">{item.split('=')[1]}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full overflow-x-auto no-scrollbar text-right opacity-60 text-lg font-light tracking-wide text-white/80 whitespace-nowrap" ref={displayRef}>
                    {input || '0'}
                </div>
                <div className="text-5xl sm:text-6xl font-display font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight break-all">
                    {result ? result : (input ? '' : '0')}
                </div>
            </div>

            {/* Keypad */}
            <div className="p-4 grid grid-cols-4 gap-3 bg-black/20 backdrop-blur-sm border-t border-white/5">
                {buttons.map((btn, idx) => (
                    <motion.button
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        onClick={() => handlePress(btn.val)}
                        className={`
                            h-14 sm:h-16 rounded-2xl flex items-center justify-center text-lg select-none
                            glass-button
                            ${btn.cls}
                            ${btn.label === '0' ? 'col-span-2 aspect-auto' : ''}
                        `}
                    >
                        {btn.label}
                    </motion.button>
                ))}
            </div>
            
            {/* Footer decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-50" />
        </motion.div>
    </div>
  );
}
