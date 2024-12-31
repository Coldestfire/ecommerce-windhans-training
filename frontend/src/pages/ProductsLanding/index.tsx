import { Card, CardContent, CardMedia, Typography, Grid, CardActionArea, Box } from "@mui/material";
import { useGetEveryProductQuery } from "../../provider/queries/Products.query";
import ProductRating from '../../components/Rating';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CardSkeleton from "../../components/CardSkeleton";

const ProductsLanding = () => {
  const { data, error, isLoading } = useGetEveryProductQuery({});
  const navigate = useNavigate();
  const [value, setValue] = useState<number | null>(3);

  // Show loading skeleton while fetching data
  if (isLoading) {
    return (
        <CardSkeleton />
    );
  }

  // Show error message if fetching fails
  if (error) {
    return <div className="text-center p-4 text-red-500">{error.message}</div>;
  }

  // Render product details once the data is available
  return (
    <Grid
      container
      spacing={4}
      justifyContent="flex-start"
      sx={{ mt: 4, px: 2 }}
    >
      {data?.data?.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
              boxShadow: 2, // Adding a subtle shadow to the card
            }}
          >
            <CardActionArea
              onClick={() => navigate(`/product/${product._id}`)}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Product Image */}
              <CardMedia
                component="img"
                image={product.images[0]}
                alt={product.name}
                sx={{
                  objectFit: "contain", // Ensures the image fits within the container
                  borderRadius: 2,
                  transition: "transform 0.3s ease-in-out",
                  height: "200px", // Maintain the fixed height
                  width: "100%", // Ensure image takes full width
                }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Product Name */}
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "#333" }}>
                  {product.name}
                </Typography>

                {/* Rating and Price */}
                <div className="flex flex-col items-start mt-1 ml-10">
                {/* Rating */}
                <ProductRating id={product._id} />
                
                {/* Product Price */}
                <p className="text-lg font-bold mt-1">
                  &#8377;{product.price.toFixed(2)}
                </p>
              </div>

              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductsLanding;
