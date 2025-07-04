import { createTheme } from '@mui/material/styles';

// Define the pixel font family you want to use
const pixelFont = "'Press Start 2P', cursive"; // Ensure this font is imported in index.css or via WebFontLoader
const readablePixelFont = "'VT323', monospace"; // Ensure this font is imported

const theme = createTheme({
  palette: {
    mode: 'light', // Enforce light mode
    primary: {
      main: '#ff6347', // Tomato color from previous styling, good for accents
    },
    secondary: {
      main: '#ff9900', // Orange color from previous styling
    },
    background: {
      default: '#ffffff', // White background
      paper: '#f5f5f5', // Slightly off-white for paper elements like Cards
    },
    text: {
      primary: '#333333', // Dark grey for primary text
      secondary: '#555555', // Medium grey for secondary text
    },
  },
  typography: {
    fontFamily: readablePixelFont, // Default font for readability
    h1: {
      fontFamily: pixelFont,
      fontSize: '2.5rem', // Adjust as needed
      color: '#333333',
    },
    h2: {
      fontFamily: pixelFont,
      fontSize: '2rem',
      color: '#333333',
    },
    h3: {
      fontFamily: pixelFont,
      fontSize: '1.75rem',
      color: '#ff6347', // Accent color for subheadings
    },
    h4: {
      fontFamily: pixelFont,
      fontSize: '1.5rem',
      color: '#ff9900',
    },
    h5: {
      fontFamily: readablePixelFont,
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333333',
    },
    h6: {
      fontFamily: readablePixelFont,
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#333333',
    },
    body1: {
      fontFamily: readablePixelFont,
      fontSize: '1.1rem', // Larger body text for readability with pixel font
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: readablePixelFont,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: pixelFont,
      fontSize: '1rem', // Pixel font for buttons
      textTransform: 'none', // Keep button text as is
    },
    caption: {
      fontFamily: readablePixelFont,
    },
    overline: {
      fontFamily: readablePixelFont,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Square buttons for pixel feel
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'transparent', // Initially transparent, can be colored on variants
          boxShadow: '2px 2px 0px #000000', // Pixel-style shadow
          '&:hover': {
            boxShadow: '3px 3px 0px #000000',
            transform: 'translate(-1px, -1px)',
          },
          '&:active': {
            boxShadow: '1px 1px 0px #000000',
            transform: 'translate(1px, 1px)',
          },
        },
        containedPrimary: {
          borderColor: '#000000', // Border for contained primary buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '3px solid #222222',
          borderRadius: 0, // Square cards
          boxShadow: '4px 4px 0px #aaaaaa', // Pixel-style shadow for cards
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: 'none', // Flat app bar, border can be added if needed
                borderBottom: '3px solid #333333'
            }
        }
    },
    MuiInputBase: {
        styleOverrides: {
            root: {
                fontFamily: readablePixelFont,
                fontSize: '1.1rem',
            }
        }
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: 0, // Square input fields
                "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: '2px', // Thicker border for inputs
                    borderColor: '#333333',
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#ff6347', // Accent color on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#ff6347', // Accent color when focused
                },
            }
        }
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 0,
                border: '3px solid #333333',
                boxShadow: '4px 4px 0px #aaaaaa',
            }
        }
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontFamily: pixelFont,
            }
        }
    }
  },
});

export default theme;
