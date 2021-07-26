import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import data from './data.json'

const ProgressBar = (props) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 20,
    width: '90%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: "auto"
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${Math.round(completed)}%`}</span>
      </div>
    </div>
  );
};

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
        <h3> {this.props.name} </h3>
        <h4> {this.props.description} </h4>
        <span> {JSON.stringify(this.props.params)} </span>
        <Timer duration={this.props.duration} />
      </div>
    )
  }

}

class ExSequence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cur: 0,
    }
    this.next = this.next.bind(this);
  }

  next() {
    this.setState((state, props) => ({ cur: state.cur + 1 }));
    if (this.state.cur === this.props.exercises.length ) { //hack, value is updated async
      this.props.next();
    }
  }


  render() {
    let cur = this.state.cur % this.props.exercises.length;
    let displayed = <h2>Finished section!</h2>;
    if (this.state.cur < this.props.exercises.length) {
      const ex = this.props.exercises[cur];
      const _ex = data.exercises[ex.name];
      displayed = 
        <div>
          <ProgressBar bgcolor="black" completed={(this.state.cur / this.props.exercises.length) * 100} />
          <Exercise key={_ex.name}
            name={_ex.name}
            duration={ex.duration}
            description={_ex.description}
            params={ex}
            next={() => this.next()} />
        </div>
    }
    return (
      <div>
        {displayed}
        <button onClick={this.next}>Next</button>
      </div>
    )
  }
}

class SessionStart extends React.Component {


  render() {
    return (
      <div>
        <h2>Time: {this.props.time} minutes </h2>
        <br />
        <button onClick={this.props.start}>Start</button>
      </div>
    )
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      cur: 0,
    }
    this.start = this.start.bind(this);
    this.next = this.next.bind(this);
    this.sessionLength = this.sessionLength.bind(this);
    this.curSection = this.curSection.bind(this);
  }

  sessionLength() {
    let time = 0;
    for (const sec of data.plans[this.props.name].sections) {
      time += data.plans[this.props.name][sec].reduce((acc, val) => acc + val.duration, 0);
    }
    return time / 60;
  }

  start() {
    this.setState({ started: true });
  }

  next() {
    this.setState((state, props) => ({
      cur: state.cur + 1
    }));
  }

  curSection() {
    return data.plans[this.props.name]["sections"][this.state.cur];
  }

  render() {
    const finished = this.state.cur >= data.plans[this.props.name].sections.length;
    console.log(finished);
    let displayed;
    if (!this.state.started) {
      displayed = <SessionStart time={this.sessionLength()} start={() => this.start()} />;
    }
    else if (!finished) {
      displayed = <ExSequence key={this.curSection()} exercises={data.plans[this.props.name][this.curSection()]} next={() => this.next()} />;
    }
    else {
      displayed = <h2>Finished!</h2>;
    }
    return (
      <div>
        <h1>{this.props.name}</h1>
        {this.state.started && !finished && <h2>{this.curSection()}</h2>}
        {displayed}
      </div>
    )
  }
}

function App() {
  return (
    <div>
      <Session name="autumn_leaves" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
console.log(data);