import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

// Import images
import stadium1 from '../../../assets/phase_1/stadium_1.png';
import stadium2 from '../../../assets/phase_1/stadium_2.png';
import stadium3 from '../../../assets/phase_1/stadium_3.png';
import stadium4 from '../../../assets/phase_1/stadium_4.png';
import stadium5 from '../../../assets/phase_1/stadium_5.png';
import stadium6 from '../../../assets/phase_1/stadium_6.png';
import stadium7 from '../../../assets/phase_1/stadium_7.png';
import stadium8 from '../../../assets/phase_1/stadium_8.png';
import stadium9 from '../../../assets/phase_1/stadium_9.png';
import stadium10 from '../../../assets/phase_1/stadium_10.png';
import stadium11 from '../../../assets/phase_1/stadium_11.png';

interface ImageData {
  img: string;
  titleKey: string;
  descriptionKey: string;
}

const images: ImageData[] = [
  { img: stadium1, titleKey: 'phase1.stadium1.title', descriptionKey: 'phase1.stadium1.description' },
  { img: stadium2, titleKey: 'phase1.stadium2.title', descriptionKey: 'phase1.stadium2.description' },
  { img: stadium3, titleKey: 'phase1.stadium3.title', descriptionKey: 'phase1.stadium3.description' },
  { img: stadium4, titleKey: 'phase1.stadium4.title', descriptionKey: 'phase1.stadium4.description' },
  { img: stadium5, titleKey: 'phase1.stadium5.title', descriptionKey: 'phase1.stadium5.description' },
  { img: stadium6, titleKey: 'phase1.stadium6.title', descriptionKey: 'phase1.stadium6.description' },
  { img: stadium7, titleKey: 'phase1.stadium7.title', descriptionKey: 'phase1.stadium7.description' },
  { img: stadium8, titleKey: 'phase1.stadium8.title', descriptionKey: 'phase1.stadium8.description' },
  { img: stadium9, titleKey: 'phase1.stadium9.title', descriptionKey: 'phase1.stadium9.description' },
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
                image={image.img}
                alt={t(image.titleKey)}
                sx={{
                  width: '100%', // Make image responsive
                  height: 'auto', // Adjust height automatically
                  maxHeight: '300px', // Set a max-height to avoid overly large images
                  objectFit: 'contain', // Ensure the whole image is visible, scaled down if needed
                  imageRendering: 'pixelated', // Preserve pixel art style
                  backgroundColor: 'grey.200' // Add a background for better framing
                }}
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
