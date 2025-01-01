import { Box, Tabs, Tab, Collapse, Typography, Paper, Divider, Rating, Avatar } from '@mui/material';
import { useState } from 'react';
import { useGetReviewQuery } from '../../../provider/queries/Reviews.query';
import PersonIcon from '@mui/icons-material/Person';

interface ProductTabsProps {
  description: string;
  reviews: string[];
  id: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ description, reviews, id }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { data: Productreviews } = useGetReviewQuery(id);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ mt: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Paper square sx={{ borderRadius: '8px 8px 0 0' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Product details tabs"
          centered
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              color: 'text.primary',
              py: 2,
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3,
            },
          }}
        >
          <Tab label="Description" />
          <Tab label={`Reviews (${Productreviews?.data?.length || 0})`} />
        </Tabs>
      </Paper>

      <Box sx={{ 
        padding: 4, 
        backgroundColor: 'background.paper', 
        borderRadius: '0 0 8px 8px',
        minHeight: '300px'
      }}>
        {tabIndex === 0 && (
          <Collapse in={true}>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                lineHeight: 1.8,
                whiteSpace: 'pre-line'
              }}
            >
              {description}
            </Typography>
          </Collapse>
        )}

        {tabIndex === 1 && (
          <Collapse in={true}>
            {Productreviews?.data?.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Productreviews.data.map((review, index) => (
                  <Box key={index} sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.user.name}
                        </Typography>
                        <Rating 
                          value={review.rating} 
                          readOnly 
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontStyle: 'italic',
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      "{review.review}"
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '200px',
                color: 'text.secondary'
              }}>
                <Typography variant="body1">
                  No reviews yet. Be the first to review this product!
                </Typography>
              </Box>
            )}
          </Collapse>
        )}
      </Box>
    </Box>
  );
};

export default ProductTabs;