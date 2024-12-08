"use client";

import { useEffect, useState } from "react";
import { PaginationButton, SearchBar, TransactionsTable } from "./_components";
import type { NextPage } from "next";
import { hardhat } from "viem/chains";
import { useFetchBlocks, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { notification } from "~~/utils/scaffold-eth";
import { useAccount } from "wagmi";

/*
const verValores = (address_trabajador: any) => {
  const { data } = useScaffoldReadContract({
    contractName: "Prestaciones",
    functionName: "solicitudesRetiro",
    args: [address_trabajador],
  });
  return data;
}
*/

const BlockExplorer: NextPage = () => {
  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } = useFetchBlocks();
  const { targetNetwork } = useTargetNetwork();
  const [isLocalNetwork, setIsLocalNetwork] = useState(true);
  const [hasError, setHasError] = useState(false);

  // const [listaSolicitudes, setListaSolicitudes] = useState<any>(null);
  const {address} = useAccount();

  const { data } = useScaffoldReadContract({
    contractName: "Prestaciones",
    functionName: "solicitudesRetiro",
    args: [address],
  });

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);


  useEffect(() => {
    if (targetNetwork.id !== hardhat.id) {
      setIsLocalNetwork(false);
    }
  }, [targetNetwork.id]);

  useEffect(() => {
    if (targetNetwork.id === hardhat.id && error) {
      setHasError(true);
    }
  }, [targetNetwork.id, error]);

  useEffect(() => {
    if (!isLocalNetwork) {
      notification.error(
        <>
          <p className="mt-0 mb-1 font-bold">
            <code className="text-base italic font-bold bg-base-300"> targetNetwork </code> is not localhost
          </p>
          <p className="m-0">
            - You are on <code className="text-base italic font-bold bg-base-300">{targetNetwork.name}</code> .This
            block explorer is only for <code className="text-base italic font-bold bg-base-300">localhost</code>.
          </p>
          <p className="mt-1 break-normal">
            - You can use{" "}
            <a className="text-accent" href={targetNetwork.blockExplorers?.default.url}>
              {targetNetwork.blockExplorers?.default.name}
            </a>{" "}
            instead
          </p>
        </>,
      );
    }
  }, [
    isLocalNetwork,
    targetNetwork.blockExplorers?.default.name,
    targetNetwork.blockExplorers?.default.url,
    targetNetwork.name,
  ]);

  useEffect(() => {
    if (hasError) {
      notification.error(
        <>
          <p className="mt-0 mb-1 font-bold">Cannot connect to local provider</p>
          <p className="m-0">
            - Did you forget to run <code className="text-base italic font-bold bg-base-300">yarn chain</code> ?
          </p>
          <p className="mt-1 break-normal">
            - Or you can change <code className="text-base italic font-bold bg-base-300">targetNetwork</code> in{" "}
            <code className="text-base italic font-bold bg-base-300">scaffold.config.ts</code>
          </p>
        </>,
      );
    }
  }, [hasError]);

  return (
    <div className="container mx-auto my-10">
      {data?.[0]}
      <SearchBar />
      <TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts} />
      <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default BlockExplorer;
