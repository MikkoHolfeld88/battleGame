import React from 'react';
import { Box, Card, CardContent, Grid, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import Phase1BlogPost from './Phase1BlogPost'; // Assuming Phase1BlogPost is in the same directory

interface BlogPost {
    id: string;
    title: string;
    date: string;
    summary: string;
    fullText?: string;
    link?: string;
}

const blogPostsData: BlogPost[] = [
    {
        id: '1',
        title: 'Project Kick-off & Core Concepts!',
        date: 'October 26, 2023',
        summary: "Welcome to the first update! We're excited to start this journey and build BattleGame. The core concepts are laid out, and we're beginning to prototype the initial cell phase. Stay tuned for more updates as we bring these ideas to life!",
        link: '/blog/post/1', // Example internal link
    },
    {
        id: '2',
        title: 'Early Creature Evolution Mockups',
        date: 'November 05, 2023',
        summary: "This week, we've been sketching out some early ideas for creature evolution and the UI for the 'Evolution Chamber'. Trying to balance a cool pixel art aesthetic with clear information display. Some interesting challenges ahead!",
        link: '/blog/post/2', // Example internal link
    },
    {
        id: '3',
        title: 'Tech Stack Decisions: Firebase & MUI',
        date: 'November 12, 2023',
        summary: "We've solidified parts of our tech stack! Firebase will handle our backend needs including authentication and database. For the frontend, we're leveraging React with Material-UI (MUI) to build a responsive and modern interface, while still aiming for that custom game feel.",
        link: '/blog/post/3', // Example internal link
    },
];

const BlogList: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
    const { t } = useTranslation();
    return (
        <Grid container spacing={4} justifyContent="center">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Grid item xs={12} md={8} key={post.id}>
                        <Card component="article" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h4" component="h3" gutterBottom>
                                    {post.title}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary" gutterBottom sx={{ fontFamily: "'VT323', monospace" }}>
                                    {t('landingPage.blog.posts.dateFormat', { date: new Date(post.date) })}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {post.summary}
                                </Typography>
                                {post.link && (
                                    <Link href={post.link} underline="hover" sx={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9rem' }}>
                                        {t('landingPage.blog.readMore')}
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography sx={{ textAlign: 'center', width: '100%' }}>
                    {t('landingPage.blog.noPosts')}
                </Typography>
            )}
        </Grid>
    );
};


const BlogSection: React.FC = () => {
    const { t } = useTranslation();
    const { postId } = useParams<{ postId?: string }>(); // Optional postId
    const location = useLocation();

    const translatedBlogPosts: BlogPost[] = blogPostsData.map(post => ({
        ...post,
        title: t(`landingPage.blog.posts.${post.id}.title`, post.title),
        summary: t(`landingPage.blog.posts.${post.id}.summary`, post.summary),
    }));

    // Check if the current path is for the Phase 1 blog post
    const isPhase1Post = location.pathname.endsWith('/blog/phase1');

    return (
        <Box sx={{
            my: 4,
            py: 3,
            backgroundColor: 'rgba(0,0,0,0.03)',
            borderRadius: 1
        }}>
            {!isPhase1Post && !postId && ( // Only show title if not on a specific post page
                <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                    {t('landingPage.blog.title')}
                </Typography>
            )}
            {/* Outlet will render child routes, e.g., a specific blog post component */}
            {/* Or render specific components based on path */}
            {isPhase1Post ? <Phase1BlogPost /> : postId ? <Outlet /> : <BlogList posts={translatedBlogPosts} />}
        </Box>
    );
};

export default BlogSection;
