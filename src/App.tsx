import React from 'react';
import './App.css';
import TodaysJudgement from './TodaysJudgement'
import JudgementCalendar from './JudgementCalendar'
import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'

//TODO user management
//TODO pass user down into children
const USER_ID = '6RMb1MhYuju9qTiibjzm19Z80tX19anx'

function App() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TodaysJudgement />
      </Grid>
      <Grid item xs={12}>
        <JudgementCalendar />
      </Grid>
    </Grid>
  );
}

export default App;
