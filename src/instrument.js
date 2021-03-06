// Inspired by https://github.com/nathanmarks/material-ui/blob/textfield-performance/test/browser/fixtures/perf/TimeWaster.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import ReactPerf from 'react-addons-perf';
import warning from 'warning';

window.Perf = ReactPerf;

export default function instrument(Component, getProps = () => {}) {
  if (process.env.NODE_ENV === 'production') {
    warning(false, `The <Instrument /> component doesn't work when NODE_ENV === 'production'`);
    return Component;
  }

  return class Instrument extends React.Component {
    static propsType = {
      /**
       * Number of time the component is rendered.
       */
      loops: React.PropTypes.number,
    };

    static defaultProps = {
      loops: 50,
    };

    state = {
      step: 1,
    };

    componentDidMount() {
      ReactPerf.start();

      setTimeout(() => {
        this.setState({
          step: this.state.step + 1,
        });
      }, 0);
    }

    componentDidUpdate() {
      if (this.state.step <= this.props.loops) {
        setTimeout(() => {
          this.setState({
            step: this.state.step + 1,
          });
        }, 0);
      } else {
        setTimeout(() => {
          const measurements = ReactPerf.getLastMeasurements();

          const summaryMap = ReactPerf.getMeasurementsSummaryMap(measurements);

          ReactPerf.printInclusive(measurements);
          ReactPerf.printExclusive(measurements);
          ReactPerf.printWasted(measurements);

        // Clears measurements
          ReactPerf.start();
        }, 0);
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          {...getProps(this.state.step)}
        />
      );
    }
  };
}
