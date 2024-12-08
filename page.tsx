"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex flex-col items-center flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block mb-2 text-2xl">Bienvenido</span>
            <span className="block text-4xl font-bold">Fondo De Prestaciones Empresarial Decentralizado</span>
          </h1>
          <div className="flex flex-col items-center justify-center space-x-2 sm:flex-row">
            <p className="my-2 font-medium">Dirección Conectada:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-lg text-center">
            {" "}
            <code className="inline-block max-w-full text-base italic font-bold break-words break-all bg-base-300">
              
            </code>
          </p>
          <p className="text-lg text-center">
            {" "}
            <code className="inline-block max-w-full text-base italic font-bold break-words break-all bg-base-300">
              
            </code>{" "}
            {" "}
            <code className="inline-block max-w-full text-base italic font-bold break-words break-all bg-base-300">
              
            </code>
          </p>
        </div>

        <div className="flex-grow w-full px-8 py-12 mt-16 bg-base-300">
          <div className="flex flex-col items-center justify-center gap-12 sm:flex-row">
            <div className="flex flex-col items-center max-w-xs px-10 py-10 text-center bg-base-100 rounded-3xl">
              <BugAntIcon className="w-8 h-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs px-10 py-10 text-center bg-base-100 rounded-3xl">
              <MagnifyingGlassIcon className="w-8 h-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
