import { useEffect } from 'react';
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
import LoginForm from '../../features/users/LoginForm';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingConponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingConponent />;

  return (
    <>
      <NavBar />
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      <Container style={{ marginTop: '7em' }}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/activities' element={<ActivityDashboard />} />
          <Route path='/activities/:id' element={<ActivityDetail />} />
          <Route key={location.key} path='/createActivity' element={<ActivityForm />} />
          <Route key={location.key} path='/manage/:id' element={<ActivityForm />} />
          <Route path='/errors' element={<TestErrors />} />
          <Route path='/server-error' element={<ServerError />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/profiles/:username' element={<ProfilePage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default observer(App);
