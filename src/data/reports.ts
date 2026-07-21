export interface TechnicalReport {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  sourceUrl?: string;
}

export const reports: TechnicalReport[] = [
  {
    slug: 'andromeda-milky-way',
    title: 'A Distributed-Memory Simulation of the Andromeda-Milky Way Collision',
    description:
      'Parallelising the Barnes-Hut n-body algorithm with OpenMPI, including performance results from the Spartan HPC cloud.',
    topics: ['OpenMPI', 'Barnes-Hut', 'High-performance computing'],
    sourceUrl: 'https://github.com/isubasinghe/bhut',
  },
  {
    slug: 'parallel-smith-waterman',
    title: 'Parallel Smith-Waterman with OpenMP',
    description:
      'A wavefront-parallel implementation of optimal local sequence alignment, with NUMA, cache, and scaling analysis.',
    topics: ['OpenMP', 'Bioinformatics', 'Parallel algorithms'],
  },
  {
    slug: 'bellyflop-os',
    title: 'Bellyflop OS Report',
    description:
      'An implementation report covering memory management, multicore messaging, processes, filesystems, naming, and networking.',
    topics: ['Operating systems', 'Barrelfish', 'Multicore systems'],
  },
  {
    slug: 'incremental-data-parallel-graph-clustering',
    title: 'Incremental, Data-Parallel Graph Clustering',
    description:
      'A thesis exploring a parallel and incremental modification of Louvain community detection using Differential Dataflow.',
    topics: ['Differential Dataflow', 'Graph clustering', 'Louvain'],
  },
];
