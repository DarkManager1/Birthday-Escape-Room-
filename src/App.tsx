/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Lock, Sparkles, Send, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as confetti from 'canvas-confetti';

const STAGES = [
  {
    hint: 'המסע מתחיל במקום שבו נוחתות הבשורות. חפשי את שמך על התיבה.',
    password: 'START',
    image: 'https://i.ibb.co/WNdVrHDn/Whats-App-Image-2026-03-09-at-11-13-04-PM.jpg'
  },
  {
    hint: 'בתוך אחד הכדים הגדולים בחצר, בין העלים הירוקים שמחכים לגשם. מחכה הפתעה טעימה!',
    password: 'BURGER',
    image: 'https://i.ibb.co/KY3qmth/Whats-App-Image-2026-03-09-at-11-13-56-PM-1.jpg'
  },
  {
    hint: 'השומרים עם המקור כבר מחכים לך. תגשי אליהם אבל מבלי להעיר אותם!',
    password: 'GOOSE',
    image: 'https://i.ibb.co/YBRQpN4T/Whats-App-Image-2026-03-09-at-11-13-40-PM.jpg'
  },
  {
    hint: 'באמצעות הרגליים שלנו ניתן לעלות שם ולגלות קומות חדשות, בלובי המקום, מחכה הפתעה שתפיל אותך מהרגליים!',
    password: 'MOVIE',
    image: 'https://i.ibb.co/Z11hpD9y/Whats-App-Image-2026-03-10-at-8-48-26-PM.jpg'
  },
  {
    hint: 'כדי להיכנס הביתה כולם לוחצים עליי, בסביבתי מחכה לך הפתעה שלא תוכלי לסרב לה!',
    password: 'STYLE',
    image: 'https://i.ibb.co/Ng6b9x6K/Whats-App-Image-2026-03-10-at-8-48-26-PM-2.jpg'
  },
  {
    hint: 'זוכרת את המקום בו הרומנטיקה נולדה מחדש? ...אם תעלי לשם.. אולי תגלי את האמת.',
    password: 'TRUTH',
    image: 'https://i.ibb.co/Jj4k0ntb/Whats-App-Image-2026-03-10-at-8-55-14-PM.jpg'
  },
  {
    hint: 'בתור בן הזוג שלך, הגיע הזמן שאבחן אותך, איפשהו בקומה 14 מחכה הפתעה שעוד אתחרט עליה.... .',
    password: 'TICKLE',
    image: 'https://i.ibb.co/5xt2wwLD/Whats-App-Image-2026-03-10-at-8-48-26-PM-1.jpg'
  },
  {
    hint: 'ישנו מקום אחד בו נמצאים גלגלים שמסוגלים להוביל אותך לכל מקום אם יש לך מספיק כוח.',
    password: 'FREE',
    image: 'https://i.ibb.co/spTPM8nG/Whats-App-Image-2026-03-10-at-9-35-41-PM.jpg'
  },
  {
    hint: 'אני כבר רואה איך תתעללי בי עם כל המתנות האלו שזכית לקבל... איפשהו בחדר המדרגות באחת הקומות אולי תמצאי משהו שיכול לעניין אותך.',
    password: 'SURPRISE',
    image: 'https://i.ibb.co/6RHxG3rb/Whats-App-Image-2026-03-10-at-9-23-35-PM.jpg'
  },
  {
    hint: 'ממ לא רע הצלחת להגיע עד לשלב האחרון במשחק שלי, הגיע הזמן שתחזרי לממלכה, כשתחזרי, הייתי ממליץ לבדוק אם מתחבא פרס בשטיח הכניסה או מסביבו.',
    password: 'KEY',
    image: 'https://i.ibb.co/0R9CkzXR/Whats-App-Image-2026-03-10-at-9-35-28-PM.jpg'
  }
];

const FINALE = 'מזל טוב! סיימת את כל המשימות בהצלחה. יום הולדת שמח אהובה שלי, אני אוהב אותך!';
const ADMIN_CODE = 'אברבנל שלום';

const SOUNDS = {
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  ERROR: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  FINISH: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

const ERROR_MESSAGES = [
  'Nice try, Sherlock! Keep looking!',
  'Almost there... but not quite!',
  'Wrong key for this heart, try again!',
  'Is that your final answer? Because it is wrong!',
  'Nope! The mystery continues...',
  'Try harder, my love!'
];

export default function App() {
  const [currentStage, setCurrentStage] = useState(() => {
    try {
      const saved = localStorage.getItem('escape_room_stage');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFinished, setIsFinished] = useState(() => {
    try {
      return localStorage.getItem('escape_room_finished') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [skippedStages, setSkippedStages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('escape_room_skipped');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('escape_room_admin') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('escape_room_stage', currentStage.toString());
      localStorage.setItem('escape_room_skipped', JSON.stringify(skippedStages));
      localStorage.setItem('escape_room_finished', isFinished.toString());
      localStorage.setItem('escape_room_admin', isAdmin.toString());
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [currentStage, skippedStages, isFinished, isAdmin]);

  const triggerConfetti = useCallback(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      (confetti as any)({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      (confetti as any)({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  useEffect(() => {
    if (isFinished && skippedStages.length === 0) {
      triggerConfetti();
    }
  }, [isFinished, skippedStages.length, triggerConfetti]);

  const playSound = (url: string) => {
    try {
      const audio = new Audio(url);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().toUpperCase() === STAGES[currentStage].password) {
      playSound(SOUNDS.SUCCESS);
      setIsSuccess(true);
      setError('');
      setSkippedStages(prev => prev.filter(i => i !== currentStage));
      setTimeout(() => {
        setIsSuccess(false);
        setPassword('');
        if (currentStage < STAGES.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setIsFinished(true);
          playSound(SOUNDS.FINISH);
        }
      }, 1500);
    } else {
      playSound(SOUNDS.ERROR);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      const randomMsg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
      setError(randomMsg);
      setPassword('');
    }
  };

  const handleSkip = () => {
    if (!isAdmin) {
      setShowAdminModal(true);
      return;
    }
    
    if (!skippedStages.includes(currentStage)) {
      setSkippedStages(prev => [...prev, currentStage]);
    }
    setError('');
    setPassword('');
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      setIsFinished(true);
      playSound(SOUNDS.FINISH);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInput === ADMIN_CODE) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminInput('');
      setAdminError(false);
      // Automatically trigger skip after successful login
      handleSkip();
    } else {
      setAdminError(true);
      playSound(SOUNDS.ERROR);
      setTimeout(() => setAdminError(false), 500);
    }
  };

  const revisitStage = (index: number) => {
    setCurrentStage(index);
    setIsFinished(false);
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Animated Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-rose-600 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-amber-500 blur-[120px] rounded-full" 
        />
        
        {/* Center Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)]" />
      </div>

      <div className="w-full max-w-2xl z-10">
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-rose-400 via-amber-200 to-rose-400 bg-clip-text text-transparent">
            Happy Birthday - The Building Mission
          </h1>
          <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-semibold">
            Stage {isFinished ? STAGES.length + 1 : currentStage + 1} of {STAGES.length + 1}
          </p>
        </header>

        <main className="relative">
          <AnimatePresence>
            {showAdminModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-sm p-8 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-3 rounded-full bg-rose-500/20">
                      <Lock className="w-6 h-6 text-rose-500" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-center text-white">Admin Access</h3>
                  <p className="mb-6 text-sm text-center text-slate-500">Enter the admin code to unlock skip privileges.</p>
                  
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <motion.div animate={adminError ? { x: [-5, 5, -5, 5, 0] } : {}}>
                      <input
                        type="password"
                        value={adminInput}
                        onChange={(e) => setAdminInput(e.target.value)}
                        placeholder="Admin Code..."
                        className="w-full px-4 py-3 text-center transition-all border bg-slate-950 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        autoFocus
                      />
                    </motion.div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAdminModal(false)}
                        className="flex-1 py-3 text-sm font-bold transition-all bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 text-sm font-bold text-white transition-all bg-rose-600 rounded-xl hover:bg-rose-500"
                      >
                        Unlock
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div 
                key="active-game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden"
              >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  />
                </div>

                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-rose-500/20 backdrop-blur-md flex flex-col items-center justify-center z-20"
                  >
                    <motion.h2 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-white"
                    >
                      Success!
                    </motion.h2>
                    <p className="text-rose-100">Unlocking next hint...</p>
                  </motion.div>
                )}

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4 text-amber-400/80">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Current Hint</span>
                  </div>
                  
                  {STAGES[currentStage].image && (
                    <div className="relative mb-8 group">
                      {/* Background Aura/Glow */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                      
                      {/* Blurred Image Background */}
                      <div className="absolute inset-0 overflow-hidden rounded-3xl blur-xl opacity-30 scale-105 pointer-events-none">
                        <img 
                          src={STAGES[currentStage].image} 
                          alt="" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <motion.div 
                        key={STAGES[currentStage].image}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl overflow-hidden border-2 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.25)] aspect-video md:aspect-auto relative p-1.5 bg-gradient-to-br from-rose-500/40 via-slate-800 to-amber-500/40"
                      >
                        <div className="rounded-2xl overflow-hidden relative h-full w-full bg-slate-900">
                          <motion.img 
                            src={STAGES[currentStage].image} 
                            alt="Memory" 
                            className="w-full h-full md:h-72 object-cover transition-transform duration-1000 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          {/* Romantic Soft Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-rose-500/10 pointer-events-none" />
                          
                          {/* Subtle Inner Glow */}
                          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                          
                          {/* Decorative Corner Accents */}
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-rose-400/60 rounded-tl-md pointer-events-none" />
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-rose-400/60 rounded-br-md pointer-events-none" />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  <motion.p 
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-xl md:text-2xl leading-relaxed text-slate-200 text-right" 
                    dir="rtl"
                  >
                    {STAGES[currentStage].hint}
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password..."
                      className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 px-6 text-lg focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-slate-700 uppercase tracking-widest"
                    />
                  </motion.div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-rose-400 text-sm font-medium text-center italic"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] text-lg"
                    >
                      <span>Unlock Hint</span>
                      <Send className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSkip}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] border border-white/5"
                    >
                      <span>Skip Stage (Can Revisit Later)</span>
                    </button>
                  </div>
                </form>

                {skippedStages.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Skipped Stages</p>
                    <div className="flex flex-wrap gap-2">
                      {skippedStages.map((index) => (
                        <button
                          key={index}
                          onClick={() => revisitStage(index)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            currentStage === index 
                              ? 'bg-rose-500 text-white' 
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          Stage {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="finale"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400" />
                
                <div className="mb-8 flex justify-center">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-amber-400/20 p-6 rounded-full"
                  >
                    <Trophy className="w-16 h-16 text-amber-400" />
                  </motion.div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-400">Mission Accomplished!</h2>
                
                {skippedStages.length > 0 ? (
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 mb-8">
                    <p className="text-lg leading-relaxed text-slate-300 mb-6">
                      You've reached the end, but you skipped some challenges! 
                      Solve them all to unlock the final message.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {skippedStages.map((index) => (
                        <button
                          key={index}
                          onClick={() => revisitStage(index)}
                          className="px-6 py-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl border border-rose-500/30 font-bold transition-all active:scale-95"
                        >
                          Solve Stage {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 mb-8">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-xl md:text-2xl leading-relaxed text-slate-200 text-right" 
                      dir="rtl"
                    >
                      {FINALE}
                    </motion.p>
                  </div>
                )}

                <p className="text-slate-500 italic">
                  Happy Birthday, my love. You are my greatest discovery.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-12 text-center text-slate-600 text-xs font-medium uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} • Created with love
        </footer>
      </div>
    </div>
  );
}
