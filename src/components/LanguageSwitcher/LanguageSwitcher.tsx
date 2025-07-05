import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, MenuItem, Select, SelectChangeEvent, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { supportedLngs } from '../../i18n';

// Simple flag emojis for demonstration. Consider a more robust solution for production.
const languageFlags: { [key: string]: string } = {
  en: '🇺🇸', // Using US flag for English as a common convention
  de: '🇩🇪',
  it: '🇮🇹',
  fr: '🇫🇷',
  es: '🇪🇸',
  ru: '🇷🇺',
  da: '🇩🇰',
  sv: '🇸🇪',
  pl: '🇵🇱',
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for small screens

  const handleChangeLanguage = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: { xs: 80, sm: 120 } }} size="small"> {/* Responsive minWidth */}
      <Select
        value={i18n.resolvedLanguage || 'en'}
        onChange={handleChangeLanguage}
        renderValue={(selectedValue) => ( // Custom renderValue to show only flag on mobile
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ mr: isMobile ? 0 : 0.5, fontSize: '1.2rem' }}>{languageFlags[selectedValue] || '🏳️'}</Box>
            {!isMobile && <Typography component="span" variant="inherit" sx={{fontSize: '0.9rem'}}>{supportedLngs[selectedValue as keyof typeof supportedLngs]}</Typography>}
          </Box>
        )}
        variant="outlined"
        sx={{
          color: 'inherit',
          fontFamily: "'VT323', monospace", // Matching header style
          fontSize: '1rem',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent', // Keep it clean, like other header elements
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)', // Standard hover effect
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main', // Focus effect
          },
          '.MuiSelect-icon': {
            color: 'inherit',
          },
          // Ensure text and icon are visible, especially if AppBar color is transparent or light
          '& .MuiSelect-select': {
            paddingRight: '28px', // Make space for icon and flag
            display: 'flex',
            alignItems: 'center',
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 0, // Match theme
              border: '2px solid #333',
              boxShadow: '3px 3px 0px #aaaaaa',
              mt: 0.5,
              fontFamily: "'VT323', monospace",
            },
          },
        }}
      >
        {Object.keys(supportedLngs).map((lng) => (
          <MenuItem
            key={lng}
            value={lng}
            sx={{ fontFamily: "'VT323', monospace", fontSize: '1rem' }}
          >
            <Box component="span" sx={{ mr: 1, fontSize: '1.2rem' }}>{languageFlags[lng] || '🏳️'}</Box>
            <Typography component="span" variant="inherit">{supportedLngs[lng as keyof typeof supportedLngs]}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
