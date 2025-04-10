import styled from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardMedia,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dog } from '../types/types';

const MatchCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const DogImage = styled(CardMedia)`
  height: 300px;
  
  @media (max-width: 600px) {
    height: 250px;
  }
`;

const MatchInfo = styled(Box)`
  padding: 20px;
  text-align: center;
`;

const ChipContainer = styled(Stack)`
  flex-wrap: wrap;
  justify-content: center;
`;

interface MatchResultProps {
  dog: Dog;
  onClose: () => void;
}

const MatchResult = ({ dog, onClose }: MatchResultProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={!!dog} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      slotProps={{ 
        paper: { 
          sx: { 
            borderRadius: isMobile ? '16px 16px 0 0' : '16px',
            margin: isMobile ? '0 auto' : undefined,
            position: isMobile ? 'absolute' : undefined,
            bottom: isMobile ? 0 : undefined,
            width: isMobile ? '100%' : undefined,
          } 
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 0, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        px: 3,
        pt: 3
      }}>
        <IconButton 
          aria-label="close" 
          onClick={onClose}
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600, fontSize: isMobile ? '1.5rem' : '1.75rem' }}>
            It's a Match!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You've been matched with the perfect dog for adoption
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <MatchCard>
          <DogImage 
            image={dog.img} 
            title={`Photo of ${dog.name}`} 
            sx={{ backgroundPosition: 'center center' }} 
          />
          <MatchInfo>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600, fontSize: isMobile ? '1.75rem' : '2rem' }}>
              {dog.name}
            </Typography>
            <ChipContainer direction="row" spacing={1} mb={2}>
              <Chip 
                label={`${dog.age} ${dog.age === 1 ? 'year' : 'years'} old`}
                size={isMobile ? "small" : "medium"}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={dog.breed}
                size={isMobile ? "small" : "medium"}
                color="primary" 
                variant="outlined"
              />
              <Chip 
                label={`ZIP: ${dog.zip_code}`}
                size={isMobile ? "small" : "medium"}
                color="primary"
                variant="outlined"
              />
            </ChipContainer>
            <Typography variant="body1">
              Congratulations! You've been matched with {dog.name}, a {dog.age}-year-old {dog.breed}. 
              This adorable pup is waiting for you to bring them home!
            </Typography>
          </MatchInfo>
        </MatchCard>
      </DialogContent>
      <DialogActions sx={{ 
        padding: '16px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Button 
          onClick={onClose} 
          color="primary" 
          variant="contained" 
          size={isMobile ? "medium" : "large"}
          sx={{ 
            color: 'white',
            maxWidth: '500px',
            width: '100%'
          }}
        >
          Continue Browsing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchResult; 