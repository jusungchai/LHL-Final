import React, { Component } from 'react'
import JobDetails from './JobDetails'
import ConfirmJobDetails from './ConfirmJobDetails'
import { Redirect } from 'react-router';

export class NewJobPost extends Component {

  state = {
    step: 1,
    serviceType: '',
    description: '',
    payRate: '',
    requiredTime: '',
    address: '',
    postalCode: ''
  }

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  }

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  }

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  }

  render() {
    const { step, serviceType, description, payRate, requiredTime, address, postalCode } = this.state;
    const values = { serviceType, description, payRate, requiredTime, address, postalCode };

    switch (step) {
      case 1:
        return (
          <JobDetails
            nextStep={this.nextStep}
            browser={this.props.history}
            handleChange={this.handleChange}
            values={values}
          />
        )
      case 2:
        return (
          <ConfirmJobDetails
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            values={values}
          />
        )
      case 3:
        this.props.updateMyJobs()
        this.props.updateAllJobs()
        setTimeout(() => {
          this.props.updateAllJobs()
          this.props.updateMyJobs()
        }, 1000)
        return (
          <Redirect to="/myjobs"
            connect={true}
            change={this.props.change}
            connected={this.props.connected}
            finished={this.props.finished}
            updateAllJobs={this.props.updateAllJobs}
            updateMyJobs={this.props.updateMyJobs}
            update={this.props.update}
          />
        )
      default:
        return <h1>hmm something went wrong</h1>
    }
  }
}

export default NewJobPost
