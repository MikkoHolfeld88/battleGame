import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

// Import images (adjust paths as needed if they are different)
import stadium1 from '../../../assets/phase_1/stadium_1.png';
import stadium4 from '../../../assets/phase_1/stadium_4.png';
import stadium10 from '../../../assets/phase_1/stadium_10.png';
import stadium11 from '../../../assets/phase_1/stadium_11.png';

interface ImageData {
  img: string;
  titleKey: string;
  descriptionKey: string;
}

const images: ImageData[] = [
  { img: stadium1, titleKey: 'phase1.stadium1.title', descriptionKey: 'phase1.stadium1.description' },
  { img: stadium4, titleKey: 'phase1.stadium4.title', descriptionKey: 'phase1.stadium4.description' },
  { img: stadium10, titleKey: 'phase1.stadium10.title', descriptionKey: 'phase1.stadium10.description' },
  { img: stadium11, titleKey: 'phase1.stadium11.title', descriptionKey: 'phase1.stadium11.description' },
];

const Phase1BlogPost: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {t('phase1.blogTitle')}
      </Typography>
      <Grid container spacing={4}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.img}
                alt={t(image.titleKey)}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  {t(image.titleKey)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(image.descriptionKey)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Phase1BlogPost;
