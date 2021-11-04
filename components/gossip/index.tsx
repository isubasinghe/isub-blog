import React, { useState } from "react";
import Graph from "react-graph-vis";
import { useForm } from "react-hook-form";
import { useInterval } from "react-use";

type Edge = {
  from: number;
  to: number;
};

type Node = {
  id: number;
  label: string;
  state: boolean;
};

type NodeInput = {
  id: number;
  type: "add" | "remove";
};

type EdgeInput = {
  to: number;
  from: number;
  type: "add" | "remove";
};

const options = {
  edges: {
    color: "#a0c1fd",
  },
  height: "500px",
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Gossip = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, state: true, label: "Node 0" },
  ]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { register, handleSubmit } = useForm();

  const {
    register: registerEdge,
    handleSubmit: handleSubmitEdge,
  } = useForm();

  const onSubmit = (data: NodeInput) => {
    setNodes((old) => {
      const has = old.some((elem) => elem.id === data.id);
      if (has && data.type === "add") {
        return old;
      } else if (has && data.type === "remove" && data.id !== 0) {
        return [...old].filter((elem) => elem.id !== data.id);
      } else {
        return data.type === "add"
          ? [...old, { id: data.id, state: true, label: `Node ${data.id}` }]
          : [...old];
      }
    });
  };

  const onEdgeSubmit = (data: EdgeInput) => {
    setEdges((old) => {
      const has = old.some(
        (elem) => elem.to === data.to && elem.from === data.from
      );
      if (has && data.type === "add") {
        return old;
      } else if (has && data.type === "remove") {
        return [...old].filter(
          (elem) => elem.from !== data.from && elem.to !== data.to
        );
      } else {
        return data.type === "add"
          ? [...old, { to: data.to, from: data.from }]
          : old;
      }
    });
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };
  const graph = { nodes, edges };

  useInterval(() => {
    const index = randomIntFromInterval(0, nodes.length);
    const node = nodes[index];
    edges.forEach((edge) => {
      if (edge.from === node.id) {
      }
    });
  }, 500);
  return (
    <>
      <style>{`
        .form-container {
            border: 1px solid black;
            padding: 10px;
            width: 45%;
        }
        .forms-container {
            display: flex;
            justify-content: space-between;
        }
        @media only screen and (max-width: 600px){
            .forms-container {
                flex-direction: column;
            }
            .form-container {
                width: auto;
            }
        }
      `}</style>
      <div className="forms-container">
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <label>Node Management</label>
          <hr />
          <p>
            Id:
            <input
              name="id"
              type="number"
              {...register("id",{ required: true, valueAsNumber: true })}
            />
          </p>
          <select name="type" {...register("type", { required: true })}>
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
        <form
          className="form-container"
          onSubmit={handleSubmitEdge(onEdgeSubmit)}
        >
          <label>Edge Management</label>
          <hr />
          <p>
            To:
            <input
              name="to"
              type="number"
              {...registerEdge("to", { required: true, valueAsNumber: true })}
            />
          </p>
          <p>
            From:
            <input
              name="from"
              type="number"
              {...registerEdge("from", { required: true, valueAsNumber: true })}
            />
          </p>
          <select name="type" {...registerEdge("type")}>
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
      <Graph graph={graph} options={options} events={events} />
    </>
  );
};

export default Gossip;
