import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class SettingsPage extends Component {

  render() {
    return (
      <Grid>
        <Grid.Column width={12}>
          <h1>Settings</h1>
        </Grid.Column>
        <Grid.Column width={4}>
          <h1>Nav</h1>
        </Grid.Column>
      </Grid>
    );
  }
}

export default SettingsPage;
