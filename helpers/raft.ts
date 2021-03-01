import PubSub from "pubsub-js";

const createRaft = (appTopicId: string, peers: string[]) => {
  PubSub.subscribe(appTopicId, (msg, data) => {});
};

export default createRaft;
