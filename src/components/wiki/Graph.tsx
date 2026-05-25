// Solid wrapper around vis-network. Renders the wiki link graph.
// Loaded with client:only="solid-js" — never executes during SSG.
import { onMount, onCleanup } from 'solid-js';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';
import type { GraphData } from '../../lib/wiki/graph';

interface Props {
  data: GraphData;
}

export default function WikiGraph(props: Props) {
  let container: HTMLDivElement | undefined;
  let network: Network | undefined;

  onMount(() => {
    if (!container) return;
    const nodes = new DataSet(
      props.data.nodes.map((n) => ({ id: n.id, label: n.label }))
    );
    const edges = new DataSet(
      props.data.edges.map((e, i) => ({ id: i, from: e.from, to: e.to, arrows: 'to' }))
    );
    network = new Network(
      container,
      { nodes, edges },
      {
        physics: { stabilization: { iterations: 200 } },
        nodes: {
          shape: 'dot',
          size: 12,
          font: { size: 14 },
        },
        edges: {
          color: { color: '#aaa', highlight: '#1768ac' },
          smooth: { enabled: true, type: 'continuous', roundness: 0.4 },
        },
      }
    );
    network.on('click', (params) => {
      const nodeId = params.nodes?.[0];
      if (!nodeId) return;
      const node = props.data.nodes.find((n) => n.id === nodeId);
      if (node) window.location.href = node.url;
    });
  });

  onCleanup(() => {
    network?.destroy();
  });

  return <div id="wiki-graph" ref={container} />;
}
