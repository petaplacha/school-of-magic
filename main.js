import React, { useState, useEffect, useRef } from 'react';
import { Heart, Backpack, Book, Scroll, Skull, ArrowRight, Sparkles, FlaskConical, CircleDot, HelpCircle, Sun, Coins, DoorOpen, Eye, Key, Settings, Ghost, Search, Moon, Beaker, MessageCircle, X } from 'lucide-react';

// --- STYLY A FONTY ---
const fontsLink = document.createElement('link');
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap';
fontsLink.rel = 'stylesheet';
document.head.appendChild(fontsLink);

// --- DATA PŘÍBĚHU (EN - B1 Level) ---
const storyData = {
  start: {
    id: 'start',
    title: '1. The Potion Classroom',
    text: 'You are a student at the School of Magic. You made Professor Blackwood angry today, so you must stay after school.\n\n"You can leave only when you make the Escape Potion," the Professor said before he locked the door.\n\nYou need to find the Recipe and three ingredients. You have 3 coins in your pocket.',
    imageType: 'room',
    choices: [
      { text: 'Go to the Cauldron Table', target: 'cauldron' },
      { text: 'Go to the Professor\'s Desk', target: 'desk' },
      { text: 'Go to the Library (Bookshelves)', target: 'library' },
      { text: 'Go to the Supply Closet', target: 'closet' },
      { text: 'Talk to your friend Tom', target: 'tom' }
    ]
  },

  // --- 1. THE CAULDRON (Brewing Station) ---
  cauldron: {
    id: 'cauldron',
    title: '2. The Cauldron Table',
    text: 'There is a big black cauldron here. The fire under it is hot. You need the Recipe and all ingredients (Silver Root, Dragon Blood, Moon Moth) to start brewing.',
    imageType: 'cauldron',
    choices: [
      { 
        text: 'Start brewing the potion!', 
        target: 'brew_step_1', 
        req: 'Recipe', 
        req2: 'Silver Root', 
        req3: 'Dragon Blood', 
        req4: 'Moon Moth' 
      },
      { text: 'Go back to the center of the room', target: 'start' }
    ]
  },

  // --- 2. PROFESSOR'S DESK (Riddle for Recipe) ---
  desk: {
    id: 'desk',
    title: '3. Professor\'s Desk',
    text: 'This is a large wooden desk. There is a locked drawer. You can see a magical question on it:\n\n"According to the old legend, which magical beast is the patron of our school?"',
    imageType: 'desk',
    inputType: 'text',
    correctAnswers: ['dragon', 'a dragon', 'the dragon'],
    successTarget: 'desk_win',
    failureTarget: 'desk_fail',
    choices: [
      { text: 'Go back to the center of the room', target: 'start' }
    ]
  },
  desk_win: {
    id: 'desk_win',
    title: 'Drawer Unlocked!',
    text: 'CLICK! The drawer opens. Inside, you find an old piece of paper. It is the Potion Recipe!',
    imageType: 'treasure',
    choices: [
      { text: 'Take the Recipe', target: 'start', loot: 'Recipe', closeLoc: 'desk_solved' }
    ]
  },
  desk_fail: {
    id: 'desk_fail',
    title: 'Wrong Answer!',
    text: 'ZAP! A red light hits your hand. The drawer stays locked. That is not the correct word.',
    imageType: 'skull',
    choices: [
      { text: 'Try again', target: 'desk', damage: 1 },
      { text: 'Go back', target: 'start', damage: 1 }
    ]
  },

  // --- 3. THE LIBRARY ---
  library: {
    id: 'library',
    title: '4. The Library',
    text: 'There are hundreds of dusty books here. It is very dark.',
    imageType: 'library',
    choices: [
      { text: 'Search the old books', target: 'library_search', reqOpen: 'library_looted' },
      { text: 'Read a book about the School History', target: 'library_hint' },
      { text: 'Go back to the center of the room', target: 'start' }
    ]
  },
  library_search: {
    id: 'library_search',
    title: 'A Hidden Item',
    text: 'You move some heavy books. Behind them, you find a small jar with a glowing white insect. It is the Moon Moth!',
    imageType: 'treasure',
    choices: [
      { text: 'Take the Moon Moth', target: 'library', loot: 'Moon Moth', closeLoc: 'library_looted' }
    ]
  },
  library_hint: {
    id: 'library_hint',
    title: 'Book of Legends',
    text: 'You open the book. One page says: "A long time ago, a huge, fire-breathing DRAGON saved the students. Since that day, it is the patron of our school." This must be a hint!',
    imageType: 'library',
    choices: [
      { text: 'Close the book', target: 'library' }
    ]
  },

  // --- 4. THE SUPPLY CLOSET ---
  closet: {
    id: 'closet',
    title: '5. The Supply Closet',
    text: 'It is a small room with many boxes and ingredients.',
    imageType: 'door',
    choices: [
      { text: 'Open the wooden box on the table', target: 'closet_box', reqOpen: 'box_looted' },
      { text: 'Look at the top shelf (Dangerous!)', target: 'closet_shelf', reqOpen: 'shelf_searched' },
      { text: 'Go back to the center of the room', target: 'start' }
    ]
  },
  closet_box: {
    id: 'closet_box',
    title: 'Wooden Box',
    text: 'You open the box. Inside is a silver plant. It is the Silver Root!',
    imageType: 'treasure',
    choices: [
      { text: 'Take the Silver Root', target: 'closet', loot: 'Silver Root', closeLoc: 'box_looted' }
    ]
  },
  closet_shelf: {
    id: 'closet_shelf',
    title: 'Falling Objects!',
    text: 'You try to look at the top shelf. You pull a heavy cauldron by mistake. BANG! It falls on your head. Ouch!',
    imageType: 'skull',
    choices: [
      { text: 'Rub your head', target: 'closet', damage: 1, closeLoc: 'shelf_searched' }
    ]
  },

  // --- 5. CLASSMATE TOM ---
  tom: {
    id: 'tom',
    title: '6. Tom\'s Desk',
    text: 'Your classmate Tom is sitting here. "Hey," he whispers. "I have some extra ingredients. Do you want to buy them? I need some coins."',
    imageType: 'friend',
    choices: [
      { text: 'Buy Dragon Blood', target: 'tom', cost: 2, loot: 'Dragon Blood', reqGold: 2 },
      { text: 'Buy a Magic Apple (Heals 1 life)', target: 'tom', cost: 1, loot: 'Magic Apple', reqGold: 1 },
      { text: 'Buy a Chocolate Frog (Heals 1 life)', target: 'tom', cost: 1, loot: 'Chocolate Frog', reqGold: 1 },
      { text: 'Go back to the center of the room', target: 'start' }
    ]
  },

  // --- BREWING THE POTION (The Test) ---
  brew_step_1: {
    id: 'brew_step_1',
    title: 'Brewing: Step 1',
    text: 'You look at the Recipe. You are ready.\n\nWhat is the FIRST step?',
    imageType: 'cauldron',
    choices: [
      { text: 'Add the Dragon Blood', target: 'brew_fail' },
      { text: 'Cut the Silver Root', target: 'brew_step_2' },
      { text: 'Mix the potion', target: 'brew_fail' },
      { text: 'Add the Moon Moth', target: 'brew_fail' }
    ]
  },
  brew_step_2: {
    id: 'brew_step_2',
    title: 'Brewing: Step 2',
    text: 'Good job. You cut the root and put it in the water. It turns green.\n\nWhat is the SECOND step?',
    imageType: 'cauldron',
    choices: [
      { text: 'Mix the potion', target: 'brew_fail' },
      { text: 'Cut the Silver Root', target: 'brew_fail' },
      { text: 'Add the Dragon Blood', target: 'brew_step_3' },
      { text: 'Add the Moon Moth', target: 'brew_fail' }
    ]
  },
  brew_step_3: {
    id: 'brew_step_3',
    title: 'Brewing: Step 3',
    text: 'Perfect. The water turns red. It is bubbling!\n\nWhat is the THIRD step?',
    imageType: 'cauldron',
    choices: [
      { text: 'Mix the potion carefully', target: 'brew_step_4' },
      { text: 'Add the Moon Moth', target: 'brew_fail' },
      { text: 'Cut the Silver Root', target: 'brew_fail' },
      { text: 'Add more Dragon Blood', target: 'brew_fail' }
    ]
  },
  brew_step_4: {
    id: 'brew_step_4',
    title: 'Brewing: Step 4',
    text: 'You stir the potion. It is looking great. There is only one thing left.\n\nWhat is the FINAL step?',
    imageType: 'cauldron',
    choices: [
      { text: 'Mix it again', target: 'brew_fail' },
      { text: 'Add the Moon Moth', target: 'brew_win' },
      { text: 'Drink the potion', target: 'brew_fail' }
    ]
  },
  brew_fail: {
    id: 'brew_fail',
    title: 'BOOM!',
    text: 'Oh no! You made a mistake. The potion explodes in a cloud of black smoke.\n\nYou cough and feel dizzy. You lost 1 life. You must clean the cauldron and start again from the beginning.',
    imageType: 'skull',
    choices: [
      { text: 'Try again', target: 'cauldron', damage: 1 }
    ]
  },
  brew_win: {
    id: 'brew_win',
    title: 'VICTORY!',
    text: 'You add the Moon Moth. The potion turns beautiful gold and smells like vanilla. \n\nSuddenly, you hear a CLICK from the classroom door. The door is open! You successfully made the Escape Potion and you can finally go home!',
    imageType: 'victory',
    choices: [
      { text: 'Play Again', target: 'reset' }
    ]
  },

  // --- GAME OVER ---
  game_over: {
    id: 'game_over',
    title: 'Game Over',
    text: 'You lost all your lives. You feel too sick and tired to continue. Professor Blackwood finds you sleeping on the floor. You will have to clean the classroom for a whole month!',
    imageType: 'death',
    choices: [
      { text: 'Restart Game', target: 'reset' }
    ]
  }
};

export default function MagicSchoolGamebook() {
  const [currentSceneId, setCurrentSceneId] = useState('start');
  const [inventory, setInventory] = useState([]); 
  const [gold, setGold] = useState(3); 
  const [hearts, setHearts] = useState(3); 
  const [closedLocations, setClosedLocations] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showRecipe, setShowRecipe] = useState(false);

  const rightColumnRef = useRef(null);

  const consumables = ['Magic Apple', 'Chocolate Frog'];
  const usableItems = ['Magic Apple', 'Chocolate Frog', 'Recipe'];

  useEffect(() => {
    if (hearts <= 0 && currentSceneId !== 'game_over' && currentSceneId !== 'reset') {
      setCurrentSceneId('game_over');
    }
  }, [hearts, currentSceneId]);

  useEffect(() => {
    if (rightColumnRef.current) {
        rightColumnRef.current.scrollTop = 0;
    }
    setInputValue('');
  }, [currentSceneId]);

  const handleUseItem = (item) => {
    if (item === 'Recipe') {
        setShowRecipe(true);
        return;
    }

    let consumed = false;

    if (item === 'Magic Apple' || item === 'Chocolate Frog') {
        if (hearts < 3) {
            setHearts(prev => Math.min(3, prev + 1));
            consumed = true;
        } else {
            alert("You already have maximum lives!");
        }
    }

    if (consumed) {
        setInventory(prev => {
            const index = prev.indexOf(item);
            if (index > -1) {
                const newInv = [...prev];
                newInv.splice(index, 1);
                return newInv;
            }
            return prev;
        });
    }
  };

  const currentScene = storyData[currentSceneId] || storyData['start'];

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const answer = inputValue.trim().toLowerCase();
    const isCorrect = currentScene.correctAnswers.some(correct => correct.toLowerCase() === answer);

    if (isCorrect) {
        handleChoice({ 
            target: currentScene.successTarget, 
            closeLoc: currentScene.id + '_solved' 
        });
    } else {
        handleChoice({ target: currentScene.failureTarget });
    }
  };

  const handleChoice = (choice) => {
    if (choice.target === 'reset') {
      setHearts(3);
      setGold(3);
      setInventory([]);
      setClosedLocations([]);
      setCurrentSceneId('start');
      return;
    }

    if (choice.cost) {
      if (gold >= choice.cost) {
        setGold(prev => prev - choice.cost);
      } else { return; }
    }

    if (choice.lootGold) setGold(prev => prev + choice.lootGold);

    if (choice.removeItem) {
        setInventory(prev => {
            const index = prev.indexOf(choice.removeItem);
            if (index > -1) {
                const newInv = [...prev];
                newInv.splice(index, 1);
                return newInv;
            }
            return prev;
        });
    }

    if (choice.closeLoc) setClosedLocations(prev => [...prev, choice.closeLoc]);

    setCurrentSceneId(choice.target);

    if (choice.loot) {
      if (consumables.includes(choice.loot) || !inventory.includes(choice.loot)) {
        setInventory(prev => [...prev, choice.loot]);
      }
    }
    
    if (choice.damage) {
      setHearts(prev => Math.max(0, prev - choice.damage));
    }
  };

  // Filtr pro zobrazení tlačítek podle podmínek
  const visibleChoices = currentScene.choices ? currentScene.choices.filter(choice => {
    if (choice.alwaysShow) return true;
    if (choice.reqOpen && closedLocations.includes(choice.reqOpen)) return false;
    if (choice.reqClosed && !closedLocations.includes(choice.reqClosed)) return false;
    
    if (choice.req && !inventory.includes(choice.req)) return false;
    if (choice.req2 && !inventory.includes(choice.req2)) return false; 
    if (choice.req3 && !inventory.includes(choice.req3)) return false; 
    if (choice.req4 && !inventory.includes(choice.req4)) return false; 

    if (choice.loot && inventory.includes(choice.loot) && !consumables.includes(choice.loot)) {
        return false;
    }
    return true;
  }) : [];

  const getItemIcon = (itemName) => {
    switch(itemName) {
      case 'Recipe': return <Scroll size={16} className="text-[#d4af37]" />;
      case 'Silver Root': return <Sparkles size={16} className="text-gray-300" />;
      case 'Dragon Blood': return <FlaskConical size={16} className="text-red-500" />;
      case 'Moon Moth': return <Moon size={16} className="text-blue-200" />;
      case 'Magic Apple': return <Heart size={16} className="text-red-400" />;
      case 'Chocolate Frog': return <CircleDot size={16} className="text-amber-800" />;
      default: return <Backpack size={16} />;
    }
  };

  const renderSceneVisual = (type) => {
    const iconProps = { strokeWidth: 1.5, className: "text-[#d4af37] opacity-80" };
    let content;
    let title;
    
    switch(type) {
      case 'room': title = "CLASSROOM"; content = <Key size={80} {...iconProps} />; break;
      case 'cauldron': title = "CAULDRON"; content = <Beaker size={80} {...iconProps} />; break;
      case 'desk': title = "DESK"; content = <HelpCircle size={80} {...iconProps} />; break;
      case 'library': title = "LIBRARY"; content = <Book size={80} {...iconProps} />; break;
      case 'door': title = "CLOSET"; content = <DoorOpen size={80} {...iconProps} />; break;
      case 'friend': title = "TOM"; content = <MessageCircle size={80} {...iconProps} />; break;
      case 'treasure': title = "FOUND IT!"; content = <Sparkles size={80} {...iconProps} className="text-[#d4af37] animate-pulse" />; break;
      case 'victory': title = "SUCCESS"; content = <Sun size={80} {...iconProps} className="text-[#d4af37] animate-pulse" />; break;
      case 'skull': title = "DANGER"; content = <Skull size={80} {...iconProps} className="text-red-400" />; break; 
      case 'death': title = "GAME OVER"; content = <Ghost size={80} {...iconProps} className="text-gray-400" />; break; 
      default: title = "STORY"; content = <Scroll size={80} {...iconProps} />;
    }

    return (
      <div className="w-full h-full bg-[#1e1332] flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute inset-4 border-2 border-[#3a205e]/50 border-dashed rounded-lg"></div>
        <div className="z-10 transform scale-100 transition-transform duration-700 hover:scale-110">
            {content}
        </div>
        <div className="mt-6 text-xl font-cinzel tracking-[0.2em] text-[#d4af37] border-t border-b border-[#3a205e] py-2 text-center">
            {title}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-serif bg-[#0a0812] p-2 md:p-4"
         style={{
           backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')`,
         }}>
      
      {/* Recipe Modal */}
      {showRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-[#f4e4bc] p-6 rounded-lg max-w-sm w-full relative border-4 border-[#3a205e] shadow-2xl">
                <button 
                    onClick={() => setShowRecipe(false)}
                    className="absolute top-2 right-2 text-[#3a205e] hover:text-red-800"
                >
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-cinzel font-bold text-[#3a205e] mb-4 text-center border-b border-[#3a205e]/20 pb-2">
                    Escape Potion Recipe
                </h3>
                <div className="flex flex-col gap-4 font-crimson text-lg text-[#2c1810]">
                    <p className="italic text-center text-sm">Follow these instructions carefully:</p>
                    <ol className="list-decimal pl-6 space-y-2 font-bold">
                        <li>CUT the Silver Root and add it.</li>
                        <li>ADD the Dragon Blood.</li>
                        <li>MIX the potion carefully.</li>
                        <li>ADD the Moon Moth.</li>
                    </ol>
                    <button 
                        onClick={() => setShowRecipe(false)}
                        className="mt-4 px-6 py-2 bg-[#3a205e] text-[#d4af37] font-cinzel font-bold rounded hover:bg-[#251340] transition-colors w-full"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-5xl aspect-video bg-[#e8e4f2] shadow-[0_0_50px_rgba(100,50,150,0.3)] relative flex flex-col overflow-hidden rounded-md border-8 border-[#1a112e]"
           style={{
             backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')"
           }}>

        {/* Header */}
        <header className="h-12 flex-none bg-[#cfc5e0] border-b-4 border-double border-[#3a205e] flex justify-between items-center px-4 shadow-sm z-20">
             <div className="flex items-center gap-3">
                 <h1 className="text-lg md:text-xl font-black tracking-widest uppercase text-[#3a205e] font-cinzel flex items-center gap-2">
                    <Sparkles size={18} className="text-[#d4af37]"/> Magic School
                 </h1>
             </div>

             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-bold text-[#3a205e]" title="Coins">
                    <Coins size={16} className="text-yellow-600" />
                    <span>{gold}</span>
                </div>

                <div className="flex items-center gap-2" title="Lives">
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                        <Heart 
                            key={i} 
                            size={18} 
                            fill={i < hearts ? "#8b0000" : "transparent"}
                            className={i < hearts ? "text-[#8b0000] drop-shadow-sm" : "text-[#3a205e]/20"} 
                        />
                        ))}
                    </div>
                </div>
             </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            {/* LEFT COLUMN (Image) */}
            <div className="w-1/3 border-r-4 border-double border-[#3a205e] relative shadow-[5px_0_15px_rgba(0,0,0,0.1)] z-10 hidden md:block group">
                {renderSceneVisual(currentScene.imageType)}
            </div>

            {/* RIGHT COLUMN (Text & Choices) */}
            <div className="w-full md:w-2/3 flex flex-col relative bg-[#e8e4f2]">
                 <div className="flex-1 overflow-y-auto p-5 custom-scrollbar" ref={rightColumnRef}>
                    <h2 className="text-2xl font-bold text-[#3a205e] mb-3 font-cinzel border-b border-[#3a205e]/20 pb-2">
                        {currentScene.title}
                    </h2>
                    
                    <p className="text-lg text-[#2c1810] leading-relaxed mb-6 font-crimson text-justify whitespace-pre-line">
                        {currentScene.text}
                    </p>

                    <div className="space-y-3 mt-auto pt-4">
                        {/* INPUT HÁDANKY */}
                        {currentScene.inputType && (
                            <form onSubmit={handleInputSubmit} className="mb-4 bg-[#cfc5e0]/50 p-4 rounded border border-[#3a205e]/30">
                                <label className="block text-[#3a205e] font-cinzel font-bold mb-2 text-sm">
                                    Your Answer:
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="flex-1 p-2 bg-white border border-[#3a205e] rounded font-cinzel text-[#3a205e] focus:outline-none focus:ring-2 focus:ring-[#3a205e]/50"
                                        placeholder="Type the word..."
                                        autoFocus
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-[#3a205e] text-[#d4af37] px-4 py-2 rounded font-cinzel font-bold hover:bg-[#251340] transition-colors"
                                    >
                                        ENTER
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TLAČÍTKA VOLEB */}
                        {visibleChoices.map((choice, index) => {
                            const canAfford = !choice.reqGold || gold >= choice.reqGold;
                            return (
                                <button
                                key={index}
                                onClick={() => canAfford && handleChoice(choice)}
                                disabled={!canAfford}
                                className={`w-full text-left p-0.5 group relative transition-transform duration-200 ${canAfford ? 'active:scale-[0.99] hover:translate-x-1' : 'opacity-60 cursor-not-allowed grayscale'}`}
                                >
                                <div className={`absolute inset-0 border border-[#3a205e] rounded bg-white shadow-sm ${canAfford ? 'group-hover:shadow-md group-hover:bg-[#f8f6fb]' : ''} transition-all`}></div>
                                <div className="relative p-3 pl-4 pr-8 flex items-center justify-between font-cinzel font-bold text-[#3a205e] z-10 text-sm">
                                    <span className={!canAfford ? "text-[#3a205e]/70" : ""}>
                                        {choice.text}
                                        {choice.cost && <span className={canAfford ? "text-yellow-700 ml-2" : "text-yellow-700/50 ml-2"}>(-{choice.cost} coins)</span>}
                                    </span>
                                    {canAfford && <ArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#3a205e]" size={16} strokeWidth={2.5} />}
                                </div>
                                </button>
                            );
                        })}
                    </div>
                 </div>

                 {/* INVENTÁŘ */}
                 <div className="flex-none bg-[#cfc5e0] border-t-4 border-double border-[#3a205e] p-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    <div className="font-bold font-cinzel text-[10px] tracking-wider text-[#3a205e] mb-2 flex items-center gap-2 uppercase opacity-80">
                        <Backpack size={12}/> Inventory
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                        {inventory.length === 0 ? (
                            <div className="text-[#3a205e]/60 italic font-crimson text-sm p-1">Your bag is empty...</div>
                        ) : (
                            inventory.map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white border border-[#3a205e] px-2 py-1 rounded shadow-sm hover:bg-[#f8f6fb] transition-colors cursor-default">
                                    <div className="text-[#3a205e] opacity-80">
                                        {getItemIcon(item)}
                                    </div>
                                    <span className="font-cinzel font-bold text-xs text-[#3a205e]">{item}</span>
                                    
                                    {usableItems.includes(item) && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleUseItem(item); }}
                                            className="ml-1 px-1.5 py-0.5 bg-[#3a205e]/10 hover:bg-[#3a205e]/20 border border-[#3a205e]/50 text-[#3a205e] text-[10px] font-bold rounded transition-colors"
                                        >
                                            USE
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                 </div>
            </div>
        </div>
      </div>
      
    </div>
  );
}