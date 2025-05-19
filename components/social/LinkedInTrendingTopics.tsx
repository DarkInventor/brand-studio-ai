export function LinkedInTrendingTopics({ onSelect }: { onSelect: (topic: string) => void }) {
  const topics = [
    "AI in Marketing",
    "Remote Work Best Practices",
    "Leadership in 2024",
    "Diversity & Inclusion",
    "Sustainable Business"
  ];
  return (
    <div>
      <h3 className="font-semibold mb-2">Trending on LinkedIn</h3>
      <div className="flex flex-wrap gap-2">
        {topics.map(topic => (
          <button
            key={topic}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
            onClick={() => onSelect(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
} 