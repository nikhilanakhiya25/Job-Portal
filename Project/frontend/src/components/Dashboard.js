

import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import {
  Work,
  TrendingUp,
  People,
  Assessment,
  Business
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch skill matching stats
      const statsResponse = await axios.get('http://localhost:5000/api/match/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch job matches
      const matchesResponse = await axios.get('http://localhost:5000/api/match/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(statsResponse.data);
      setMatches(matchesResponse.data.slice(0, 5)); // Show top 5 matches
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: matches.map(match => match.job.title.length > 20
      ? match.job.title.substring(0, 20) + '...'
      : match.job.title
    ),
    datasets: [{
      label: 'Match Percentage',
      data: matches.map(match => match.matchPercentage),
      backgroundColor: 'rgba(25, 118, 210, 0.6)',
      borderColor: 'rgba(25, 118, 210, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Skill Match with Available Jobs',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Match Percentage (%)'
        }
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  {stats.totalJobs}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Jobs Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Work sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  {stats.totalMatches}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jobs You Match
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  {stats.perfectMatches}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Perfect Matches (100%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" component="div">
                  {stats.averageMatch}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Match Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Skill Match Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skill Matching Analytics
            </Typography>
            {matches.length > 0 ? (
              <Box sx={{ height: 300 }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No job matches available. Upload your resume to see skill matching analytics.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Top Matches */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Top Skill Matches
            </Typography>
            {matches.length > 0 ? (
              <List>
                {matches.slice(0, 5).map((match, index) => (
                  <React.Fragment key={match.job._id}>
                    <ListItem alignItems="flex-start">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {index + 1}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" noWrap>
                            {match.job.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              <Business sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              {match.job.company}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={`${match.matchPercentage}% match`}
                                size="small"
                                color={match.matchPercentage >= 80 ? 'success' : match.matchPercentage >= 60 ? 'warning' : 'default'}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < matches.slice(0, 5).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No matches found. Consider updating your resume with more skills.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* User Skills */}
      {user?.skills && user.skills.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Skills ({user.skills.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {user.skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;
