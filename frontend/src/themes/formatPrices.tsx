export const formatIndianPrice = (price: number): string => {
  // Convert to string with 2 decimal places
  const priceString = price.toFixed(2);
  const [wholePart] = priceString.split('.');
  
  // Format according to Indian numbering system
  const lastThree = wholePart.slice(-3);
  const otherNumbers = wholePart.slice(0, -3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return `₹${otherNumbers ? formatted + ',' + lastThree : lastThree}`;
};    