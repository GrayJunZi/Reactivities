import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import { Route, Routes, useLocation } from 'react-router-dom';
import ActivityDetail from '../../features/activities/details/ActivityDetail';
import TestErrors from '../../features/errors/TestErrors';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';

function App() {
  const location = useLocation();
  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/activities' element={<ActivityDashboard />} />
          <Route path='/activities/:id' element={<ActivityDetail />} />
          <Route key={location.key} path='/createActivity' element={<ActivityForm />} />
          <Route key={location.key} path='/manage/:id' element={<ActivityForm />} />
          <Route path='/errors' element={<TestErrors />} />
          <Route path='/server-error' element={<ServerError />} />
          <Route element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default observer(App);
