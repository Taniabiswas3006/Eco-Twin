import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Activity, Zap, Shield, Leaf, Layout, Pointer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Feature108 = ({
  badge = "Eco-Twin Core Concepts",
  heading = "Intelligence meets sustainability",
  description = "We don't just calculate your emissions. We construct a dynamic mirrored model of your lifestyle that adapts, learns, and simulates a better future.",
  tabs = [
    {
      value: "tab-1",
      icon: <Activity className="h-auto w-4 shrink-0" />,
      label: "Behavioral Mapping",
      content: {
        badge: "Deep Analysis",
        title: "Track your specific carbon signature.",
        description:
          "By understanding the nuanced choices in your daily routine—from your transit patterns to your energy grid—we map your specific carbon signature with surgical precision, unlocking insights you never knew existed.",
        buttonText: "Start Mapping",
        imageSrc: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000",
        imageAlt: "Carbon visualization showing complex patterns of energy use",
      },
    },
    {
      value: "tab-2",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "What-If Simulations",
      content: {
        badge: "Predictive Tech",
        title: "Visualize the impact of micro-decisions.",
        description:
          "Wondering how switching to a plant-based diet impacts your footprint? Our powerful simulation engine instantly calculates scenarios, enabling you to visualize the monumental impact before making a change.",
        buttonText: "Run Simulation",
        imageSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        imageAlt: "Advanced simulation graphics with planetary data",
      },
    },
    {
      value: "tab-3",
      icon: <Leaf className="h-auto w-4 shrink-0" />,
      label: "Sustainable Growth",
      content: {
        badge: "Eco-Metrics",
        title: "Grow your green score over time.",
        description:
          "Get personalized recommendations and track your progress as you reduce your footprint. Our intelligence learns your habits and suggests the most effective ways to increase your score.",
        buttonText: "View Progress",
        imageSrc: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1000",
        imageAlt: "Lush green plant representing growth and sustainability",
      },
    },
  ],
}) => {
  return (
    <section className="pt-8 pb-32 bg-eco-50/10">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="px-4 py-1 text-sm font-semibold uppercase tracking-wider text-eco-500 border-eco-200">
            {badge}
          </Badge>
          <h1 className="max-w-2xl text-4xl font-extrabold md:text-5xl tracking-tight text-neutral-900 leading-[1.1]">
            {heading}
          </h1>
          <p className="text-neutral-500 max-w-2xl text-lg font-medium leading-relaxed">
            {description}
          </p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-neutral-400 transition-all cursor-pointer data-[state=active]:bg-white data-[state=active]:text-eco-600 data-[state=active]:shadow-md border border-transparent data-[state=active]:border-neutral-100"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-3xl bg-white/70 backdrop-blur-md border border-neutral-100 p-8 lg:p-16 shadow-apple">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10 focus:outline-none"
              >
                <div className="flex flex-col gap-6">
                  <Badge variant="outline" className="w-fit bg-eco-50 text-eco-600 border-eco-200/50 font-bold px-3 py-1">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-extrabold text-neutral-900 lg:text-5xl leading-tight">
                    {tab.content.title}
                  </h3>
                  <p className="text-neutral-500 lg:text-xl font-medium leading-relaxed">
                    {tab.content.description}
                  </p>
                  <Button variant="default" className="mt-4 w-fit h-auto px-8 py-4 text-lg font-bold rounded-full bg-eco-500 hover:bg-eco-600 shadow-lg shadow-eco-500/20 transition-all active:scale-95 text-white">
                    {tab.content.buttonText} <Zap className="size-5 fill-current" />
                  </Button>
                </div>
                <div className="relative group">
                  <img
                    src={tab.content.imageSrc}
                    alt={tab.content.imageAlt}
                    className="rounded-[2.5rem] object-cover w-full aspect-[4/3] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-neutral-900/10" />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
