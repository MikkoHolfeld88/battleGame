import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  OutlinedInput,
} from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { supportedLngs } from '../../i18n';

// ISO-Country-Codes für die Sprachen
const langToCountry: Record<string, string> = {
  en: 'US',
  de: 'DE',
  it: 'IT',
  fr: 'FR',
  es: 'ES',
  ru: 'RU',
  da: 'DK',
  sv: 'SE',
  pl: 'PL',
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangeLanguage = (e: SelectChangeEvent<string>) =>
      i18n.changeLanguage(e.target.value);

  return (
      <FormControl size="small" sx={{ m: 1, minWidth: { xs: 80, sm: 120 } }}>
        <Select
            value={i18n.resolvedLanguage || 'en'}
            onChange={handleChangeLanguage}
            input={<OutlinedInput notched={false} />}
            renderValue={(lng) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReactCountryFlag
                      countryCode={langToCountry[lng]}
                      svg
                      style={{ width: '1.2em', height: '1.2em', marginRight: isMobile ? 0 : 4 }}
                  />
                  {!isMobile && (
                      <Typography component="span" variant="body2">
                        {supportedLngs[lng as keyof typeof supportedLngs]}
                      </Typography>
                  )}
                </Box>
            )}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 0,
                  border: '2px solid #333',
                  boxShadow: '3px 3px 0px #aaaaaa',
                  mt: 0.5,
                  fontFamily: "'VT323', monospace",
                },
              },
            }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
              '.MuiSelect-icon': { color: 'inherit' },
              '.MuiSelect-select': { display: 'flex', alignItems: 'center', pr: 4 },
              fontFamily: "'VT323', monospace",
              fontSize: '1rem',
              color: 'inherit',
            }}
        >
          {Object.entries(supportedLngs).map(([lng, label]) => (
              <MenuItem
                  key={lng}
                  value={lng}
                  sx={{ fontFamily: "'VT323', monospace", fontSize: '1rem', py: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReactCountryFlag
                      countryCode={langToCountry[lng]}
                      svg
                      style={{ width: '1.2em', height: '1.2em', marginRight: 8 }}
                  />
                  <Typography component="span">{label}</Typography>
                </Box>
              </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
};

export default LanguageSwitcher;
