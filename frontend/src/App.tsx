import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.tsx';
import MainLayout from './layout/MainLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <MainLayout>
          <Outlet /> 
        </MainLayout>
      </QueryClientProvider>
    </>
  );
}

export default App;
