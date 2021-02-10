import { createSystem, createBehavior } from 'xactor';


const follower = () => {
    return 'follower';
}

const leader = () => {
    return 'leader';
}

const candidate = () => {
    return 'candidate';
}

const VoteRequest = (id, term, logLength, lastTerm) => {
    return {
        type: 'vote_request',
        id,
        term,
        logLength, 
        lastTerm
    };
}

const VoteResponse = (id, term, success) => {
    return {
        type: 'vote_response',
        id, 
        term, 
        success
    };
};

const LogRequest = (id, term, ack, success) => {
    return {
        type: 'log_request',
        id,
        term,
        ack, 
        success
    }
};

const LogResponse = () => {

};

const Broadcast = (msg) => {
    return {
        type: 'broadcast',
        msg

    }
};

const initialState = {
    currentTerm: 0,
    votedFor: null,
    log: [],
    commitLength: 0,
    currentRole: follower(),
    currentLeader: null,
    votesReceived: new Set(),
    sentLength: {},
    ackedLength: {},
    nodes = {}
};

const replicateLog = (state, leaderId, followerId) => {
    let i = state.sentLength[follower];
    let entries = []
    for(let j = 0; j < state.log.length; j++) {
        entries.push(state.log[j]);
    }
    let prevLogTerm = 0;
    if (i > 0) {
        prevLogTerm = state.log[i - 1].term;
    }
    state.nodes[followerId].send(LogRequest(leaderId, state.currentTerm, i, prevLogTerm, state.commitLength, entries));
};

const appendEntries = (state, logLength, leaderCommit, entries) => {

};

const commitLogEntries = (state) => {

};

export const raftActor = (id) => {
    return createBehavior(
        (state, message, context) => {
            switch(message) {
                case 'vote_request':
                    const myLogTerm= state.log[state.log.length - 1]?.term ?? 0;
                    const logOk = (message.lastTerm > myLogTerm) || (message.lastTerm === myLogTerm && message.logLength >= state.log.length);
                    const termOk = (message.term > state.currentTerm) || (message.term === state.currentTerm && (state.votedFor === null || state.votedFor === message.id));
                    
                    if (logOk && termOk) {
                        state.currentTerm = message.term;
                        state.currentRole = follower();
                        state.votedFor = message.id;
                        state.nodes[id].send(VoteResponse(id, state.currentTerm, true));
                    }
                    state.nodes[id].send(VoteResponse(id, state.currentTerm, false));
                    break;
                case 'vote_response':
                    if (state.currentRole === follower() && message.term === state.currentTerm && message.success) {
                        state.votesReceived.add(message.id);
                        if (state.votesReceived.size >= ( Object.keys(state.nodes).length + 1)/2 ) {
                            state.currentLeader = id;
                            state.currentRole = leader();
                            for (const [followerId, _] of Object.entries(object)) {
                                state.ackedLength[followerId] = 0;
                                state.sentLength[followerId] = state.log.length;
                                replicateLog(state, state.currentLeader, followerId);
                            }
                        }
                    }else if (message.term > state.currentTerm) {
                        state.currentTerm = message.term;
                        state.currentRole = follower();
                        state.votedFor = null;
                    }
                    break;
                
                case 'log_request':

                    break;
                case 'log_response':
                    break;
    
                case 'broadcast':
                    if (state.currentLeader === leader()) {
                        state.log.push({msg: message.msg, term: state.currentTerm});
                        state.ackedLength[id] = state.log.length;
                        for (const [followerId, _] of Object.entries(object)) {
                            replicateLog(state, state.currentLeader, followerId);
                        }
                    }else {
                        state.nodes[state.currentLeader].send(message);
                    }
                    break;
                
                case 'election_timeout':
                    state.currentTerm += 1;
                    state.currentRole = candidate();
                    state.votedFor = id;
                    state.votesReceived = new Set([id]);
                    let lastTerm = 0;
                    if (state.log.length >0) {
                        lastTerm = state.log[state.log.length - 1];
                    }
                    msg = VoteRequest(id, state.currentTerm, state.log.length, lastTerm);
                    for (const [_, value] of Object.entries(object)) {
                        value.send(msg);
                    }
                    break;
                case 'notify_node':
                    break;
            }
        },
        initialState
    );
};


