import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Demo from './components/Demo';
import { routes } from './constants';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={routes.demopage} element={<Demo />} />
      <Route path='*' element={<Navigate to={routes.demopage} replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
