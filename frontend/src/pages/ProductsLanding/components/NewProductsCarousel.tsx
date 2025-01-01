import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Card, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
}

interface NewProductsCarouselProps {
  products: Product[];
}

const NewProductsCarousel = ({ products }: NewProductsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  return (
    <Box sx={{ 
      position: 'relative',
      mb: 6,
      bgcolor: 'white',
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <Typography
        variant="h5"
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: '#1a237e',
          fontWeight: 'bold'
        }}
      >
        New Arrivals
      </Typography>

      <Box sx={{ position: 'relative', height: 400 }}>
        <Box sx={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${currentIndex * 100}%)`,
          height: '100%'
        }}>
          {products.map((product) => (
            <Card
              key={product._id}
              sx={{
                minWidth: '100%',
                height: '100%',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <CardMedia
                component="img"
                image={product.images[0]}
                alt={product.name}
                sx={{
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
              {/* Overlay with product details */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: 'white',
                  p: 3
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 1,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {product.name}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  ₹{product.price.toFixed(2)}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>

        <IconButton
          onClick={handlePrevious}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
          }}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
          }}
        >
          <NavigateNextIcon />
        </IconButton>

        <Box sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 1
        }}>
          {products.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'primary.main' : 'grey.300',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default NewProductsCarousel;