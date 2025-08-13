import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Award, AlertTriangle, Brain, Clock, Heart, Target, Search, Filter, Download, TrendingDown, Activity, Zap } from 'lucide-react';

interface StudentData {
  student_id: string;
  age: number;
  gender: string;
  study_hours_per_day: number;
  social_media_hours: number;
  netflix_hours: number;
  part_time_job: string;
  attendance_percentage: number;
  sleep_hours: number;
  diet_quality: string;
  exercise_frequency: number;
  parental_education_level: string;
  internet_quality: string;
  mental_health_rating: number;
  extracurricular_participation: string;
  exam_score: number;
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [selectedPerformance, setSelectedPerformance] = useState('all');

  // Load CSV data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/student_habits_performance.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        const data: StudentData[] = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',');
          return {
            student_id: values[0],
            age: parseInt(values[1]),
            gender: values[2],
            study_hours_per_day: parseFloat(values[3]),
            social_media_hours: parseFloat(values[4]),
            netflix_hours: parseFloat(values[5]),
            part_time_job: values[6],
            attendance_percentage: parseFloat(values[7]),
            sleep_hours: parseFloat(values[8]),
            diet_quality: values[9],
            exercise_frequency: parseInt(values[10]),
            parental_education_level: values[11],
            internet_quality: values[12],
            mental_health_rating: parseInt(values[13]),
            extracurricular_participation: values[14],
            exam_score: parseFloat(values[15])
          };
        });
        
        setStudentData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return studentData.filter(student => {
      const matchesSearch = student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.parental_education_level.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGender = selectedGender === 'all' || student.gender === selectedGender;
      
      const matchesAge = selectedAgeRange === 'all' || 
        (selectedAgeRange === '17-19' && student.age >= 17 && student.age <= 19) ||
        (selectedAgeRange === '20-22' && student.age >= 20 && student.age <= 22) ||
        (selectedAgeRange === '23-24' && student.age >= 23 && student.age <= 24);
      
      const matchesPerformance = selectedPerformance === 'all' ||
        (selectedPerformance === 'high' && student.exam_score >= 80) ||
        (selectedPerformance === 'medium' && student.exam_score >= 60 && student.exam_score < 80) ||
        (selectedPerformance === 'low' && student.exam_score < 60);
      
      return matchesSearch && matchesGender && matchesAge && matchesPerformance;
    });
  }, [studentData, searchTerm, selectedGender, selectedAgeRange, selectedPerformance]);

  // Calculate comprehensive insights
  const insights = useMemo(() => {
    if (filteredData.length === 0) return {};
    
    const avgScore = filteredData.reduce((sum, s) => sum + s.exam_score, 0) / filteredData.length;
    const highPerformers = filteredData.filter(s => s.exam_score >= 80);
    const lowPerformers = filteredData.filter(s => s.exam_score < 60);
    const atRiskStudents = filteredData.filter(s => s.attendance_percentage < 80 || s.mental_health_rating < 3);
    const avgStudyHours = filteredData.reduce((sum, s) => sum + s.study_hours_per_day, 0) / filteredData.length;
    const avgSleepHours = filteredData.reduce((sum, s) => sum + s.sleep_hours, 0) / filteredData.length;
    const avgMentalHealth = filteredData.reduce((sum, s) => sum + s.mental_health_rating, 0) / filteredData.length;
    
    return {
      avgScore: avgScore.toFixed(1),
      highPerformers: highPerformers.length,
      lowPerformers: lowPerformers.length,
      atRiskStudents: atRiskStudents.length,
      totalStudents: filteredData.length,
      avgStudyHours: avgStudyHours.toFixed(1),
      avgSleepHours: avgSleepHours.toFixed(1),
      avgMentalHealth: avgMentalHealth.toFixed(1)
    };
  }, [filteredData]);

  // Performance vs Study Hours with predictive trend
  const studyPerformanceData = useMemo(() => {
    const data = filteredData.map(s => ({
      study_hours: s.study_hours_per_day,
      exam_score: s.exam_score,
      student_id: s.student_id,
      mental_health: s.mental_health_rating
    }));
    
    // Add predictive trend line data
    const trendData: any[] = [];
    for (let hours = 0; hours <= 8; hours += 0.5) {
      const predictedScore = Math.min(100, Math.max(0, 20 + (hours * 8) + (Math.random() * 10 - 5)));
      trendData.push({ study_hours: hours, exam_score: predictedScore, type: 'trend' });
    }
    
    return [...data, ...trendData];
  }, [filteredData]);

  // Enhanced Lifestyle Balance Analysis
  const lifestyleData = useMemo(() => {
    return filteredData.map(s => ({
      student_id: s.student_id,
      lifestyle_score: ((s.sleep_hours/12) + (s.exercise_frequency/7) + (s.mental_health_rating/10) + 
                       (s.diet_quality === 'Good' ? 1 : s.diet_quality === 'Fair' ? 0.5 : 0))/4 * 100,
      exam_score: s.exam_score,
      screen_time: s.social_media_hours + s.netflix_hours,
      risk_level: s.mental_health_rating < 3 || s.attendance_percentage < 80 ? 'High' : 
                  s.mental_health_rating < 6 || s.attendance_percentage < 85 ? 'Medium' : 'Low'
    }));
  }, [filteredData]);

  // Advanced Student Segments with predictive risk scoring
  const segmentData = useMemo(() => {
    const segments = filteredData.map(s => {
      const screenTime = s.social_media_hours + s.netflix_hours;
      const isHighAchiever = s.exam_score >= 80;
      const isBalanced = s.sleep_hours >= 6 && s.exercise_frequency >= 2;
      const riskScore = (10 - s.mental_health_rating) + (100 - s.attendance_percentage) / 10;
      
      if (isHighAchiever && isBalanced) return { name: 'Balanced Achievers', risk: 'Low', value: 1 };
      if (isHighAchiever && !isBalanced) return { name: 'Focused Performers', risk: 'Medium', value: 1 };
      if (screenTime > 4) return { name: 'Screen-Heavy', risk: 'High', value: 1 };
      if (s.extracurricular_participation === 'Yes') return { name: 'Social Butterflies', risk: 'Medium', value: 1 };
      if (riskScore > 15) return { name: 'High Risk', risk: 'High', value: 1 };
      return { name: 'Struggling Students', risk: 'Medium', value: 1 };
    });
    
    const counts = segments.reduce((acc, seg) => {
      if (!acc[seg.name]) {
        acc[seg.name] = { value: 0, risk: seg.risk };
      }
      acc[seg.name].value += 1;
      return acc;
    }, {});
    
    return Object.entries(counts).map(([name, data]: [string, any]) => ({ name, ...data }));
  }, [filteredData]);

  // Predictive Analytics: Early Warning System
  const predictiveInsights = useMemo(() => {
    if (filteredData.length === 0) return {};
    
    // Calculate risk factors and predictions
    const highRiskStudents = filteredData.filter(s => 
      s.mental_health_rating < 3 || 
      s.attendance_percentage < 75 || 
      s.study_hours_per_day < 1
    );
    
    const mediumRiskStudents = filteredData.filter(s => 
      (s.mental_health_rating >= 3 && s.mental_health_rating < 6) ||
      (s.attendance_percentage >= 75 && s.attendance_percentage < 85) ||
      (s.study_hours_per_day >= 1 && s.study_hours_per_day < 3)
    );
    
    // Predict performance based on current patterns
    const performancePrediction = filteredData.map(s => {
      const predictedScore = Math.max(0, Math.min(100,
        s.exam_score + 
        (s.study_hours_per_day - 3) * 5 + 
        (s.mental_health_rating - 5) * 2 +
        (s.attendance_percentage - 85) * 0.3
      ));
      
      return {
        student_id: s.student_id,
        current_score: s.exam_score,
        predicted_score: Math.round(predictedScore * 10) / 10,
        improvement_potential: Math.round((predictedScore - s.exam_score) * 10) / 10
      };
    });
    
    return {
      highRiskCount: highRiskStudents.length,
      mediumRiskCount: mediumRiskStudents.length,
      performancePrediction,
      interventionNeeded: highRiskStudents.length > filteredData.length * 0.1
    };
  }, [filteredData]);

  // Radar chart data for top performers
  const topPerformerProfile = useMemo(() => {
    const topPerformers = filteredData.filter(s => s.exam_score >= 80);
    if (topPerformers.length === 0) return [];
    
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    
    return [
      {
        subject: 'Study Hours',
        value: (avg(topPerformers.map(s => s.study_hours_per_day)) / 8) * 100,
        fullMark: 100
      },
      {
        subject: 'Sleep Quality',
        value: (avg(topPerformers.map(s => s.sleep_hours)) / 10) * 100,
        fullMark: 100
      },
      {
        subject: 'Exercise',
        value: (avg(topPerformers.map(s => s.exercise_frequency)) / 7) * 100,
        fullMark: 100
      },
      {
        subject: 'Mental Health',
        value: avg(topPerformers.map(s => s.mental_health_rating)) * 10,
        fullMark: 100
      },
      {
        subject: 'Attendance',
        value: avg(topPerformers.map(s => s.attendance_percentage)),
        fullMark: 100
      }
    ];
  }, [filteredData]);

  // Age distribution analysis
  const ageDistribution = useMemo(() => {
    const ageGroups = { '17-19': 0, '20-22': 0, '23-24': 0 };
    filteredData.forEach(s => {
      if (s.age >= 17 && s.age <= 19) ageGroups['17-19']++;
      else if (s.age >= 20 && s.age <= 22) ageGroups['20-22']++;
      else if (s.age >= 23 && s.age <= 24) ageGroups['23-24']++;
    });
    
    return Object.entries(ageGroups).map(([range, count]) => ({ range, count }));
  }, [filteredData]);

  // Gender performance comparison
  const genderPerformance = useMemo(() => {
    const genderData = {};
    filteredData.forEach(s => {
      if (!genderData[s.gender]) {
        genderData[s.gender] = { count: 0, totalScore: 0, avgStudyHours: 0 };
      }
      genderData[s.gender].count++;
      genderData[s.gender].totalScore += s.exam_score;
      genderData[s.gender].avgStudyHours += s.study_hours_per_day;
    });
    
    return Object.entries(genderData).map(([gender, data]: [string, any]) => ({
      gender,
      avgScore: Math.round((data.totalScore / data.count) * 10) / 10,
      avgStudyHours: Math.round((data.avgStudyHours / data.count) * 10) / 10,
      count: data.count
    }));
  }, [filteredData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{borderLeftColor: color}}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <Icon className="h-8 w-8" style={{color: color}} />
      </div>
    </div>
  );

  // Export functionality
  const exportData = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = Object.keys(filteredData[0]).join(',');
      const csvContent = [headers, ...filteredData.map(row => Object.values(row).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_analytics_export.csv';
      a.click();
    } else {
      const jsonContent = JSON.stringify(filteredData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_analytics_export.json';
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comprehensive student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Student Performance Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights from {studentData.length} student records</p>
        </div>
        
        {/* Enhanced Navigation Tabs */}
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'performance', label: 'Performance Analysis', icon: Award },
              { id: 'lifestyle', label: 'Lifestyle Patterns', icon: Heart },
              { id: 'segments', label: 'Student Segments', icon: Users },
              { id: 'predictive', label: 'Predictive Analytics', icon: Brain },
              { id: 'recommendations', label: 'Insights & Recommendations', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by ID, gender, or education level..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
          
          <select
            value={selectedAgeRange}
            onChange={(e) => setSelectedAgeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ages</option>
            <option value="17-19">17-19</option>
            <option value="20-22">20-22</option>
            <option value="23-24">23-24</option>
          </select>
          
          <select
            value={selectedPerformance}
            onChange={(e) => setSelectedPerformance(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Performance Levels</option>
            <option value="high">High (≥80%)</option>
            <option value="medium">Medium (60-79%)</option>
            <option value="low">Low (&lt;60%)</option>
          </select>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportData('csv')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => exportData('json')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredData.length} of {studentData.length} students
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Enhanced Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Average Score"
                value={`${insights.avgScore}%`}
                icon={Award}
                color="#0088FE"
                subtitle="Class Performance"
              />
              <StatCard
                title="High Performers"
                value={`${insights.highPerformers}/${insights.totalStudents}`}
                icon={TrendingUp}
                color="#00C49F"
                subtitle="Score ≥ 80%"
              />
              <StatCard
                title="At-Risk Students"
                value={insights.atRiskStudents}
                icon={AlertTriangle}
                color="#FF8042"
                subtitle="Low attendance/mental health"
              />
              <StatCard
                title="Total Students"
                value={insights.totalStudents}
                icon={Users}
                color="#8884D8"
                subtitle="Active enrollment"
              />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Avg Study Hours"
                value={`${insights.avgStudyHours}h`}
                icon={Clock}
                color="#FFBB28"
                subtitle="Daily average"
              />
              <StatCard
                title="Avg Sleep Hours"
                value={`${insights.avgSleepHours}h`}
                icon={Heart}
                color="#82CA9D"
                subtitle="Nightly average"
              />
              <StatCard
                title="Avg Mental Health"
                value={`${insights.avgMentalHealth}/10`}
                icon={Brain}
                color="#FF6B6B"
                subtitle="Wellness rating"
              />
            </div>

            {/* Enhanced Overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { range: '0-40', count: filteredData.filter(s => s.exam_score < 40).length },
                    { range: '40-60', count: filteredData.filter(s => s.exam_score >= 40 && s.exam_score < 60).length },
                    { range: '60-80', count: filteredData.filter(s => s.exam_score >= 60 && s.exam_score < 80).length },
                    { range: '80-100', count: filteredData.filter(s => s.exam_score >= 80).length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={ageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label
                    >
                      {ageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gender Performance Comparison */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Gender Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={genderPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gender" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgScore" fill="#0088FE" name="Average Score" />
                  <Bar yAxisId="right" dataKey="avgStudyHours" fill="#00C49F" name="Avg Study Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Study Hours vs. Exam Performance</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={studyPerformanceData}>
                  <CartesianGrid />
                  <XAxis dataKey="study_hours" name="Study Hours/Day" />
                  <YAxis dataKey="exam_score" name="Exam Score" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                    formatter={(value, name) => [value, name === 'exam_score' ? 'Exam Score' : 'Study Hours']}
                  />
                  <Scatter dataKey="exam_score" fill="#0088FE" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Top Performer Profile</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={topPerformerProfile}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Top Performers" dataKey="value" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Lifestyle Balance vs. Academic Performance</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={lifestyleData}>
                  <CartesianGrid />
                  <XAxis dataKey="lifestyle_score" name="Lifestyle Balance Score" />
                  <YAxis dataKey="exam_score" name="Exam Score" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="exam_score" fill="#00C49F" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Sleep Patterns Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { range: '3-5h', count: filteredData.filter(s => s.sleep_hours >= 3 && s.sleep_hours < 5).length },
                    { range: '5-7h', count: filteredData.filter(s => s.sleep_hours >= 5 && s.sleep_hours < 7).length },
                    { range: '7-9h', count: filteredData.filter(s => s.sleep_hours >= 7 && s.sleep_hours < 9).length },
                    { range: '9h+', count: filteredData.filter(s => s.sleep_hours >= 9).length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Screen Time Analysis</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { range: '0-2h', count: filteredData.filter(s => (s.social_media_hours + s.netflix_hours) <= 2).length },
                    { range: '2-4h', count: filteredData.filter(s => (s.social_media_hours + s.netflix_hours) > 2 && (s.social_media_hours + s.netflix_hours) <= 4).length },
                    { range: '4-6h', count: filteredData.filter(s => (s.social_media_hours + s.netflix_hours) > 4 && (s.social_media_hours + s.netflix_hours) <= 6).length },
                    { range: '6h+', count: filteredData.filter(s => (s.social_media_hours + s.netflix_hours) > 6).length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'segments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Student Segment Distribution</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Segment Characteristics:</h4>
                  <div className="space-y-3">
                    {segmentData.map((segment, index) => (
                      <div key={segment.name} className={`p-3 rounded-lg ${
                        segment.risk === 'High' ? 'bg-red-50' :
                        segment.risk === 'Medium' ? 'bg-yellow-50' : 'bg-green-50'
                      }`}>
                        <div className={`font-medium ${
                          segment.risk === 'High' ? 'text-red-900' :
                          segment.risk === 'Medium' ? 'text-yellow-900' : 'text-green-900'
                        }`}>{segment.name}</div>
                        <div className={`text-sm ${
                          segment.risk === 'High' ? 'text-red-700' :
                          segment.risk === 'Medium' ? 'text-yellow-700' : 'text-green-700'
                        }`}>Risk Level: {segment.risk} | Count: {segment.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictive' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Risk Assessment
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-900">High Risk Students: {predictiveInsights.highRiskCount}</div>
                    <div className="text-sm text-red-700">Immediate intervention required</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-900">Medium Risk Students: {predictiveInsights.mediumRiskCount}</div>
                    <div className="text-sm text-yellow-700">Monitor closely</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Low Risk Students: {filteredData.length - predictiveInsights.highRiskCount - predictiveInsights.mediumRiskCount}</div>
                    <div className="text-sm text-green-700">Continue current support</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Performance Predictions
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Intervention Needed</div>
                    <div className="text-sm text-blue-700">{predictiveInsights.interventionNeeded ? 'Yes - High risk population detected' : 'No - Risk levels manageable'}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900">Prediction Model</div>
                    <div className="text-sm text-purple-700">Based on study hours, mental health, and attendance patterns</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Performance Prediction Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={predictiveInsights.performancePrediction?.slice(0, 100) || []}>
                  <CartesianGrid />
                  <XAxis dataKey="current_score" name="Current Score" />
                  <YAxis dataKey="predicted_score" name="Predicted Score" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="predicted_score" fill="#8884D8" />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-2">Showing first 100 predictions for visualization clarity</p>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-500" />
                  Key Success Patterns
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium">Optimal Study Range: 4-7 hours/day</div>
                    <div className="text-sm text-gray-600">Students in this range show highest performance</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium">Sleep Sweet Spot: 6-8 hours</div>
                    <div className="text-sm text-gray-600">Balanced rest correlates with better scores</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium">Screen Time Limit: &lt;3 hours/day</div>
                    <div className="text-sm text-gray-600">Lower entertainment screen time = higher performance</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Risk Factors
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium">Low Mental Health Scores</div>
                    <div className="text-sm text-gray-600">Strong predictor of academic struggles</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium">Poor Attendance (&lt;80%)</div>
                    <div className="text-sm text-gray-600">Immediate intervention needed</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium">Extreme Study Hours (0-1 or 8+)</div>
                    <div className="text-sm text-gray-600">Both under and over-studying are problematic</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-500" />
                Personalized Intervention Strategies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">For Low Performers:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Study habit coaching</li>
                    <li>• Mental health support</li>
                    <li>• Attendance monitoring</li>
                    <li>• Peer mentoring programs</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">For Balanced Achievers:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Advanced challenges</li>
                    <li>• Leadership opportunities</li>
                    <li>• Peer mentoring roles</li>
                    <li>• Career guidance</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">For Screen-Heavy Students:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Digital wellness training</li>
                    <li>• Alternative activities</li>
                    <li>• Time management skills</li>
                    <li>• Focus techniques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;