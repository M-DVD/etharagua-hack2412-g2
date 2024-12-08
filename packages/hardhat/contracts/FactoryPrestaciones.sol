// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Prestaciones.sol";

contract FactoryPrestaciones {

    address public owner;
    mapping(address => Prestaciones) public listaEmpresas;

    event CreacionEmpresa(address indexed owner, string _nombreEmpresa, string _idEmpresa);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Creación de Empresa
    function crearEmpresa(string memory _nombreEmpresa, string memory _idEmpresa) public onlyOwner {
        Prestaciones nuevaEmpresa = new Prestaciones(msg.sender, _nombreEmpresa, _idEmpresa);
        listaEmpresas[msg.sender] = nuevaEmpresa;

        emit CreacionEmpresa(owner, _nombreEmpresa, _idEmpresa);
    }
}