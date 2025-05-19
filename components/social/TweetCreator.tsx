import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TweetCard } from "./TweetCard";

export function TweetCreator({ user, onPostCreated }: { user: any, onPostCreated?: (post: any) => void }) {
  const [context, setContext] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/generate-tweet", {
      method: "POST",
      body: JSON.stringify({ context, user }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setSuggestion(data.tweet);
    setLoading(false);
  }

  function handleAccept() {
    onPostCreated && onPostCreated({ platform: 'twitter', caption: suggestion });
    setSuggestion("");
    setContext("");
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow mb-6">
      <label className="block mb-1 font-medium">What do you want to tweet about?</label>
      <Textarea value={context} onChange={e => setContext(e.target.value)} maxLength={280} placeholder="Enter tweet context..." />
      <div className="text-xs text-gray-500 mt-1">{context.length}/280 characters</div>
      <Button className="mt-4" onClick={handleGenerate} disabled={loading || !context}>
        {loading ? "Generating..." : "Get AI Suggestion"}
      </Button>
      {suggestion && (
        <div className="mt-4">
          <TweetCard post={{ caption: suggestion }} user={user} />
          <Button className="mt-2" onClick={handleAccept}>Accept & Post</Button>
        </div>
      )}
    </div>
  );
} 