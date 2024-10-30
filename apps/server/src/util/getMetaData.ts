import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';


export async function getMetadata(mintAddress: string) {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const metaplex = new Metaplex(connection);
    const mintPublicKey = new PublicKey(mintAddress);
  
    try {
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
      console.log('Metadata:', nft);
      return nft;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }
  