
import type { PublicKey } from "@solana/web3.js";
import type { Token } from "@jup-ag/api";

export interface UseSwapQuoteProps {
  inputAmount: string;
  sellingToken: Token | null;
  buyingToken: Token | null;
  slippage: number;
  platformFeeBps: number;
  platformFeeAccount: PublicKey;
  showToast: (args: { message: string; type: "error" | "success" }) => void;
}
