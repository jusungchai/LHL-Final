import React, { useState, useEffect } from 'react'
import Completed from './Completed'
import AppBar from './Appbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import { Redirect } from 'react-router';


const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const styles = {
  button: {
    margin: 15
  }
}

const JobHistory = (props) => {
  const classes = useStyles();
  const [response, setResponse] = useState([])
  const [goBack, setGoBack] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isJobber, setIsJobber] = useState(true);

  const jobStatus = function (job) {
    if (job.jobber_id === null) {
      return "Open"
    } else if (job.jobber_id !== null && job.jobber_confirm === false && job.user_confirm === false) {
      return "In Progress"
    } else if (job.jobber_confirm === true && job.user_confirm === false) {
      return "Marked Complete. Awaiting User Confirmation"
    } else if (job.jobber_confirm === true && job.user_confirm === true) {
      return "Completed"
    }
  }

  useEffect(() => {

    axios.get('/auth', { withCredentials: true })
      .then((response) => {
        if (response.data.result !== "jobber") {
          setIsJobber(false)
        };
        if (response.data.result === "none") {
          console.log(props)
          props.history.replace('/')
          props.history.go()
          //setLoading(false)      
        } else {
          axios.get("/history", { withCredentials: true })
            .then((res) => {
              setResponse(res.data)
              console.log("JOB", res.data)
            });
          setLoading(false)
        }
      });

  }, [])

  const completedJobs = response.map(job => {
    return (
      <Completed
        key={job.id}
        jobId={job.id}
        serviceType={job.service_type}
        userName={job.name}
        streetAddress={job.street_address}
        hourlyRate={job.hourly_rate}
        timeEstimate={job.time_estimate}
        status={jobStatus(job)}
        description={job.description}
        history={props.history}
      />
    )
  })

  return loading ? null : (!goBack ?
    <MuiThemeProvider>
      <AppBar title="Job History" user={true} jobber={isJobber} client={!isJobber} />
      <h1>History</h1>
      {completedJobs}
      <Button
        onClick={() => setGoBack(true)}
        style={styles.button}
        variant="contained"
      >
        Home
      </Button>
    </MuiThemeProvider> : <Redirect to="/" />
  );
}

export default JobHistory;