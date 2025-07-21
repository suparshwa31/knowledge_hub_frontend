import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { 
  Brain, 
  ArrowLeft,
  FileText,
  Search,
  Upload,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Filter,
  Plus
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'url' | 'text';
  size: number;
  status: 'completed' | 'processing' | 'error';
  uploadedAt: Date;
  lastAccessed: Date;
  searchCount: number;
}

interface SearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  responseTime: number;
  satisfaction?: 'helpful' | 'not_helpful';
}

export default function Dashboard() {
  const [searchFilter, setSearchFilter] = useState("");
  
  const documents: Document[] = [
    {
      id: "1",
      name: "Knowledge Hub Project Sprints.pdf",
      type: "pdf",
      size: 2048000,
      status: "completed",
      uploadedAt: new Date(2024, 0, 15),
      lastAccessed: new Date(2024, 0, 20),
      searchCount: 45
    },
    {
      id: "2", 
      name: "API Documentation",
      type: "url",
      size: 512000,
      status: "completed",
      uploadedAt: new Date(2024, 0, 14),
      lastAccessed: new Date(2024, 0, 19),
      searchCount: 23
    },
    {
      id: "3",
      name: "Meeting Notes - Sprint Planning",
      type: "text",
      size: 128000,
      status: "processing",
      uploadedAt: new Date(2024, 0, 20),
      lastAccessed: new Date(2024, 0, 20),
      searchCount: 0
    },
    {
      id: "4",
      name: "Technical Requirements.pdf",
      type: "pdf", 
      size: 1024000,
      status: "error",
      uploadedAt: new Date(2024, 0, 18),
      lastAccessed: new Date(2024, 0, 18),
      searchCount: 0
    }
  ];

  const recentQueries: SearchQuery[] = [
    {
      id: "1",
      query: "What is the main objective of Sprint 1?",
      timestamp: new Date(2024, 0, 20, 14, 30),
      responseTime: 1.2,
      satisfaction: "helpful"
    },
    {
      id: "2",
      query: "How do I set up the vector store?", 
      timestamp: new Date(2024, 0, 20, 13, 45),
      responseTime: 1.8,
      satisfaction: "helpful"
    },
    {
      id: "3",
      query: "What technologies are recommended for RAG?",
      timestamp: new Date(2024, 0, 20, 12, 15),
      responseTime: 2.1,
      satisfaction: "not_helpful"
    }
  ];

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'url': return '🔗';
      case 'text': return '📝';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
              <Link to="/search">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your knowledge base performance and usage</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2</span> from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18%</span> from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.6s</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-0.2s</span> from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+3%</span> from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Document Library</CardTitle>
                      <CardDescription>Manage your uploaded documents and their processing status</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Input
                          placeholder="Search documents..."
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          className="w-64"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getTypeIcon(doc.type)}</div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{doc.name}</p>
                              {getStatusIcon(doc.status)}
                              <Badge variant="outline" className="text-xs">
                                {doc.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(doc.size)}</span>
                              <span>Uploaded {doc.uploadedAt.toLocaleDateString()}</span>
                              <span>{doc.searchCount} searches</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Volume Trend</CardTitle>
                    <CardDescription>Daily search queries over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {[42, 38, 45, 52, 48, 61, 55, 47, 58, 63, 59, 67, 72, 68].map((height, i) => (
                        <div
                          key={i}
                          className="bg-primary rounded-t flex-1"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Most Searched Documents</CardTitle>
                    <CardDescription>Top performing documents this week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {documents
                      .filter(doc => doc.status === 'completed')
                      .sort((a, b) => b.searchCount - a.searchCount)
                      .slice(0, 5)
                      .map((doc, index) => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium text-muted-foreground">
                              #{index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.searchCount} searches</p>
                            </div>
                          </div>
                          <Progress value={(doc.searchCount / 45) * 100} className="w-16" />
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Distribution</CardTitle>
                    <CardDescription>Query response times over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                                                <span className="text-sm">&lt; 1s</span>
                        <div className="flex-1 mx-4">
                          <Progress value={65} />
                        </div>
                        <span className="text-sm text-muted-foreground">65%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1-2s</span>
                        <div className="flex-1 mx-4">
                          <Progress value={25} />
                        </div>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">2-5s</span>
                        <div className="flex-1 mx-4">
                          <Progress value={8} />
                        </div>
                        <span className="text-sm text-muted-foreground">8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                                                <span className="text-sm">&gt; 5s</span>
                        <div className="flex-1 mx-4">
                          <Progress value={2} />
                        </div>
                        <span className="text-sm text-muted-foreground">2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Feedback</CardTitle>
                    <CardDescription>Satisfaction ratings for search results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Helpful</span>
                        </div>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Not Helpful</span>
                        </div>
                        <span className="text-sm font-medium">6%</span>
                      </div>
                      <div className="mt-4">
                        <Progress value={94} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Search Queries</CardTitle>
                  <CardDescription>Latest searches and their performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQueries.map((query) => (
                      <div key={query.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{query.query}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{query.timestamp.toLocaleString()}</span>
                            <span>{query.responseTime}s response</span>
                            {query.satisfaction && (
                              <Badge variant={query.satisfaction === 'helpful' ? 'default' : 'secondary'}>
                                {query.satisfaction === 'helpful' ? '👍 Helpful' : '👎 Not helpful'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
