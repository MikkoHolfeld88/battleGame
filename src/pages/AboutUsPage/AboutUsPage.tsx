import React from 'react';
import { Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";


const AboutUsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
      <>


    <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('aboutUs.title')}
        </Typography>
        <Typography variant="body1">
          {t('aboutUs.content')}
        </Typography>
      </Container>
<Footer />
    </>
  );
};

export default AboutUsPage;
