import React, { Component } from 'react';
import ReviewList from './ReviewList';
import Sidebar from './Sidebar';

class App extends Component {
  constructor() {
    super();

    this.state = {
      reviews: [],
      filterReviews: [],
      filterCounter: 0,
      hide5Stars: false,
      hide4Stars: false,
      hide3Stars: false,
      hide2Stars: false,
      hide1Stars: false,
      style: 'none',
    };

    this.handleChange = this.handleChange.bind(this);
    this.filterReviewList = this.filterReviewList.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
  }

  componentDidMount() {
    fetch(' http://52.26.193.201:3000/reviews/1/list')
      .then(res => res.json())
      .then(data => this.setState({
        reviews: data.results,
        filterReviews: data.results,
      }));
  }

  filterReviewList(e) {
    //toggle
    this.setState({
      style: 'block'
    })
    this.toggleSelected(e)
  }

  componentDidUpdate(previousProps, previousState) {
    let { filterReviews, reviews } = this.state;
    let newArr = [];
    let stateEntries = Object.entries(this.state);
    for (let j = 0; j < stateEntries.length; j++) {
      if (!stateEntries[j][1] && !Array.isArray(stateEntries[j][1])) {
        let num = Number(stateEntries[j][0].substring(4, 5))
        for (let k = 0; k < reviews.length; k++) {
          if (reviews[k].rating === num) {
            newArr.push(reviews[k])
          }
        }
      }
    }
    let previousStateStrung = JSON.stringify(previousState)
    if (previousStateStrung !== JSON.stringify(this.state)) {
      this.setState({
        filterReviews: newArr,
      });
    }
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState(() => {
      return {
        value,
      };
    });
  }

  toggleSelected(e) {
    const stateEntries = Object.entries(this.state);
    let { filterCounter } = this.state;
    let { hide5Stars, hide4Stars, hide3Stars, hide2Stars, hide1Stars } = this.state;
    for (let i = 0; i < stateEntries.length; i++) {
      if (filterCounter === 0 && stateEntries[i][0].includes(Number(e.target.innerText[0]))) {
        this.setState({
          hide5Stars: true,
          hide4Stars: true,
          hide3Stars: true,
          hide2Stars: true,
          hide1Stars: true,
          filterCounter: 1,
        });
        this.setState(prevState => ({
          [stateEntries[i][0]]: !prevState[stateEntries[i][0]],
        }));
      } else if (!Array.isArray(stateEntries[i][1]) && stateEntries[i][0].includes(Number(e.target.innerText[0]))) {
        this.setState(prevState => ({
          [stateEntries[i][0]]: !prevState[stateEntries[i][0]],
        }));
      }
    }
  }

  render() {
    const { reviews, filterReviews, hide5Stars, hide4Stars, hide3Stars, hide2Stars, hide1Stars, style } = this.state;
    return (
      <div className="sidebarAndRatings">
        <Sidebar
          reviewData={filterReviews}
          filter={this.filterReviewList}
          hide5Stars={hide5Stars}
          hide4Stars={hide4Stars}
          hide3Stars={hide3Stars}
          hide2Stars={hide2Stars}
          hide1Stars={hide1Stars}
          style={style}
        />
        <ReviewList
          reviewData={filterReviews}
        />
      </div>
    );
  }
}

export default App;
