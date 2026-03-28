import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, Zap, Utensils, ShoppingBag, Car, Train, Bike, Snowflake } from 'lucide-react';

const steps = [
  { id: 'travel', title: 'How do you usually get around?' },
  { id: 'electricity', title: 'Daily general electricity usage' },
  { id: 'ac', title: 'AC & heavy appliance usage per day' },
  { id: 'food', title: 'What best describes your diet?' },
  { id: 'shopping', title: 'How often do you shop for non-essentials?' },
];

export default function InputForm({ onComplete, isLoading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    travel: 'public',
    electricity: 5,
    ac: 3,
    food: 'veg',
    shopping: 2,
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const OptionCard = ({ label, value, field, icon: Icon, description }) => {
    const isSelected = formData[field] === value;
    return (
      <div 
        onClick={() => setFormData({ ...formData, [field]: value })}
        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2
          ${isSelected 
            ? 'border-eco-500 bg-eco-50 text-eco-800' 
            : 'border-neutral-200 hover:border-eco-300 bg-white hover:bg-neutral-50 text-neutral-600'
          }`}
      >
        <Icon size={32} className={isSelected ? "text-eco-500" : "text-neutral-400"} />
        <span className="font-medium text-lg">{label}</span>
        {description && <span className="text-sm opacity-70 text-center">{description}</span>}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card p-10 mt-10">
      <div className="flex justify-between items-center mb-8 text-neutral-400 text-sm font-medium">
        <span>Step {currentStep + 1} of {steps.length}</span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-eco-500' : i < currentStep ? 'w-2 bg-eco-300' : 'w-2 bg-neutral-200'}`} 
            />
          ))}
        </div>
      </div>

      <div className="min-h-[250px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h2 className="text-3xl font-semibold mb-8 tracking-tight">{steps[currentStep].title}</h2>

            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <OptionCard label="Car" value="car" field="travel" icon={Car} />
                <OptionCard label="Public Trans." value="public" field="travel" icon={Train} />
                <OptionCard label="Bike/Walk" value="bike" field="travel" icon={Bike} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="py-6">
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-500 font-medium">Lights, fans, devices</span>
                  <span className="font-bold text-eco-600 text-xl">{formData.electricity} hours/day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={formData.electricity}
                  onChange={(e) => setFormData({ ...formData, electricity: Number(e.target.value) })}
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-2 px-1">
                  <span>0 hrs</span>
                  <span>12 hrs</span>
                  <span>24 hrs</span>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="py-6">
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-500 font-medium">AC, heater, washing machine</span>
                  <span className="font-bold text-eco-600 text-xl">{formData.ac} hours/day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={formData.ac}
                  onChange={(e) => setFormData({ ...formData, ac: Number(e.target.value) })}
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-2 px-1">
                  <span>0 hrs</span>
                  <span>12 hrs</span>
                  <span>24 hrs</span>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OptionCard label="Vegetarian / Vegan" value="veg" field="food" icon={Leaf} description="Plant-based mostly" />
                <OptionCard label="Non-Vegetarian" value="non-veg" field="food" icon={Utensils} description="Regular meat consumption" />
              </div>
            )}

            {currentStep === 4 && (
              <div className="py-6">
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-500 font-medium">Frequency</span>
                  <span className="font-bold text-eco-600 text-xl">{formData.shopping} times/week</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.shopping}
                  onChange={(e) => setFormData({ ...formData, shopping: Number(e.target.value) })}
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-2 px-1">
                  <span>0x</span>
                  <span>5x</span>
                  <span>10x</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        {currentStep > 0 && (
          <button
            onClick={prevStep}
            disabled={isLoading}
            className="px-6 py-3 rounded-full font-medium flex items-center gap-2 text-neutral-600 hover:bg-neutral-100 transition-all active:scale-95 disabled:opacity-70"
          >
            Previous
          </button>
        )}
        <button
          onClick={nextStep}
          disabled={isLoading}
          className="bg-eco-600 hover:bg-eco-700 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-eco-600/20"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : currentStep === steps.length - 1 ? (
            'Calculate Twin'
          ) : (
            <>Next <ArrowRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}
