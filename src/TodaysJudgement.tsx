import React from 'react';
import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import Button from '@mui/material/Button';

const USER_ID = '6RMb1MhYuju9qTiibjzm19Z80tX19anx'

const TODAYS_EVENTS = gql`
query listTodaysEvents($userId: String!) {
  listTodaysEvents(userId: $userId) {
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

const JUDGE_TODAY = gql`
mutation judgeToday($judgetodayinput: JudgeTodayInput!) {
  judgeToday(input: $judgetodayinput) {
    userId
    eventTime
    eventType
    eventPayload {
      isGoodJudgement
    }
  }
}
`

function TodaysJudgement() {
  const { 
    loading: loadingTodaysEvents,
    error: errorLoadingTodaysEvents,
    data: todaysEventsResponse
  } = useQuery(TODAYS_EVENTS, {
    variables: { userId: USER_ID },
    notifyOnNetworkStatusChange: true
  });

  const [judgeToday, { data: judgementResponse, loading: judgementPending, error: judgementError }] = useMutation(JUDGE_TODAY, {
    refetchQueries: [
      TODAYS_EVENTS,
      'listMonthsEvents'
    ]
  });

  const judgeTodayGood = () => {
    judgeToday({ 
      variables: { 
        judgetodayinput: {
        userId: USER_ID,
        isGoodJudgement: true
        } 
      }
    })
  }
  const judgeTodayBad = () => {
    judgeToday({ 
      variables: { 
        judgetodayinput: {
        userId: USER_ID,
        isGoodJudgement: false
        } 
      }
    })
  }

  if (loadingTodaysEvents || judgementPending) return <p>Loading</p>;
  if (errorLoadingTodaysEvents || judgementError) return <p>Error :(</p>;

  const todaysEvents = todaysEventsResponse.listTodaysEvents.items
  const activeJudgementEvent = todaysEvents.slice(-1)[0]

  if(activeJudgementEvent) {
    const isGoodJudgement = activeJudgementEvent.eventPayload.isGoodJudgement

    return (
      <div>
        <div>
          You selected {isGoodJudgement ? "GOOD" : "BAD"}
        </div>
        <div>
          {isGoodJudgement ? 
            <Button onClick={judgeTodayBad}>Select BAD instead</Button> :
            <Button onClick={judgeTodayGood}>Select GOOD instead</Button>
          }
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={judgeTodayGood}>Good</Button>
      <Button onClick={judgeTodayBad}>Bad</Button>
    </div>
  );
}

export default TodaysJudgement
