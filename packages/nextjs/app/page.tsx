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
      <div className="flex flex-col flex-grow items-center pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block mb-2 text-2xl">Bienvenido </span>
            <span className="block text-4xl font-bold">Fondos De Prestaciones Empresariales Descentralizado</span>
          </h1>
          <div className="flex flex-col justify-center items-center space-x-2 sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-lg text-center">
            Seguridad social descentralizada, asegurando tu futuro con transparencia y total confiabilidad !Tu fondo, tu
            tranquilidad!{" "}
            <code className="inline-block max-w-full text-base italic font-bold break-words break-all bg-base-300"></code>
          </p>
          <p className="text-lg text-center">
            {" "}
            <code className="inline-block max-w-full text-base italic font-bold break-words break-all bg-base-300"></code>{" "}
            <code className="inline-block max-w-full text-base italic font-bold break-words break-all bg-base-300"></code>
          </p>
        </div>

        <div className="flex-grow px-8 py-12 mt-16 w-full bg-base-300">
          <div className="flex flex-col gap-12 justify-center items-center sm:flex-row">
            <div className="flex flex-col items-center px-10 py-10 max-w-xs text-center rounded-3xl bg-base-100">
              <BugAntIcon className="w-8 h-8 fill-secondary" />
              <p>
                {" "}
                <Link href="/trabajadores" passHref className="link">
                  Zona de Empresa
                </Link>{" "}
              </p>
            </div>
            <div className="flex flex-col items-center px-10 py-10 max-w-xs text-center rounded-3xl bg-base-100">
              <MagnifyingGlassIcon className="w-8 h-8 fill-secondary" />
              <p>
                {" "}
                <Link href="/solicitudes" passHref className="link">
                  Zona de Trabajador
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
