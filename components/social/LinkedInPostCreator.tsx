import { useState } from "react";
import { LinkedInTrendingTopics } from "./LinkedInTrendingTopics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LinkedInPostCard } from "./LinkedInPostCard";

export function LinkedInPostCreator({ user, onPostCreated }: { user: any, onPostCreated?: (post: any) => void }) {
  const [topic, setTopic] = useState("");
  const [custom, setCustom] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/generate-linkedin-post", {
      method: "POST",
      body: JSON.stringify({ topic: custom || topic }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setSuggestion(data.suggestion);
    setLoading(false);
  }

  function handleAccept() {
    onPostCreated && onPostCreated({ platform: 'linkedin', caption: suggestion });
    setSuggestion("");
    setTopic("");
    setCustom("");
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow mb-6">
      <LinkedInTrendingTopics onSelect={setTopic} />
      <div className="mt-4">
        <label className="block mb-1 font-medium">Or write your own topic:</label>
        <Textarea value={custom} onChange={e => setCustom(e.target.value)} placeholder="What do you want to post about?" />
      </div>
      <Button className="mt-4" onClick={handleGenerate} disabled={loading || (!topic && !custom)}>
        {loading ? "Generating..." : "Get AI Suggestion"}
      </Button>
      {suggestion && (
        <div className="mt-4">
          <LinkedInPostCard post={{ caption: suggestion }} user={user} />
          <Button className="mt-2" onClick={handleAccept}>Accept & Post</Button>
        </div>
      )}
    </div>
  );
} 