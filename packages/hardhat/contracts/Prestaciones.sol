// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAave {
    function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

contract Prestaciones {
    address public empresa;
    string public nombreEmpresa;
    string public idEmpresa;

    uint8 public constant PORCENTAJE_MAXIMO_RETIRO = 50;
    address public aave;
    address public asset;

    struct Trabajador {
        string cedula;
        string nombre;
        uint256 saldo;
        uint8 porcentajeRetirado;       // TODO: reiniciar cada cierto tiempo
        uint256 ultimaFechaDeposito;
        bool estatus;
    }
    struct SolicitudRetiro {
        string tipoRetiro; // "Total", "Intereses", "Porcentaje"
        uint8 porcentaje; // Solo se usa si tipoRetiro es "Porcentaje"
        string estado; // "En espera", "Aceptada", "Rechazada"
    }

    mapping(address => Trabajador) public trabajadores;
    address[] public listaTrabajadores;
    mapping(address => SolicitudRetiro) public solicitudesRetiro;

//    event TrabajadorRegistrado(address indexed trabajador, string cedula, string nombre);
//    event TrabajadorRetirado(address indexed trabajador, string cedula, string nombre);
//    event PrestacionesActualizadas(address indexed trabajador, uint256 saldo, uint8 porcentajeRetirado);
//    event RetiroRealizado(address indexed trabajador, uint256 monto);
    event DepositoPrestaciones(address indexed trabajador, uint256 monto);
    event RetiroSolicitado(address indexed trabajador, string tipoRetiro);
    event RespuestaSolicitud(address indexed trabajador, string estado);

    modifier soloEmpresa() {
        require(msg.sender == empresa, "Solo la empresa puede realizar esta accion");
        _;
    }
    modifier unaVezAlMes(address _trabajador) {
        require(block.timestamp >= trabajadores[_trabajador].ultimaFechaDeposito + 30 days, "Solo se puede depositar una vez al mes");
        _;
    }
    modifier trabajadorActivo() {
        require(trabajadores[msg.sender].estatus, "El trabajador no esta activo");
        _;
    }

    constructor(string memory _nombreEmpresa, string memory _idEmpresa) {
        empresa = msg.sender;
        nombreEmpresa = _nombreEmpresa;
        idEmpresa = _idEmpresa;
    }

    // Configuracion del Aave
    function configurarStakProtocol (address _aave, address _asset) public {
        aave = _aave;
        asset = _asset;
    }

    // Crea la Contratación/Registro de un Trabajador
    function registrarTrabajador(address _trabajador, string memory _cedula, string memory _nombre) public soloEmpresa {
        Trabajador memory nuevoTrabajador = Trabajador({
            cedula: _cedula,
            nombre: _nombre,
            saldo: 0,
            porcentajeRetirado: 0,
            ultimaFechaDeposito: 0,
            estatus: true
        });

        trabajadores[_trabajador] = nuevoTrabajador;
        listaTrabajadores.push(_trabajador);

//        emit TrabajadorRegistrado(_trabajador, _cedula, _nombre);
    }
    // Finaliza la Contratación de un Trabajador
    function finalizarContratacion(address _trabajador) public soloEmpresa {
        Trabajador storage trabajador = trabajadores[_trabajador];
        trabajador.estatus = false;

//        emit TrabajadorRetirado(_trabajador, _cedula, _nombre);
    }

    // Deposita las Prestaciones al Trabajador, aumenta su Saldo y las mete en Staking
    function depositarPrestaciones(address _trabajador, uint256 _monto) public soloEmpresa unaVezAlMes(_trabajador) {
        require(trabajadores[_trabajador].estatus, "El trabajador no esta activo");
        // Se le incrementa el Saldo y se deposita en Stake
        Trabajador storage trabajador = trabajadores[_trabajador];
        trabajador.saldo += _monto;
        _stake(_trabajador, _monto);

        trabajador.ultimaFechaDeposito = block.timestamp;
        emit DepositoPrestaciones(_trabajador, _monto);
    }

    // Consulta los Intereses del Trabajador
    function consultarIntereses(address _trabajador) public view returns (uint256) {
        uint256 balanceAave = consultarBalanceAave(_trabajador);
        uint256 saldo = trabajadores[_trabajador].saldo;
        return balanceAave > saldo ? balanceAave - saldo : 0;
    }

    // Envía la Solicitud de Retiro
    function solicitarRetiro(string memory _tipoRetiro, uint8 _porcentaje) public trabajadorActivo {
        address _trabajador = msg.sender;
        require(
            keccak256(abi.encodePacked(_tipoRetiro)) == keccak256(abi.encodePacked("Total")) ||
            keccak256(abi.encodePacked(_tipoRetiro)) == keccak256(abi.encodePacked("Intereses")) ||
            keccak256(abi.encodePacked(_tipoRetiro)) == keccak256(abi.encodePacked("Porcentaje")),
            "Tipo de retiro invalido"
        );
        // Se almacena la Solicitud
        if (keccak256(abi.encodePacked(_tipoRetiro)) == keccak256(abi.encodePacked("Total"))) { _porcentaje = 100; }
        SolicitudRetiro memory nuevaSolicitud = SolicitudRetiro({
            tipoRetiro: _tipoRetiro,
            porcentaje: _porcentaje,
            estado: "En espera"
        });
        solicitudesRetiro[_trabajador] = nuevaSolicitud;

        emit RetiroSolicitado(_trabajador, _tipoRetiro);
    }

    // La Empresa Rechaza la Solicitud
    function rechazarSolicitud(address _trabajador) public soloEmpresa {
        SolicitudRetiro storage solicitud = solicitudesRetiro[_trabajador];
        solicitud.estado = "Rechazada";
        emit RespuestaSolicitud(_trabajador, "Rechazada");
    }

    // La Empresa Acepta la Solicitud
    function aceptarSolicitud(address _trabajador) public soloEmpresa {
        SolicitudRetiro storage solicitud = solicitudesRetiro[_trabajador];
        Trabajador storage trabajador = trabajadores[_trabajador];

        if (keccak256(abi.encodePacked(solicitud.tipoRetiro)) == keccak256(abi.encodePacked("Total"))) {
            _unstake(_trabajador, consultarBalanceAave(_trabajador));
            trabajador.saldo = 0;
        } else if (keccak256(abi.encodePacked(solicitud.tipoRetiro)) == keccak256(abi.encodePacked("Intereses"))) {
            uint256 intereses = consultarIntereses(_trabajador);
            _unstake(_trabajador, intereses);
            trabajador.saldo = consultarBalanceAave(_trabajador);
        } else if (keccak256(abi.encodePacked(solicitud.tipoRetiro)) == keccak256(abi.encodePacked("Porcentaje"))) {
            require(solicitud.porcentaje + trabajador.porcentajeRetirado <= PORCENTAJE_MAXIMO_RETIRO, "Ya has retirado el maximo permitido");
            uint256 montoRetiro = (trabajador.saldo * solicitud.porcentaje) / 100;
            _unstake(_trabajador, montoRetiro);
            trabajador.porcentajeRetirado += solicitud.porcentaje;
            trabajador.saldo = consultarBalanceAave(_trabajador);
        }

        solicitud.estado = "Aceptada";
        emit RespuestaSolicitud(_trabajador, "Aceptada");
    }

    // Función Modelo de Arbitraje
    function arbitraje() public soloEmpresa view returns (bool) {
        // La empresa puede depositar fondos en el contrato
        return true;
    }

    // Función privada para hacer staking en Aave
    function _stake(address _trabajador, uint256 _monto) private soloEmpresa {
        IAave(aave).deposit(asset, _monto, _trabajador, 0);
    }
    // Función privada para hacer unstaking en Aave
    function _unstake(address _trabajador, uint256 _monto) private soloEmpresa {
        IAave(aave).withdraw(asset, _monto, _trabajador);
    }
    // Función pública para consultar el balance en Aave
    function consultarBalanceAave(address _trabajador) public view returns (uint256) {
        return IAave(aave).balanceOf(_trabajador);
    }

    // Función para Listar Trabajadores
    function obtenerTrabajadores() public view returns (address[] memory) {
        return listaTrabajadores;
    }
}
