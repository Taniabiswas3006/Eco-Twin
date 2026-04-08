import * as React from "react";
import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Loader2, ArrowLeft, ShieldCheck, User, Phone, Info, Eye, EyeOff, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().default(false).optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." }),
  gender: z.enum(["female", "male", "non-binary", "prefer-not-to-say"], { 
    required_error: "Please select your gender." 
  }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  agreeTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms." }),
});

// --- Eye Animation Components ---

const Pupil = ({ 
  size = 12, 
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
  mouseX,
  mouseY
}) => {
  const pupilRef = useRef(null);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

const EyeBall = ({ 
  size = 48, 
  pupilSize = 16, 
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
  mouseX,
  mouseY
}) => {
  const eyeRef = useRef(null);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150 border border-neutral-100/50"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

export default function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation States
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  
  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  const formSchema = isLogin ? loginSchema : signupSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: isLogin ? {
      username: "",
      email: "",
      password: "",
      rememberMe: false,
    } : {
      name: "",
      username: "",
      email: "",
      phone: "",
      gender: "",
      password: "",
      agreeTerms: false,
    },
  });

  const passwordValue = form.watch("password") || "";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effects
  useEffect(() => {
    const timer = setInterval(() => {
      setIsPurpleBlinking(true);
      setTimeout(() => setIsPurpleBlinking(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsBlackBlinking(true);
      setTimeout(() => setIsBlackBlinking(false), 150);
    }, 3500 + Math.random() * 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  useEffect(() => {
    if (passwordValue.length > 0 && showPassword) {
      const timer = setInterval(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(timer);
    }
  }, [passwordValue, showPassword]);

  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const [loadingMessage, setLoadingMessage] = useState('');

  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl && !apiUrl.includes('localhost')) {
      fetch(`${apiUrl}/`, { method: 'HEAD' }).catch(() => {});
    }
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setLoadingMessage('Authenticating...');
    const url = isLogin ? `${import.meta.env.VITE_API_URL}/login` : `${import.meta.env.VITE_API_URL}/signup`;
    const slowTimer = setTimeout(() => setLoadingMessage('Server is waking up, please wait...'), 5000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(slowTimer);
      clearTimeout(timeoutId);
      const responseData = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({ 
          username: responseData.username, 
          email: responseData.email || '',
          token: responseData.token 
        }));
        navigate('/app');
      } else {
        setError(responseData.error || 'Authentication failed. Please try again.');
        if (responseData.error?.toLowerCase().includes("username")) {
          form.setError("username", { message: responseData.error });
        }
      }
    } catch (err) {
      clearTimeout(slowTimer);
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('The server took too long to respond. It may have been sleeping — please try again, it should be awake now!');
      } else {
        setError('Could not connect to the server. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 lg:p-12 z-10 transition-all duration-500">
        <div className="w-full max-w-lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
              <Link to="/" className="flex items-center gap-2 text-eco-600 font-bold text-xl tracking-tight">
                <Leaf className="fill-eco-500" />
                <span>EcoTwin</span>
              </Link>
              <Button variant="ghost" size="sm" asChild className="text-neutral-500 font-medium hover:bg-neutral-50">
                <Link to="/">Back to Home</Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-left space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                {isLogin ? 'Welcome Back' : 'Create Your Twin'}
              </h1>
              <p className="text-neutral-500 text-sm sm:text-base font-medium">
                {isLogin
                  ? 'Access your digital sustainability reflection.'
                  : 'Join thousands modeling a more sustainable future.'}
              </p>
            </motion.div>

            {error && (
              <motion.div
                variants={itemVariants}
                className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-start gap-3"
              >
                <div className="mt-0.5"><Info size={14} /></div>
                {error}
              </motion.div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-400">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="rounded-xl h-11 bg-neutral-50/50 border-neutral-100" />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-400">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="10-digit number" {...field} disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="rounded-xl h-11 bg-neutral-50/50 border-neutral-100" />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>
                )}

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="rounded-xl h-11 bg-neutral-50/50 border-neutral-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-400">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="eco_warrior" {...field} disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="rounded-xl h-11 bg-neutral-50/50 border-neutral-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {!isLogin && (
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-400">Gender</FormLabel>
                          <select
                            {...field}
                            onFocus={() => setIsTyping(true)}
                            onBlur={() => setIsTyping(false)}
                            disabled={isLoading}
                            className="flex h-11 w-full rounded-xl border border-neutral-100 bg-neutral-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eco-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="" disabled>Select gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-400">Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                              disabled={isLoading} 
                              onFocus={() => setIsTyping(true)} 
                              onBlur={() => setIsTyping(false)}
                              className="rounded-xl h-11 bg-neutral-50/50 border-neutral-100 pr-10" 
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  {isLogin ? (
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} className="data-[state=checked]:bg-eco-600 border-eco-200 h-4 w-4 mt-0.5" />
                          </FormControl>
                          <FormLabel className="text-xs font-medium text-neutral-500 cursor-pointer">Keep me synced</FormLabel>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} className="data-[state=checked]:bg-eco-600 border-eco-200 h-4 w-4 mt-0.5" />
                          </FormControl>
                          <FormLabel className="text-[10px] font-medium text-neutral-400 leading-normal">
                            I agree to the <span className="text-eco-600 underline">Terms</span> and Environmental Policy.
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  )}
                  {isLogin && (
                    <a href="#" className="text-xs font-bold text-eco-600 hover:underline">Forgotten?</a>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button type="submit" className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold rounded-xl bg-eco-600 hover:bg-eco-700 shadow-xl shadow-eco-600/20 active:scale-[0.98] transition-all disabled:opacity-80" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="text-xs font-medium">{loadingMessage}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {isLogin ? 'Sign In to Twin' : 'Launch My Journey'}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <motion.p variants={itemVariants} className="text-center text-sm text-neutral-500 font-medium">
              {isLogin ? "Don't have an account yet? " : "Already modeling your life? "}
              <Link to={isLogin ? '/signup' : '/login'} className="font-bold text-eco-600 hover:text-eco-800 transition-colors">
                {isLogin ? 'Start here' : 'Sign in here'}
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Interactive Characters (Light Theme Redesign) */}
      <div className="relative hidden w-1/2 md:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-eco-50/50 via-white to-neutral-50/50 border-l border-neutral-100">
        <div className="relative z-20">
          <div className="flex items-center gap-2 text-lg font-semibold text-eco-600/80">
            <div className="size-8 rounded-lg bg-eco-100 flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <span>EcoTwin Intelligence</span>
          </div>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative" style={{ width: '550px', height: '400px' }}>
            {/* Purple Character */}
            <div 
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out border-t border-x border-black/5"
              style={{
                left: '70px',
                width: '180px',
                height: (isTyping || (passwordValue.length > 0 && !showPassword)) ? '440px' : '400px',
                backgroundColor: '#6C3FF5',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: (passwordValue.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : (isTyping || (passwordValue.length > 0 && !showPassword))
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
                boxShadow: '0 -20px 40px -20px rgba(108, 63, 245, 0.3)'
              }}
            >
              <div 
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left: (passwordValue.length > 0 && showPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + purplePos.faceX}px`,
                  top: (passwordValue.length > 0 && showPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking} mouseX={mouseX} mouseY={mouseY}
                  forceLookX={(passwordValue.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(passwordValue.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking} mouseX={mouseX} mouseY={mouseY}
                  forceLookX={(passwordValue.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(passwordValue.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
              </div>
            </div>

            {/* Black Character */}
            <div 
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out border-t border-x border-white/10"
              style={{
                left: '240px',
                width: '120px',
                height: '310px',
                backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: (passwordValue.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || (passwordValue.length > 0 && !showPassword))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: (passwordValue.length > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + blackPos.faceX}px`,
                  top: (passwordValue.length > 0 && showPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking} mouseX={mouseX} mouseY={mouseY}
                  forceLookX={(passwordValue.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(passwordValue.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking} mouseX={mouseX} mouseY={mouseY}
                  forceLookX={(passwordValue.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(passwordValue.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
              </div>
            </div>

            {/* Orange Character */}
            <div 
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out shadow-sm"
              style={{
                left: '0px',
                width: '240px',
                height: '200px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '120px 120px 0 0',
                transform: (passwordValue.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left: (passwordValue.length > 0 && showPassword) ? `${50}px` : `${82 + (orangePos.faceX || 0)}px`,
                  top: (passwordValue.length > 0 && showPassword) ? `${85}px` : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" mouseX={mouseX} mouseY={mouseY} forceLookX={(passwordValue.length > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordValue.length > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" mouseX={mouseX} mouseY={mouseY} forceLookX={(passwordValue.length > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordValue.length > 0 && showPassword) ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow Character */}
            <div 
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out shadow-sm"
              style={{
                left: '310px',
                width: '140px',
                height: '230px',
                backgroundColor: '#E8D754',
                borderRadius: '70px 70px 0 0',
                zIndex: 4,
                transform: (passwordValue.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left: (passwordValue.length > 0 && showPassword) ? `${20}px` : `${52 + (yellowPos.faceX || 0)}px`,
                  top: (passwordValue.length > 0 && showPassword) ? `${35}px` : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" mouseX={mouseX} mouseY={mouseY} forceLookX={(passwordValue.length > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordValue.length > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" mouseX={mouseX} mouseY={mouseY} forceLookX={(passwordValue.length > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordValue.length > 0 && showPassword) ? -4 : undefined} />
              </div>
              <div 
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left: (passwordValue.length > 0 && showPassword) ? `${10}px` : `${40 + (yellowPos.faceX || 0)}px`,
                  top: (passwordValue.length > 0 && showPassword) ? `${88}px` : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center justify-center gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
          <span>Simulation Mode Active</span>
          <div className="w-1 h-1 rounded-full bg-eco-500 animate-pulse" />
          <span>Real-time Mirroring</span>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-neutral-50/[0.2]" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 right-1/4 size-64 bg-eco-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
}
