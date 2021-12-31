import React from 'react';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TextField from '@mui/material/TextField';
import PickersDay from '@mui/lab/PickersDay';
import {
  useQuery,
  gql
} from "@apollo/client";

const USER_ID = '6RMb1MhYuju9qTiibjzm19Z80tX19anx'

const MONTHS_EVENTS = gql`
query listMonthsEvents($userId: String!) {
  listMonthsEvents(userId: $userId) {
    items {
      userId
      eventTime
      eventType
      eventPayload {
        ... on TodayJudgedEventPayload {
          isGoodJudgement
        }
      }
    }
  }
}
`

function JudgementCalendar() {
  const [value, setValue] = React.useState(new Date());
  const { 
    loading: loadingMonthsEvents,
    error: errorLoadingMonthsEvents,
    data: monthsEventsResponse
  } = useQuery(MONTHS_EVENTS, {
    variables: { userId: USER_ID }
  });

  if (loadingMonthsEvents) return <p>Loading</p>;
  if (errorLoadingMonthsEvents) return <p>Error :(</p>;

  const monthsEvents = monthsEventsResponse.listMonthsEvents.items
  const lastJudgementByDay = monthsEvents.reduce(
    (acc: any,curr: any) => { 
      acc[curr.eventTime.substring(0,10)] = curr
      return acc 
    },
    {}
  )

  return (
    <StaticDatePicker
      orientation="landscape"
      openTo="day"
      value={value}
      onChange={(newValue) => {
        newValue && setValue(newValue);
      }}
      renderDay={
        (day, selectedDates, pickersDayProps) =>  {
          const dayJudgement = lastJudgementByDay[day.toISOString().substring(0,10)]
          return (<PickersDay 
            {...pickersDayProps}
            selected={false}
            sx={
             (dayJudgement && dayJudgement.eventPayload.isGoodJudgement) ? { backgroundColor: "green", color: "white"} :
             dayJudgement && !dayJudgement.eventPayload.isGoodJudgement && { backgroundColor: "red", color: "white"}
            }
          />) }
      }
      renderInput={(params) => <TextField {...params} />}
    />
  )
}

export default JudgementCalendar;
