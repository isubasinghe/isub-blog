export type VoteRequest = {
  voter_id: string;
};

export type Message =
  | { type: "VoteRequest", message: VoteRequest }
  | { type: "VoteResponse" }
  | { type: "LogRequest" };
