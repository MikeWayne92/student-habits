# 🎓 Student Performance Analytics Dashboard

A comprehensive, interactive dashboard for analyzing student performance data with predictive analytics and advanced insights.

## ✨ Features

### 📊 **Core Analytics**
- **Performance Analysis**: Study hours vs. exam scores correlation
- **Lifestyle Patterns**: Sleep, exercise, and mental health impact analysis
- **Student Segmentation**: Behavioral clustering with risk assessment
- **Predictive Modeling**: Early warning system and performance predictions

### 🔍 **Advanced Features**
- **Real-time Data Loading**: CSV data integration (1,000+ student records)
- **Interactive Filtering**: Search, gender, age, and performance filters
- **Export Functionality**: CSV and JSON data export
- **Responsive Design**: Mobile-optimized interface
- **Risk Assessment**: Predictive risk scoring for intervention planning

### 📈 **Visualizations**
- Scatter plots for correlation analysis
- Radar charts for performance profiles
- Pie charts for segment distribution
- Bar charts for performance ranges
- Age and gender performance comparisons

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MikeWayne92/student-habits.git
   cd student-habits
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
student-habits/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── student_analytics_dashboard.tsx  # Main dashboard component
│   ├── index.tsx           # React entry point
│   └── index.css           # Global styles with Tailwind
├── student_habits_performance.csv   # Student dataset (1,000+ records)
├── analysis_plan.md         # Analytics strategy and implementation plan
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```

## 🔧 Data Structure

The dashboard analyzes comprehensive student data including:

| Field | Type | Description |
|-------|------|-------------|
| `student_id` | String | Unique student identifier |
| `age` | Number | Student age (17-24) |
| `gender` | String | Gender (Female/Male/Other) |
| `study_hours_per_day` | Number | Daily study time (0.0-7.4 hours) |
| `social_media_hours` | Number | Social media usage (0.0-5.0 hours) |
| `netflix_hours` | Number | Netflix viewing time (0.0-5.0 hours) |
| `attendance_percentage` | Number | Class attendance (61.9-100.0%) |
| `sleep_hours` | Number | Daily sleep duration (3.9-9.5 hours) |
| `diet_quality` | String | Diet assessment (Poor/Fair/Good) |
| `exercise_frequency` | Number | Weekly exercise sessions (0-6 times) |
| `mental_health_rating` | Number | Mental health score (1-10 scale) |
| `exam_score` | Number | Academic performance (26.8-100.0%) |

## 📊 Dashboard Sections

### 1. **Overview**
- Key performance metrics
- Performance distribution charts
- Age and gender analysis
- Student count and averages

### 2. **Performance Analysis**
- Study hours vs. exam scores correlation
- Top performer profiles (radar charts)
- Performance prediction trends

### 3. **Lifestyle Patterns**
- Lifestyle balance scoring
- Sleep patterns distribution
- Screen time analysis
- Exercise frequency impact

### 4. **Student Segments**
- Behavioral clustering analysis
- Risk level assessment
- Segment characteristics
- Population distribution

### 5. **Predictive Analytics** 🆕
- Early warning system
- Risk assessment (High/Medium/Low)
- Performance prediction models
- Intervention recommendations

### 6. **Insights & Recommendations**
- Success pattern identification
- Risk factor analysis
- Personalized intervention strategies
- Best practice recommendations

## 🎯 Key Insights

### **Success Patterns**
- **Optimal Study Range**: 4-7 hours/day shows highest performance
- **Sleep Sweet Spot**: 6-8 hours correlates with better scores
- **Screen Time Limit**: <3 hours/day entertainment time for optimal performance

### **Risk Factors**
- Low mental health scores (<3) strongly predict academic struggles
- Poor attendance (<80%) requires immediate intervention
- Extreme study hours (0-1 or 8+) are problematic

### **Intervention Strategies**
- **Low Performers**: Study coaching, mental health support, peer mentoring
- **Balanced Achievers**: Advanced challenges, leadership opportunities
- **Screen-Heavy Students**: Digital wellness training, time management skills

## 🚀 Deployment

### GitHub Pages
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   - Push to GitHub repository
   - Enable GitHub Pages in repository settings
   - Set source to `/docs` or `/gh-pages` branch

### Other Platforms
- **Netlify**: Drag and drop `build` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload `build` folder to S3 bucket

## 🔍 Data Analysis Capabilities

### **Correlation Analysis**
- Study hours vs. academic performance
- Lifestyle factors vs. exam scores
- Mental health vs. attendance patterns

### **Predictive Modeling**
- Performance prediction based on current habits
- Risk assessment for early intervention
- Success probability calculations

### **Segmentation Analysis**
- Behavioral clustering algorithms
- Risk profiling and categorization
- Demographic performance comparisons

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Charts**: Recharts (D3-based)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Data Processing**: CSV parsing + advanced analytics

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Adaptive layouts with touch-friendly controls
- **Mobile**: Single-column layouts with optimized navigation

## 🔒 Data Privacy

- All data processing happens client-side
- No data is sent to external servers
- CSV files remain local to the application
- Export functionality downloads data locally

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or support:
- Create an issue in the GitHub repository
- Check the documentation in `analysis_plan.md`
- Review the code comments for implementation details

---

**Built with ❤️ for educational analytics and student success**
