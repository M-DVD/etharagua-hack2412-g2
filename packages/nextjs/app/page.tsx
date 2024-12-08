"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { UserGroupIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [datosEmpresa, setDatosEmpresa] = useState<any>(null);

  const { data } = useScaffoldReadContract({
    contractName: "FactoryPrestaciones",
    functionName: "listaEmpresas",
    args: [connectedAddress],
  });

  useEffect(() => {
    if (data != undefined && data != "0x0000000000000000000000000000000000000000") {
      console.log(data);
      setDatosEmpresa(data);
    }
  }, [data]);

  const [formData, setFormData] = useState({
    nombre_empresa: '',
    id_empresa: '',
  });


  const handleChange = (event:any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    console.log(formData); // Aquí puedes enviar los datos a un servidor o realizar otra acción
  };

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("FactoryPrestaciones");

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

        {datosEmpresa ? (<div className="flex-grow px-8 py-12 mt-16 w-full bg-base-300">
          <div className="flex flex-col gap-12 justify-center items-center sm:flex-row">
            <div className="flex flex-col items-center px-10 py-10 max-w-xs text-center rounded-3xl bg-base-100">
              <UserGroupIcon className="w-8 h-8 fill-secondary" />
              <p>
                {" "}
                <Link href="/trabajadores" passHref className="link">
                  Zona de Empresa
                </Link>{" "}
              </p>
            </div>
            <div className="flex flex-col items-center px-10 py-10 max-w-xs text-center rounded-3xl bg-base-100">
              <NewspaperIcon className="w-8 h-8 fill-secondary" />
              <p>
                {" "}
                <Link href="/solicitudes" passHref className="link">
                  Zona de Trabajador
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>)
        : 
        (<div className="flex-grow px-8 py-12 mt-16 w-full bg-base-300">
          <div className="flex flex-col gap-12 justify-center items-center sm:flex-row">
            <div className="flex flex-col items-center px-10 py-10 max-w-xs text-center rounded-3xl bg-base-100">
            <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="nombre_empresa" className="block mb-2 text-sm font-bold text-gray-700">
          Nombre de la Empresa
        </label>
        <input
          type="text"
          id="nombre_empresa"
          name="nombre_empresa"
          value={formData.nombre_empresa}
          onChange={handleChange}
          className="px-3 py-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="id_empresa" className="block mb-2 text-sm font-bold text-gray-700">
          ID de la Empresa
        </label>
        <input
          type="text"
          id="id_empresa"
          name="id_empresa"
          value={formData.id_empresa}
          onChange={handleChange}
          className="px-3 py-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        onClick={async () => {
          try {
            await writeYourContractAsync({
              functionName: "crearEmpresa",
              args: [formData.nombre_empresa, formData.id_empresa]
            });
          } catch (e) {
            console.error("Error creando empresa:", e);
          }
        }}
      >
        Enviar
      </button>
    </form>
            </div>
          </div>
        </div>)
        }

        
      </div>
    </>
  );
};

export default Home;
