import React, { Component } from 'react'
import JobDetails from './JobDetails'
import ConfirmJobDetails from './ConfirmJobDetails'
import Display from './Display'

export class NewJobPost extends Component {
  state = {
    step: 1,
    serviceType: '',
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
    this.setState({[input]: e.target.value});
  }

  render() {
    const { step, serviceType, payRate, requiredTime, address, postalCode } = this.state;
    const values = { serviceType, payRate, requiredTime, address, postalCode };

    switch(step) {
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
        return (
          <Display 
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            category={values.serviceType}
            time={values.requiredTime}
            // number={values.number}
            payment={values.payRate}
            location={values.address}
          />
        )
      default:
        return <h1>hmm something went wrong</h1>
    }
  }
}

export default NewJobPost