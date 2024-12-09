"use client";

import type { NextPage } from "next";

import { useState } from 'react';

interface Trabajador {
  idTrabajador: number;
  nombreTrabajador: string;
  walletTrabajador: string;
  estadoTrabajador: boolean;
}

const Formulario = () => {
  const [trabajador, setTrabajador] = useState<Trabajador>({
    idTrabajador: 0,
    nombreTrabajador: '',
    walletTrabajador: '',
    estadoTrabajador: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(trabajador);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setTrabajador((prevTrabajador) => ({ ...prevTrabajador, [name]: value }));
  };

  return (
    <div className="max-w-md p-4 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-bold">Registro de trabajador</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="idTrabajador"
          >
            ID Trabajador
          </label>
          <input
            className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            id="idTrabajador"
            type="number"
            value={trabajador.idTrabajador}
            onChange={handleChange}
            name="idTrabajador"
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="nombreTrabajador"
          >
            Nombre Trabajador
          </label>
          <input
            className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            id="nombreTrabajador"
            type="text"
            value={trabajador.nombreTrabajador}
            onChange={handleChange}
            name="nombreTrabajador"
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="walletTrabajador"
          >
            Wallet Trabajador
          </label>
          <input
            className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            id="walletTrabajador"
            type="text"
            value={trabajador.walletTrabajador}
            onChange={handleChange}
            name="walletTrabajador"
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="estadoTrabajador"
          >
            Estado Trabajador
          </label>
          <select
            className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            id="estadoTrabajador"
            value={trabajador.estadoTrabajador ? "true" : "false"}
            onChange={handleChange}
            name="estadoTrabajador"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

const Empresa: NextPage = () => {
  

  return (
    <div className="container mx-auto my-10">
      <div>Zona de Empresa</div>
      <br/><br/><br/>
      <Formulario/>
      <br/>

      <div></div>
    </div>
  );
};

export default Empresa;
