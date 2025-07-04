import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Link } from '@mui/material';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  fullText?: string; // Optional full text for a dedicated blog post page
  link?: string; // Optional external link or link to full post
}

// Sample blog post data - this would ideally come from a CMS or backend
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Project Kick-off & Core Concepts!',
    date: 'October 26, 2023',
    summary: "Welcome to the first update! We're excited to start this journey and build BattleGame. The core concepts are laid out, and we're beginning to prototype the initial cell phase. Stay tuned for more updates as we bring these ideas to life!",
  },
  {
    id: '2',
    title: 'Early Creature Evolution Mockups',
    date: 'November 05, 2023',
    summary: "This week, we've been sketching out some early ideas for creature evolution and the UI for the 'Evolution Chamber'. Trying to balance a cool pixel art aesthetic with clear information display. Some interesting challenges ahead!",
    // link: '/blog/evolution-mockups' // Example link
  },
  {
    id: '3',
    title: 'Tech Stack Decisions: Firebase & MUI',
    date: 'November 12, 2023',
    summary: "We've solidified parts of our tech stack! Firebase will handle our backend needs including authentication and database. For the frontend, we're leveraging React with Material-UI (MUI) to build a responsive and modern interface, while still aiming for that custom game feel.",
  },
];

const BlogSection: React.FC = () => {
  return (
    <Box sx={{ my: 4, py: 3, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}> {/* Light bg for section distinction */}
      <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Latest News & Updates
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <Grid item xs={12} md={8} key={post.id}> {/* Making blog posts wider */}
              <Card component="article" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h4" component="h3" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" gutterBottom sx={{fontFamily: "'VT323', monospace"}}>
                    {post.date}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {post.summary}
                  </Typography>
                  {post.link && (
                    <Link href={post.link} underline="hover" sx={{fontFamily: "'Press Start 2P', cursive", fontSize: '0.9rem'}}>
                      Read More
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', width: '100%' }}>
            No blog posts yet. Check back soon for updates!
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default BlogSection;
