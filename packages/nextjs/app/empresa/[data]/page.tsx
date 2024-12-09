"use client"

import React, { useState } from 'react'
import { useReadContract, useWriteContract } from 'wagmi';
import { Address } from '~~/components/scaffold-eth';
import ABIContract from "~~/contractsOtros/Prestaciones.json";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { getAddress, parseEther } from 'viem'
// import { useWatchContractEvent } from 'wagmi'
const DatosEmpresa = ({params}:any) => {

  const listaTrabajadores = useReadContract({
    abi:ABIContract.abi,
    address: params.data,
    functionName: 'obtenerTrabajadores',
  })

  const [openFormularioTrabajador, setOpenFormularioTrabajador] = useState(false);
  const [openPagoMensualidad, setOpenPagoMensualidad] = useState(false);

  const handleAbrirFormulario = () => {
    setOpenFormularioTrabajador(true);
    setOpenPagoMensualidad(false);
  };

  const handleAbrirPago = () => {
    setOpenPagoMensualidad(true);
    setOpenFormularioTrabajador(false);
  };

  const FormularioTrabajador = () => {

    const { writeContractAsync } = useWriteContract();

    const writeContractAsyncWithParams = () => 
      writeContractAsync({
        address: getAddress(params.data),
        abi: ABIContract.abi,
        functionName: "registrarTrabajador",
        args: [getAddress(wallet), String(numeroIdentidad), String(nombre), String(fecha)]
      });

      const writeTx = useTransactor();

      const registro = async () => {
        try {
          await writeTx(writeContractAsyncWithParams, { blockConfirmations: 1 });
        } catch (e) {
          console.log("Unexpected error in writeTx", e);
        } finally {
          // setNombre("")
          // setWallet("")
          // setNumeroIdentidad("")
        }
      };
  
    const [numeroIdentidad, setNumeroIdentidad] = useState('');
    const [nombre, setNombre] = useState('');
    const [wallet, setWallet] = useState('');
    const [estado, setEstado] = useState('Activo');
    const [fecha, setFecha] = useState('');
  
    return (
      <div className="max-w-md p-4 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Crear Datos del Trabajador</h2>
        <div>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <label className="text-lg font-medium" htmlFor="numeroIdentidad">
                Número de Identidad:
              </label>
              <input
                type="text"
                id="numeroIdentidad"
                value={numeroIdentidad}
                onChange={(e) => setNumeroIdentidad(e.target.value)}
                className="p-2 text-lg border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <label className="text-lg font-medium" htmlFor="nombre">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="p-2 text-lg border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <label className="text-lg font-medium" htmlFor="wallet">
                Wallet:
              </label>
              <input
                type="text"
                id="wallet"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="p-2 text-lg border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-between">
              <span className="text-lg font-medium">Fecha de ingreso:</span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-lg"
              />
            </div>

            <div className="flex justify-between">
              <label className="text-lg font-medium" htmlFor="estado">
                Estado:
              </label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="p-2 text-lg border border-gray-300 rounded-lg"
              >
                <option value="Activo">Activo</option>
                {/* <option value="Inactivo">Inactivo</option> */}
              </select>
            </div>
            
          </div>
          <button
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            onClick={() => {
              registro();
            }}
          >
            Crear
          </button>
        </div>
      </div>
    );
  };

  const NombreEmpresa = useReadContract({
    abi:ABIContract.abi,
    address: params.data,
    functionName: 'nombreEmpresa',
  })

  const IdEmpresa = useReadContract({
    abi:ABIContract.abi,
    address: params.data,
    functionName: 'idEmpresa',
  })


  if(NombreEmpresa == undefined || IdEmpresa == undefined){
    return (<>Empresa No Encontrada</>)
  }
  else {

  return (<>
    
  <div className="max-w-xl p-4 mx-auto my-4 bg-white rounded-lg shadow-md">
    <h2 className="mb-4 text-2xl font-bold">Datos de la Empresa</h2>
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <span className="text-lg font-medium">Nombre de la Empresa:</span>
        <span className="text-lg">{String(NombreEmpresa.data)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-lg font-medium">ID Empresa:</span>
        <span className="text-lg">{String(IdEmpresa.data)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-lg font-medium">Address Empresa:</span>
        <span className="text-lg"><Address address={params.data} format="short" /></span>
      </div>
    </div>
  </div>

<div className='flex items-center justify-center'>
  <div className="flex flex-col justify-center">
    <div className='flex flex-row self-center'>
      <button
        className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={handleAbrirFormulario}
      >
        Registrar Trabajador
      </button>
      <button
        className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={handleAbrirPago}
      >
        Pagar Mensualidad
      </button>
    </div>
    <div className='flex w-[100%]'>
      {openFormularioTrabajador && <FormularioTrabajador />}
      {openPagoMensualidad && <Pagos contrato={params.data} listaTrabajadores={listaTrabajadores}/>}
      </div>
    </div>
    </div>
<br></br>

    </>)
  }
}



const Pagos = ({ contrato, listaTrabajadores }: any) => {
  console.log(contrato);

  const[monto, setMonto] = useState<any>(null);
  const[datoTrabajador, setDatoTrabajador] = useState<any>(null);
  const[datoMonto, setDatoMonto] = useState<any>(null);

  const { writeContractAsync } = useWriteContract();

  const writeContractAsyncWithParams = () => 
    writeContractAsync({
      address: getAddress(contrato),
      abi: ABIContract.abi,
      functionName: "depositarPrestaciones",
      args: [datoTrabajador, datoMonto],
      value: parseEther(String(datoMonto))
    });

    const writeTx = useTransactor();

    const pagar = async () => {
      try {
        await writeTx(writeContractAsyncWithParams, { blockConfirmations: 1 });
      } catch (e) {
        console.log("Unexpected error in writeTx", e);
      } finally {
        // setNombre("")
        // setWallet("")
        // setNumeroIdentidad("")
      }
    };


  const verDatosTrabajador = (trabajador: any) => {
    const { data } = useReadContract({
      abi: ABIContract.abi,
      address: contrato,
      functionName: 'trabajadores',
      args: [trabajador],
    }) as { data: { [key: string]: any } };

    console.log(data);
    if(data) {
    return (
      <>
        <td className="px-4 py-2 border"><Address address={trabajador}/></td>
        <td className="px-4 py-2 border">{data[0]}</td>
        <td className="px-4 py-2 border">{data[1]}</td>
        <td className="px-4 py-2 border">{Number(data[2])}</td>
        <td className="px-4 py-2 border">{data[3]}</td>
        <td className="px-4 py-2 border">{Number(data[4])}</td>
        <td className="px-4 py-2 border">{data[5] ? "Activo" : "Inactivo"}</td>
        <td className="px-4 py-2 border">
          <input
          type='text'
          onChange={(e) => setMonto(e.target.value)}
          />
        </td>
        <td className="px-4 py-2 border">
          <button className='btn btn-success'
          onClick={()=> {
            setDatoTrabajador(trabajador);
            setDatoMonto(monto);
            pagar()
          }}
          >
            Pagar
          </button>
        </td>
      </>
    );
  }
  };

  console.log(listaTrabajadores);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Wallet</th>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Saldo</th>
            <th className="px-4 py-2 border">% Retirado</th>
            <th className="px-4 py-2 border">Fecha Deposito</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Monto a enviar en ETH</th>
            <th className="px-4 py-2 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          {listaTrabajadores.data?.map((trabajador: any, index: any) => (
            <tr key={index}>
              {verDatosTrabajador(trabajador)}
            </tr>
          ))}
        </tbody>
      </table>
      {listaTrabajadores.data?.length === 0 && <p className="text-center">Sin datos</p>}
    </div>
  );
};


export default DatosEmpresa