// import { ethers } from "ethers";

// import { GraphQLProvider } from "@group-generators/helpers/data-providers/graphql";
// import { JsonRpcProvider } from "@group-generators/helpers/data-providers/json-rpc";
// import { FetchedData } from "topics/group";

// interface inputGetVaultDepositors {
//   vaultId: string;
// }

// export class EnzymeProvider extends GraphQLProvider {
//   provider: JsonRpcProvider | ethers.providers.BaseProvider;

//   constructor() {
//     super({
//       url: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
//     });
//     if (process.env.JSON_RPC_URL) {
//       this.provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
//     } else {
//       this.provider = ethers.getDefaultProvider();
//     }
//   }

//   public async getVaultDepositors({ vaultId }: inputGetVaultDepositors): Promise<FetchedData> {
//     console.log("val", vaultId);
//   }

//   public async getVaultDepositorsCount({ vaultId }: inputGetVaultDepositors): Promise<number> {
//     const vaultDepositorsData = await this.getVaultDepositors({ vaultId });

//     const VaultDepositorsCount = Object.keys(vaultDepositorsData).length;
//     return VaultDepositorsCount;
//   }
// }
