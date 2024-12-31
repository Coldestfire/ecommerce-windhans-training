import { Box, Tabs, Tab, Collapse, Typography, Paper, Divider } from '@mui/material';
import { useState } from 'react';
import { useGetReviewQuery } from '../../../provider/queries/Reviews.query';

interface ProductTabsProps {
  description: string;
  reviews: string[];
  id: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ description, reviews, id }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const { data: Productreviews } = useGetReviewQuery(id);
  console.log("from ProductTabs: ", Productreviews)


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ mt: 4, borderRadius: 2, boxShadow: 2 }}>
      {/* Tabs for Description and Reviews */}
      <Paper square sx={{ borderRadius: '8px 8px 0 0' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Product details tabs"
          centered
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main', // Customize the tab indicator color
            },
          }}
        >
          <Tab label="Description" />
          <Tab label="Reviews" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ padding: 3, backgroundColor: 'background.paper', borderRadius: '0 0 8px 8px' }}>
        {tabIndex === 0 && (
          <Collapse in={true}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              <strong className="text-gray-900">Description:</strong>
              <Box sx={{ mt: 2 }}>
                {description}
              </Box>
            </Typography>
          </Collapse>
        )}

{tabIndex === 1 && (
  <Collapse in={true}>
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
      <strong className="text-gray-900">Reviews:</strong>
      {Productreviews.data.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          {Productreviews.data.map((review, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{review.review}" {/* This accesses the review text */}
              </Typography>
              {/* Optionally display more details about the review */}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Rating: {review.rating} stars
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No reviews yet.
        </Typography>
      )}
    </Typography>
  </Collapse>
)}

      </Box>
    </Box>
  );
};

export default ProductTabs;
