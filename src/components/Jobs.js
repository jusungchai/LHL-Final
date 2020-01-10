import React, { useState, useEffect } from 'react'
import Open from './Job/Open'
import AppBar from './Appbar';
import { makeStyles } from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
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

export default function Jobs(props) {
  const classes = useStyles();
  const [response, setResponse] = useState([])
  const [goBack, setGoBack] = useState(false)
  const [accepted, setAccepted] = useState(false);

  const acceptJob = function (jobId) {
    console.log(jobId)
    axios.put(
      `/jobs/`,
      {
        params: {
          id: jobId,
          dropJob: false,
        }
      }
    )
      .then(
        (res) => {
          console.log("HERE", jobId)
          setAccepted(jobId);

        }
      )
      .catch(err => console.log(err))
  }

  useEffect(() => {
    axios.get("/jobs")
      .then((res) => {
        setResponse(res.data)
        if (props.change) {
          props.finished()
        }
      });
  }, [props.update, props.change])

  const jobs = response

  const openJobs = jobs.map(job => {
    return (
      <Open
        key={job.id}
        jobId={job.id}
        serviceType={job.service_type}
        userId={job.user_id}
        streetAddress={job.street_address}
        hourlyRate={job.hourly_rate}
        timeEstimate={job.time_estimate}
        description={job.description}
        updateAllJobs={props.updateAllJobs}
        updateMyJobs={props.updateMyJobs}
        acceptJob={(id) => acceptJob(id)} />
    )
  })

  if (goBack) {
    return <Redirect to="/" />
  } else if (accepted) {
    console.log("TRYING TO REDIRECT TO ", accepted)
    return <Redirect to={`/jobs/${accepted}`} />
  } else {
    return (
      <MuiThemeProvider>
        <AppBar title="Open Jobs" user={true} />
        <React.Fragment>
          {openJobs}

          <RaisedButton
            label="Back"
            onClick={() => setGoBack(true)}
            primary={true}
            style={styles.button}
          />
        </React.Fragment>
      </MuiThemeProvider>
    )
  }

}

const styles = {
  button: {
    margin: 15
  }
}