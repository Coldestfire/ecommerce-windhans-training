import { Card, CardActionArea, CardContent, Grid, Skeleton } from '@mui/material'


const CardSkeleton = () => {
  return (
    <Grid
        container
        spacing={4}
        justifyContent="flex-start"
        sx={{ mt: 4, px: 2 }}
      >
        {/* Skeleton for each product card */}
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
              }}
            >
              <CardActionArea sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Skeleton for Product Image */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  animation="wave"
                  sx={{ borderRadius: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Skeleton for Product Name */}
                  <Skeleton variant="text" animation="wave" sx={{fontSize: '2rem', mb: 1, width: 100}} />
                  {/* Skeleton for Rating */}
                  <Skeleton variant="text" width="60%" height={25} animation="wave" sx={{ mb: 1 }} />
                  {/* Skeleton for Product Price */}
                  <Skeleton variant="text" width="50%" height={25} animation="wave" sx={{ mb: 1 }} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
  )
}

export default CardSkeleton