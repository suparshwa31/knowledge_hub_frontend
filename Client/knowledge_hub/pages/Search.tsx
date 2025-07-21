import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { 
  Send, 
  Brain, 
  ArrowLeft,
  FileText,
  ExternalLink,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Sparkles,
  Clock,
  Search as SearchIcon
} from "lucide-react";

interface SearchResult {
  id: string;
  query: string;
  response: string;
  sources: {
    id: string;
    title: string;
    excerpt: string;
    page?: number;
    confidence: number;
  }[];
  timestamp: Date;
  loading?: boolean;
}

interface SuggestedQuery {
  id: string;
  text: string;
  category: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQueries: SuggestedQuery[] = [
    { id: "1", text: "What is the main objective of Sprint 1?", category: "Project Planning" },
    { id: "2", text: "How do I set up the vector store?", category: "Technical" },
    { id: "3", text: "What technologies are recommended for RAG?", category: "Technology" },
    { id: "4", text: "What are the deployment options?", category: "Infrastructure" },
  ];

  const mockResponses = [
    {
      response: "Based on your documents, Sprint 1 focuses on establishing the project foundation with authentication, CI/CD, and deployment. The main objective is to set up a monorepo structure with Next.js frontend, FastAPI backend, PostgreSQL database, and integrate authentication using Clerk or Auth0.",
      sources: [
        {
          id: "1",
          title: "Knowledge Hub Project Sprints",
          excerpt: "Sprint 1: Project Setup & Authentication - Establish project foundation with auth, CI/CD, and deployment.",
          page: 1,
          confidence: 0.95
        },
        {
          id: "2", 
          title: "Knowledge Hub Project Sprints",
          excerpt: "Set up monorepo structure (frontend/, backend/, shared/) - Initialize Next.js (App Router) with TailwindCSS + TypeScript",
          page: 1,
          confidence: 0.88
        }
      ]
    },
    {
      response: "To set up the vector store, you should use a background worker (Celery or simple FastAPI queue) and choose between Supabase Vector or Qdrant for storing vectors. The process involves generating embeddings using OpenAI or HuggingFace, storing them with ~500 token chunks, and creating a backend search endpoint with vector + keyword fallback.",
      sources: [
        {
          id: "3",
          title: "Knowledge Hub Project Sprints", 
          excerpt: "Sprint 3: Embedding & Vector Store Setup - Use OpenAI or HuggingFace for generating embeddings - Store vectors in Supabase Vector or Qdrant",
          page: 1,
          confidence: 0.92
        }
      ]
    }
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    const newResult: SearchResult = {
      id: Date.now().toString(),
      query: searchQuery,
      response: "",
      sources: [],
      timestamp: new Date(),
      loading: true
    };

    setResults(prev => [...prev, newResult]);
    setQuery("");

    // Simulate API call
    setTimeout(() => {
      const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setResults(prev => prev.map(result => 
        result.id === newResult.id 
          ? { ...result, ...mockResponse, loading: false }
          : result
      ));
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [results]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Knowledge Hub</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/upload">
                <Button variant="outline" size="sm">Upload Docs</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="max-w-4xl mx-auto space-y-6">
              {results.length === 0 ? (
                <div className="text-center space-y-8 mt-20">
                  <div className="space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Ask your Knowledge Hub</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Search through your documents using natural language. Get instant answers with source citations.
                    </p>
                  </div>

                  {/* Suggested Queries */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestedQueries.map((suggestion) => (
                        <Card 
                          key={suggestion.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleSuggestedQuery(suggestion.text)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.category}
                              </Badge>
                              <p className="text-sm">{suggestion.text}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {results.map((result) => (
                    <div key={result.id} className="space-y-4">
                      {/* User Query */}
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 max-w-2xl">
                          <p>{result.query}</p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex space-x-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-4">
                          {result.loading ? (
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Searching through your documents...</span>
                            </div>
                          ) : (
                            <>
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm leading-relaxed">{result.response}</p>
                                <div className="flex items-center space-x-2 mt-3">
                                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.response)}>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Helpful
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    Not helpful
                                  </Button>
                                </div>
                              </div>

                              {/* Sources */}
                              {result.sources.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-muted-foreground">Sources:</h4>
                                  {result.sources.map((source) => (
                                    <Card key={source.id} className="border-l-4 border-l-primary">
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between">
                                          <div className="space-y-1 flex-1">
                                            <div className="flex items-center space-x-2">
                                              <FileText className="h-4 w-4 text-muted-foreground" />
                                              <p className="text-sm font-medium">{source.title}</p>
                                              {source.page && (
                                                <Badge variant="outline" className="text-xs">
                                                  Page {source.page}
                                                </Badge>
                                              )}
                                              <Badge variant="secondary" className="text-xs">
                                                {Math.round(source.confidence * 100)}% match
                                              </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{source.excerpt}</p>
                                          </div>
                                          <Button variant="ghost" size="sm">
                                            <ExternalLink className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{result.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Search Input */}
          <div className="border-t bg-background/95 backdrop-blur p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ask anything about your documents..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    className="pr-12"
                  />
                  <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <Button 
                  onClick={() => handleSearch(query)}
                  disabled={!query.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Ask questions in natural language and get AI-powered answers from your documents
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-muted/30 p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Recent Searches</h3>
            <div className="space-y-2">
              {results.slice(-3).reverse().map((result) => (
                <div 
                  key={result.id}
                  className="p-3 bg-background rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setQuery(result.query)}
                >
                  <p className="text-sm line-clamp-2">{result.query}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.timestamp.toLocaleDateString()}
                  </p>
                </div>
              ))}
              {results.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent searches</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Search Tips</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Be specific</p>
                <p>Ask detailed questions for better results</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Use context</p>
                <p>Reference specific documents or sections</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Follow up</p>
                <p>Ask related questions to dive deeper</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Document Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Documents</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Indexed Pages</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Updated</span>
                <span className="font-medium">2 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
