import React from "react";
import { Sparkles } from "lucide-react";

const ExamplePrompts = ({ onSelectPrompt }) => {
  const examples = [
    {
      title: "Revenue Analysis",
      prompt: "Show total revenue by region",
      icon: "💰",
    },
    {
      title: "Category Performance",
      prompt: "Top 5 product categories by sales",
      icon: "📊",
    },
    {
      title: "Monthly Trends",
      prompt: "Show monthly revenue trend",
      icon: "📈",
    },
    {
      title: "Payment Methods",
      prompt: "Payment method distribution",
      icon: "💳",
    },
  ];

  return (
    <div
      data-testid="example-prompts"
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Try asking:
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {examples.map((example, index) => (
          <button
            key={index}
            data-testid={`example-prompt-${index}`}
            onClick={() => onSelectPrompt(example.prompt)}
            className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{example.icon}</span>

              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {example.title}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {example.prompt}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;