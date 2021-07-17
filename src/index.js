import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './data.json'

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: props.duration,
      remaining: props.duration,
      active: false
    };

    this.reset = this.reset.bind(this);
    this.pause = this.pause.bind(this);
    this.start = this.start.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  reset() {
    this.setState({
      remaining: this.state.duration,
      active: false,
    }
    )
  }

  pause() {
    this.setState({active: false});
  }

  start() {
    this.setState({active: true});
  }

  tick() {
    if (this.state.active) {
      if (this.state.remaining <= 0) {
        this.setState({active: false});
      }
      else {
        this.setState((state, props) => ({
          remaining: state.remaining - 1
        }));
    }
    }
  }

  render() {
    return (
      <div>
        <h2> Time:{this.state.remaining} </h2>
        <button onClick={this.start}>Start</button>
        <button onClick={this.pause}>Pause</button>
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}

class Exercise extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1> {this.props.name} </h1>
        <h2> {this.props.description} </h2>
        <Timer duration={this.props.duration} />
      </div>
    )
  }

}
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

function App() {
  const exercises = data.plans.temp.map((ex) => 
    {const _ex = data.exercises[ex.name];
    return <Exercise key={_ex.name}
      name={_ex.name}
      duration={ex.duration}
      description={_ex.description} />
    }
  );
  return (
    <div>
      <HelloMessage name="Ofer" />
      {exercises}
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
console.log(data);