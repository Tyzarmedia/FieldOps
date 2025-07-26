import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  Package,
  DollarSign,
  FileText,
  Download,
  RefreshCw,
  Filter,
  Search,
  Star,
  MapPin,
  Activity,
  Timer,
  Award,
  ThumbsUp,
  ThumbsDown,
  Zap
} from "lucide-react";

interface JobAnalytics {
  totalJobs: {
    today: number;
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  jobsInProgress: number;
  jobsNotStarted: number;
  completionRate: {
    onTime: number;
    delayed: number;
    percentage: number;
  };
  slaBreaches: number;
  avgDuration: number;
  topCategories: Array<{
    category: string;
    count: number;
    avgTime: number;
    variance: number;
  }>;
  technicianPerformance: Array<{
    name: string;
    jobsCompleted: number;
    avgTime: number;
    rating: number;
    reworks: number;
  }>;
  regionBreakdown: Array<{
    region: string;
    jobCount: number;
    avgDelay: number;
    completionRate: number;
  }>;
  clientSatisfaction: {
    averageRating: number;
    totalReviews: number;
    complaints: number;
  };
}

interface JobTypeData {
  type: string;
  count: number;
  percentage: number;
  avgDuration: number;
  color: string;
}

interface WorkOrderData {
  type: 'NWI' | 'Change Control' | 'Work Order';
  count: number;
  successRate: number;
  avgCompletionTime: number;
}

export default function JobAnalyticsPage() {
  const [analytics, setAnalytics] = useState<JobAnalytics | null>(null);
  const [jobTypes, setJobTypes] = useState<JobTypeData[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrderData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
    loadJobTypesData();
    loadWorkOrderData();
  }, [selectedPeriod, selectedDepartment, dateRange]);

  const loadAnalyticsData = async () => {
    const mockAnalytics: JobAnalytics = {
      totalJobs: {
        today: 24,
        weekly: 168,
        monthly: 720,
        quarterly: 2160,
        yearly: 8640
      },
      jobsInProgress: 45,
      jobsNotStarted: 12,
      completionRate: {
        onTime: 156,
        delayed: 12,
        percentage: 92.9
      },
      slaBreaches: 8,
      avgDuration: 145,
      topCategories: [
        { category: 'Fiber Installation', count: 320, avgTime: 180, variance: 15 },
        { category: 'Network Maintenance', count: 245, avgTime: 120, variance: -8 },
        { category: 'Emergency Repairs', count: 89, avgTime: 95, variance: 22 },
        { category: 'Equipment Upgrades', count: 66, avgTime: 210, variance: 10 }
      ],
      technicianPerformance: [
        { name: 'Sipho Masinga', jobsCompleted: 78, avgTime: 135, rating: 4.8, reworks: 2 },
        { name: 'Thabo Sithole', jobsCompleted: 65, avgTime: 155, rating: 4.6, reworks: 4 },
        { name: 'Naledi Modise', jobsCompleted: 52, avgTime: 170, rating: 4.4, reworks: 6 },
        { name: 'Brenda Khumalo', jobsCompleted: 38, avgTime: 195, rating: 4.2, reworks: 8 }
      ],
      regionBreakdown: [
        { region: 'North Region', jobCount: 285, avgDelay: 12, completionRate: 94.2 },
        { region: 'South Region', jobCount: 242, avgDelay: 18, completionRate: 91.7 },
        { region: 'Central Region', jobCount: 193, avgDelay: 8, completionRate: 96.1 }
      ],
      clientSatisfaction: {
        averageRating: 4.6,
        totalReviews: 456,
        complaints: 23
      }
    };
    setAnalytics(mockAnalytics);
  };

  const loadJobTypesData = async () => {
    const mockJobTypes: JobTypeData[] = [
      { type: 'Installation', count: 320, percentage: 44.4, avgDuration: 180, color: 'bg-blue-500' },
      { type: 'Maintenance', count: 245, percentage: 34.0, avgDuration: 120, color: 'bg-green-500' },
      { type: 'Emergency', count: 89, percentage: 12.4, avgDuration: 95, color: 'bg-red-500' },
      { type: 'Audit', count: 66, percentage: 9.2, avgDuration: 60, color: 'bg-purple-500' }
    ];
    setJobTypes(mockJobTypes);
  };

  const loadWorkOrderData = async () => {
    const mockWorkOrders: WorkOrderData[] = [
      { type: 'NWI', count: 145, successRate: 94.5, avgCompletionTime: 165 },
      { type: 'Change Control', count: 89, successRate: 96.6, avgCompletionTime: 120 },
      { type: 'Work Order', count: 234, successRate: 91.2, avgCompletionTime: 140 }
    ];
    setWorkOrders(mockWorkOrders);
  };

  const handleExportReport = () => {
    toast({
      title: "Report Export",
      description: "Analytics report has been generated and will be downloaded shortly.",
    });
  };

  const handleScheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Weekly analytics report has been scheduled for delivery.",
    });
  };

  if (!analytics) {
    return <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading analytics data...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              Job Analytics - Manager Dashboard
            </h1>
            <p className="text-gray-600">
              Actionable insights from job data to drive team performance and optimize processes
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="installations">Installations</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleScheduleReport}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalJobs[selectedPeriod as keyof typeof analytics.totalJobs]}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
              <div className="text-xs text-green-600">↗ +12%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.jobsInProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-xs text-blue-600">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analytics.jobsNotStarted}</div>
              <div className="text-sm text-gray-600">Not Started</div>
              <div className="text-xs text-red-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.completionRate.percentage}%</div>
              <div className="text-sm text-gray-600">On Time Rate</div>
              <div className="text-xs text-green-600">↗ +3%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.avgDuration}m</div>
              <div className="text-sm text-gray-600">Avg Duration</div>
              <div className="text-xs text-purple-600">Target: 150m</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{analytics.slaBreaches}</div>
              <div className="text-sm text-gray-600">SLA Breaches</div>
              <div className="text-xs text-yellow-600">↘ -2</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="duration">Duration Analysis</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Job Volume Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Completion Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-b from-green-50 to-blue-50 rounded flex items-end justify-around p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-500 w-8 h-20 rounded-t"></div>
                    <span className="text-xs">Mon</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-500 w-8 h-24 rounded-t"></div>
                    <span className="text-xs">Tue</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-blue-500 w-8 h-16 rounded-t"></div>
                    <span className="text-xs">Wed</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-500 w-8 h-28 rounded-t"></div>
                    <span className="text-xs">Thu</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-500 w-8 h-22 rounded-t"></div>
                    <span className="text-xs">Fri</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span>Completed: {analytics.completionRate.onTime}</span>
                  <span>Delayed: {analytics.completionRate.delayed}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobTypes.map((jobType) => (
                    <div key={jobType.type} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{jobType.type}</span>
                        <span className="text-sm text-gray-600">{jobType.count} jobs ({jobType.percentage}%)</span>
                      </div>
                      <Progress value={jobType.percentage} className="h-2" />
                      <div className="text-xs text-gray-500">Avg Duration: {jobType.avgDuration}m</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Work Order Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Work Order Type</TableHead>
                    <TableHead>Total Count</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg Completion Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((wo) => (
                    <TableRow key={wo.type}>
                      <TableCell className="font-medium">{wo.type}</TableCell>
                      <TableCell>{wo.count}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={wo.successRate} className="w-16" />
                          <span className="font-bold">{wo.successRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{wo.avgCompletionTime}m</TableCell>
                      <TableCell>
                        <Badge className={wo.successRate > 95 ? 'bg-green-500' : wo.successRate > 90 ? 'bg-yellow-500' : 'bg-red-500'}>
                          {wo.successRate > 95 ? 'Excellent' : wo.successRate > 90 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technician Performance */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technician Job Performance Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Jobs Completed</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reworks</TableHead>
                    <TableHead>Performance Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.technicianPerformance.map((tech, index) => (
                    <TableRow key={tech.name}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tech.name}</TableCell>
                      <TableCell>{tech.jobsCompleted}</TableCell>
                      <TableCell>{tech.avgTime}m</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{tech.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tech.reworks <= 3 ? 'default' : tech.reworks <= 6 ? 'secondary' : 'destructive'}>
                          {tech.reworks}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={((tech.jobsCompleted / 100) * tech.rating * 20)} className="w-16" />
                          <span className="text-sm font-medium">
                            {((tech.jobsCompleted / 100) * tech.rating * 20).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Duration Analysis */}
        <TabsContent value="duration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Category Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCategories.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{category.avgTime}m</span>
                          {category.variance > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          <span className={`text-sm ${category.variance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {Math.abs(category.variance)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{category.count} jobs completed</div>
                      <Progress value={Math.min((150 / category.avgTime) * 100, 100)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Duration Variance Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">68%</div>
                      <div className="text-sm text-gray-600">On Schedule</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">24%</div>
                      <div className="text-sm text-gray-600">Minor Delays</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">8%</div>
                      <div className="text-sm text-gray-600">Major Delays</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">15m</div>
                      <div className="text-sm text-gray-600">Avg Variance</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Region Breakdown */}
        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Total Jobs</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Avg Delay</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.regionBreakdown.map((region) => (
                    <TableRow key={region.region}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {region.region}
                        </div>
                      </TableCell>
                      <TableCell>{region.jobCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={region.completionRate} className="w-16" />
                          <span className="font-bold">{region.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{region.avgDelay} min</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {region.completionRate > 95 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : region.completionRate > 90 ? (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {region.completionRate > 95 ? 'Excellent' : region.completionRate > 90 ? 'Good' : 'Needs Attention'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={region.completionRate > 95 ? 'bg-green-500' : region.completionRate > 90 ? 'bg-yellow-500' : 'bg-red-500'}>
                          {region.avgDelay < 10 ? 'On Track' : 'Delayed'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Satisfaction */}
        <TabsContent value="satisfaction" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Overall Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{analytics.clientSatisfaction.averageRating}/5</div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= Math.floor(analytics.clientSatisfaction.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{analytics.clientSatisfaction.totalReviews} reviews</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating}★</span>
                      <Progress value={rating === 5 ? 68 : rating === 4 ? 22 : rating === 3 ? 7 : rating === 2 ? 2 : 1} className="flex-1" />
                      <span className="text-sm text-gray-600 w-8">
                        {rating === 5 ? '68%' : rating === 4 ? '22%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Positive Reviews</span>
                    </div>
                    <span className="font-bold text-green-600">90%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Complaints</span>
                    </div>
                    <span className="font-bold text-red-600">{analytics.clientSatisfaction.complaints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Quick Resolution</span>
                    </div>
                    <span className="font-bold text-blue-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input 
                      type="date" 
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input 
                      type="date" 
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Executive Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Analytics</SelectItem>
                      <SelectItem value="performance">Performance Report</SelectItem>
                      <SelectItem value="satisfaction">Customer Satisfaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExportReport} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF
                  </Button>
                  <Button variant="outline" onClick={handleExportReport} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <div className="font-medium">Weekly Performance Summary</div>
                    <div className="text-sm text-gray-600">Every Monday at 9:00 AM</div>
                    <div className="text-xs text-green-600">Active</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium">Monthly Analytics Report</div>
                    <div className="text-sm text-gray-600">1st of every month</div>
                    <div className="text-xs text-green-600">Active</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium">Customer Satisfaction Quarterly</div>
                    <div className="text-sm text-gray-600">End of each quarter</div>
                    <div className="text-xs text-blue-600">Scheduled</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add New Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
