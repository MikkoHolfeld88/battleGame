import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, useTheme, useMediaQuery, SvgIcon } from '@mui/material';
import { Home, Book, Info, SportsEsports } from '@mui/icons-material';
import { HOME_PATH, BLOG_BASE_PATH, ABOUT_US_PATH, GAME_CONTAINER_PATH } from '../../routes';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navLinks = [
    { to: HOME_PATH, text: t('nav.home'), icon: <Home /> },
    { to: BLOG_BASE_PATH, text: t('nav.blog'), icon: <Book /> },
    { to: ABOUT_US_PATH, text: t('nav.aboutUs'), icon: <Info /> },
  ];

  const commonNavStyles = {
    textDecoration: 'none',
    color: 'inherit',
    '&.active': {
      textDecoration: 'underline',
    },
    minWidth: 'auto',
  };

  const desktopNav = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {navLinks.map(link => (
        <Button
          key={link.to}
          component={NavLink}
          to={link.to}
          sx={commonNavStyles}
          startIcon={link.icon}
        >
          {link.text}
        </Button>
      ))}
      <Button
        component={NavLink}
        to={GAME_CONTAINER_PATH}
        variant="contained"
        color="primary"
        startIcon={<SportsEsports />}
      >
        {t('nav.play')}
      </Button>
    </Box>
  );

  const mobileNav = (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        p: 1,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {navLinks.map(link => (
        <Button
          key={link.to}
          component={NavLink}
          to={link.to}
          sx={commonNavStyles}
        >
          {link.icon}
        </Button>
      ))}
      <Button
        component={NavLink}
        to={GAME_CONTAINER_PATH}
        variant="contained"
        color="primary"
        size="small"
      >
        <SportsEsports />
      </Button>
    </Box>
  );

  return isMobile ? mobileNav : desktopNav;
};

export default Navigation;
