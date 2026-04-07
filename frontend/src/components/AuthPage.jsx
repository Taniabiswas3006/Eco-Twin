import * as React from "react";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Loader2, ArrowLeft, ShieldCheck, User, Phone, Info } from "lucide-react";

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
import authBg from '@/assets/ecotwin_auth.png';

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

export default function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    const url = isLogin ? `${import.meta.env.VITE_API_URL}/login` : `${import.meta.env.VITE_API_URL}/signup`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

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
      console.error(err);
      setError('Could not connect to the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col md:flex-row bg-white">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2 lg:p-16">
        <div className="w-full max-w-lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {/* Nav Back Meta */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-eco-600 font-bold text-xl tracking-tight">
                <Leaf className="fill-eco-500" />
                <span>EcoTwin</span>
              </Link>
              <Button variant="ghost" size="sm" asChild className="text-neutral-500 font-medium">
                <Link to="/">
                  Back to Home
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-left space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                {isLogin ? 'Welcome Back' : 'Create Your Twin'}
              </h1>
              <p className="text-neutral-500 text-lg font-medium">
                {isLogin
                  ? 'Access your digital sustainability reflection.'
                  : 'Join thousands modeling a more sustainable future.'}
              </p>
            </motion.div>

            {error && (
              <motion.div
                variants={itemVariants}
                className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold flex items-start gap-3 shadow-sm"
              >
                <div className="mt-0.5"><Info size={16} /></div>
                {error}
              </motion.div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {!isLogin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} disabled={isLoading} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="10-digit number" {...field} disabled={isLoading} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} disabled={isLoading} className="rounded-xl h-12" />
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
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="eco_warrior" {...field} disabled={isLoading} className="rounded-xl h-12" />
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
                          <FormLabel>Gender</FormLabel>
                          <select
                            {...field}
                            disabled={isLoading}
                            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eco-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  {isLogin ? (
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                              className="data-[state=checked]:bg-eco-600 border-eco-200"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium text-neutral-500 cursor-pointer">
                              Keep me synced
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                              className="data-[state=checked]:bg-eco-600 border-eco-200"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs font-medium text-neutral-400 leading-normal">
                              I agree to the <span className="text-eco-600 underline">Terms of Sustainablity</span> and Environmental Policy.
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                  {isLogin && (
                    <a href="#" className="text-sm font-bold text-eco-600 hover:underline">
                      Forgotten?
                    </a>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-bold rounded-xl bg-eco-600 hover:bg-eco-700 shadow-xl shadow-eco-600/20 active:scale-[0.98] transition-all disabled:opacity-80"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ShieldCheck className="mr-2 h-5 w-5" />
                    )}
                    {isLogin ? 'Sign In to Twin' : 'Launch My Journey'}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-neutral-500 font-medium"
            >
              {isLogin ? "Don't have an account yet? " : "Already modeling your life? "}
              <Link
                to={isLogin ? '/signup' : '/login'}
                className="font-bold text-eco-600 hover:text-eco-800 transition-colors"
              >
                {isLogin ? 'Start here' : 'Sign in here'}
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="relative hidden w-1/2 md:block overflow-hidden bg-white">
        <img
          src={authBg}
          alt="EcoTwin Sustainability"
          className="h-full w-full object-cover opacity-100 transition-opacity duration-700"
        />
      </div>
    </div>
  );
}
