import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { List } from 'semantic-ui-react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5248/api/activities').then(response => {
      setActivities(response.data);
    });
  }, []);

  const renderedItems = activities.map((activity: any) => {
    return <List.Item key={activity.id}>{activity.title}</List.Item>;
  });

  return (
    <div className="App">
      <Header as='h2' icon='users' content='Reactivities' />
      <List>
        {renderedItems}
      </List>
    </div>
  );
}

export default App;
