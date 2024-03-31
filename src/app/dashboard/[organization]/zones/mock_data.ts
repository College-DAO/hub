// Defining TypeScript interfaces for the data structure

interface SwitchedStats {
  __typename: string;
  ibcVolume?: number;
  ibcVolumeIn?: number;
  ibcVolumeOut?: number;
  ibcVolumeRating?: number;
  ibcTransfersRating?: number;
  dauRating?: number;
  totalTxsRating?: number;
}

interface BlockchainNode {
  __typename: string;
  isMainnet: boolean;
  switchedStats: SwitchedStats[];
  zone: string;
  logoUrl: string;
  name: string;
  ibcVolume: number;
  ibcVolumeIn: number;
  ibcVolumeOut: number;
  ibcVolumeRating: number;
  ibcTransfersRating: number;
  dauRating: number;
  totalTxsRating: number;
}

interface BlockchainLink {
  __typename: string;
  source: string;
  target: string;
  ibcVolume: number;
}

// Mock data for nodes and links
const nodes: BlockchainNode[] = [
  {
    __typename: "flat_blockchain_switched_stats",
    isMainnet: true,
    switchedStats: [
      {
        __typename: "flat_blockchain_switched_stats",
        ibcVolume: 31609006,
        ibcVolumeIn: 14853871,
        ibcVolumeOut: 16755135,
        ibcVolumeRating: 1,
        ibcTransfersRating: 1,
        dauRating: 3,
        totalTxsRating: 6,
      },
    ],
    zone: "osmosis-1",
    logoUrl: "https://storage.mapofzones.com/frontend/labels/Osmosis40.svg",
    name: "Osmosis",
    ibcVolume: 31609006,
    ibcVolumeIn: 14853871,
    ibcVolumeOut: 16755135,
    ibcVolumeRating: 1,
    ibcTransfersRating: 1,
    dauRating: 3,
    totalTxsRating: 6,
  },
  // Include other node data...
];

const links: BlockchainLink[] = [
  {
    __typename: "flat_blockchain_relations",
    source: "agoric-3",
    target: "akashnet-2",
    ibcVolume: 0,
  },
  {
    __typename: "flat_blockchain_relations",
    source: "agoric-3",
    target: "archway-1",
    ibcVolume: 23679,
  },
  // Include other link data...
];

export { nodes, links };
