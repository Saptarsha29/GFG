import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const ChatInput = ({
  onSubmit,
  isLoading,
  placeholder = "Ask a question about your data...",
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim() && !isLoading) {
      onSubmit(query);
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto relative"
    >
      <input
        data-testid="chat-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full glass-effect border border-border/50 rounded-full py-4 pl-6 pr-16 text-lg focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)] placeholder:text-muted-foreground text-foreground disabled:opacity-50"
      />

      <button
        data-testid="chat-submit-button"
        type="submit"
        disabled={isLoading || !query.trim()}
        className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

export default ChatInput;