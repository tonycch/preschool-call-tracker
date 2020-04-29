import React, { useState } from "react";
import Head from 'next/head';
import meetingData from '../components/meetingData.json';
import { MeetingForm } from '../components/MeetingForm';
import { MeetingsList } from '../components/MeetingList';

const sortMeetings = (arr) => arr.sort((a, b) => {
  const d1 = new Date(`${a.meetingDate}T${a.meetingTime}`);
  const d2 = new Date(`${b.meetingDate}T${b.meetingTime}`);
  return d1 - d2;
});

const filterPastMeetings = (meetings) => {
  return meetings.filter((meeting) => {
    const date = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
    return date - Date.now() > 0;
  });
};

const prepAndSortMeetings = (meetings) => {
  let result = [...meetings];
  result = filterPastMeetings(result);
  result = sortMeetings(result);
  return result;
}

export default class Home extends React.Component {

  state = {
    meetings: [],
  }

  componentDidMount() {
    const localMeetingData = localStorage.getItem('localMeetingData');

    // If no meetings are in storage, grab meetings from meetingData.json
    const loadedMeetings = localMeetingData ? JSON.parse(localMeetingData) : meetingData.meetings;

    const combined = [...loadedMeetings, ...this.state.meetings];
    const preppedMeetings = prepAndSortMeetings(combined)
    this.setState({ meetings: preppedMeetings });
  }

  addMeeting = (meeting) => {
    const preppedMeetings = prepAndSortMeetings([meeting, ...this.state.meetings])
    console.log("ogmeeting: ", meeting)
    console.log("meeting: ", preppedMeetings)

    localStorage.setItem('localMeetingData', JSON.stringify(preppedMeetings));
    this.setState({ meetings: preppedMeetings });
  }

  render() {

    return (
      <div className="container">
        <Head>
          <title>Mona Meeting Tracker</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1 className="title">
          Mona Meeting Tracker <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path></svg>
        </h1>
        <MeetingsList meetings={this.state.meetings} />
        <MeetingForm addMeeting={this.addMeeting} />

        <style jsx>{`
          * { padding: 0; margin: 0 }
          .container {
            margin: 30px auto;
            column-gap: 20px;
            max-width: 900px;
            display: grid;
            grid-template-columns: 50fr 50fr;
          }
          h1 {
            font-size: 40px;
            grid-row: 1;
            grid-column: 1 / 2;
          }
          h2 {
            font-size: 30px;
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            background-color: #F1F8FF;
            color: #000;
            font-weight: bold;
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    )
  }
}