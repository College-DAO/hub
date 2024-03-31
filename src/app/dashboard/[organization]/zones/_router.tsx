
import { createBrowserRouter } from 'react-router-dom';
import ZonesPage from '~/app/dashboard/[organization]/zones/page';

export const router = createBrowserRouter([
  {
    path: '/zones',
    element: <ZonesPage /> 
  }
]);