import { createSignal, onMount, onCleanup } from 'solid-js';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

type Node = {
  id: number;
  label: string;
  state: boolean;
};

type Edge = {
  from: number;
  to: number;
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Gossip() {
  const [nodes, setNodes] = createSignal<Node[]>([
    { id: 0, state: true, label: 'Node 0' },
  ]);
  const [edges, setEdges] = createSignal<Edge[]>([]);

  let graphContainer: HTMLDivElement | undefined;
  let network: Network | undefined;
  let visNodes: DataSet<any>;
  let visEdges: DataSet<any>;

  onMount(() => {
    visNodes = new DataSet(nodes().map((n) => ({ id: n.id, label: n.label })));
    visEdges = new DataSet<any>([]);

    if (graphContainer) {
      network = new Network(
        graphContainer,
        { nodes: visNodes, edges: visEdges },
        { edges: { color: '#a0c1fd' }, height: '500px' }
      );
    }

    const intervalId = setInterval(() => {
      const currentNodes = nodes();
      const currentEdges = edges();
      const index = randomIntFromInterval(0, currentNodes.length - 1);
      const node = currentNodes[index];
      if (node) {
        currentEdges.forEach((edge) => {
          if (edge.from === node.id) {
            // gossip propagation placeholder
          }
        });
      }
    }, 500);

    onCleanup(() => {
      clearInterval(intervalId);
      network?.destroy();
    });
  });

  const syncGraph = () => {
    if (!visNodes || !visEdges) return;
    const currentNodes = nodes();
    const currentEdges = edges();
    visNodes.clear();
    visNodes.add(currentNodes.map((n) => ({ id: n.id, label: n.label })));
    visEdges.clear();
    visEdges.add(currentEdges.map((e, i) => ({ id: i, from: e.from, to: e.to })));
  };

  const handleNodeSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const id = Number(formData.get('id'));
    const type = formData.get('type') as string;

    setNodes((old) => {
      const has = old.some((n) => n.id === id);
      if (has && type === 'add') return old;
      if (has && type === 'remove' && id !== 0)
        return old.filter((n) => n.id !== id);
      if (type === 'add')
        return [...old, { id, state: true, label: `Node ${id}` }];
      return old;
    });
    syncGraph();
  };

  const handleEdgeSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const to = Number(formData.get('to'));
    const from = Number(formData.get('from'));
    const type = formData.get('type') as string;

    setEdges((old) => {
      const has = old.some((edge) => edge.to === to && edge.from === from);
      if (has && type === 'add') return old;
      if (has && type === 'remove')
        return old.filter((edge) => !(edge.from === from && edge.to === to));
      if (type === 'add') return [...old, { to, from }];
      return old;
    });
    syncGraph();
  };

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
        @media only screen and (max-width: 600px) {
          .forms-container {
            flex-direction: column;
          }
          .form-container {
            width: auto;
          }
        }
      `}</style>
      <div class="forms-container">
        <form class="form-container" onSubmit={handleNodeSubmit}>
          <label>Node Management</label>
          <hr />
          <p>
            Id: <input name="id" type="number" required />
          </p>
          <select name="type" required>
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
        <form class="form-container" onSubmit={handleEdgeSubmit}>
          <label>Edge Management</label>
          <hr />
          <p>
            To: <input name="to" type="number" required />
          </p>
          <p>
            From: <input name="from" type="number" required />
          </p>
          <select name="type">
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
      <div ref={graphContainer} />
    </>
  );
}
