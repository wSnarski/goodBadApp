import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import Button from '@mui/material/Button';

//TODO user management
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
    variables: { userId: USER_ID }
  });
  //TODO add timezone / offset to payload
  const [judgeToday, { data: judgementResponse, loading: judgementPending, error: judgementError }] = useMutation(JUDGE_TODAY);


  if (loadingTodaysEvents || judgementPending) return <p>Loading</p>;
  if (errorLoadingTodaysEvents || judgementError) return <p>Error :(</p>;

  //TODO filter by event type
  //TODO pagination doesn't actually work because it's not hooked up in the resolver response
  const todaysEvents = todaysEventsResponse.listTodaysEvents.items
  const judgementEvent = judgementResponse && judgementResponse.judgeToday
  //TODO is it better to refetch todays events instead of using both objects?
  const activeJudgementEvent = judgementEvent || todaysEvents.slice(-1)[0]

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
