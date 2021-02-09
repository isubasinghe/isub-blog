import { createSystem, createBehavior } from 'xactor';


const initialState = {
    currentTerm: 0,
    votedFor: null,
    log: [],
    commitLength: 0,
    currentRole: 'follower',
    currentLeader: null,
    votesReceived: new Set(),
    sentLength: {},
    ackedLength: {}
};

const replicateLog = (state, message) => {

};

const appendEntries = (state, logLength, leaderCommit, entries) => {

};

const commitLogEntries = (state) => {

};

export const raftActor = createBehavior(
    (state, message, context) => {
        switch(message) {
            case 'vote_request':
                break;
            case 'vote_response':
                break;
            
            case 'log_request':
                break;
            case 'log_response':
                break;

            case 'broadcast':
                break;
        }
    },
    initialState
);


