import React, { Component } from 'react';
import ComboEps from './componentes/comboEps.js';


import ComboPeriodo from './componentes/comboPeriodo.js';
import ComboPeriodoGrupo from './componentes/comboPeriodoGrupo.js';
import ComboMes from './componentes/comboMes.js';
import ComboTipo from './componentes/comboTipo.js';
import ModalReportesRegulatorios from './componentes/ModalReportesRegulatorios.js';
import ModalVariables from './componentes/ModalVariables.js';
import Chart from './componentes/chart.js';
import Chart0 from './componentes/chart0.js';
import './AppPrimary.css';
import axios,{post} from 'axios';
import FileSaver from 'file-saver';
import Upload from "./Upload";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';



class AppPrimary extends Component {

    constructor(props){
        super(props);
        this.state = {
            tokenBody: props.tokenBody,
            dataSource : {},
            codigos : [],
            leyenda : [],
            codigosAceptados : [],
            tipoConsulta : "tabla",
            acumulado : "1",
            empezarConsulta : false,
            hostname : this.props.hostname,
            eps : "17",
            epsNombre : "017-EMAPAT S.R.L",
            local : "1",
            periodo : "",
            mes : "",
            tipo : "",
            tipoReal : "",
            dataSaldo : [],
            dataArchivo: [],
            alerta : "",
            isEpsLoaded : false,
            isLocalLoaded : false,
            isPeriodoLoaded : false,
            isTableLoaded : false,
            isGraficoLoaded :false,
            tableData : [],
            filtrar : false,
            opcionReporte : "",
            chartData : [], //usado para dar datos al FusionChart (cuadro)
            titulo: 'AQUI VA EL TITULO', //usado para el titulo del cuadro
            grafico : 'column2d', //usado para el tipo de grafico del cuadro
            grad : "0", //usado para el gradiente del cuadro
            prefijo : "", //usado para el prefijo del cuadro
            modalbool : false,
            select : "1",
            grupo : "",
            grupoNombre : "",
            boolcodigos : false,
            verArchivos :false,
            verUpdate : false,
            subirArchivos :false
        };
        this.cerrarModal = this.cerrarModal.bind(this);
        this.cerrarUpload = this.cerrarUpload.bind(this);
        this.handleChangeEps = this.handleChangeEps.bind(this);
        this.handleChangeGrupo = this.handleChangeGrupo.bind(this);
        this.vaciarTodo = this.vaciarTodo.bind(this);
        this.vaciarPeriodo = this.vaciarPeriodo.bind(this);
        this.handleChangeEpsNombre = this.handleChangeEpsNombre.bind(this);
        this.handleChangeGrupoNombre = this.handleChangeGrupoNombre.bind(this);
        this.handleChangeLocal = this.handleChangeLocal.bind(this);
        this.handleChangePeriodo = this.handleChangePeriodo.bind(this);
        this.handleChangeMes = this.handleChangeMes.bind(this);
        this.handleChangeTipo = this.handleChangeTipo.bind(this);
        this.vaciarTipoReal = this.vaciarTipoReal.bind(this);
        this.vaciarModal = this.vaciarModal.bind(this);
        this.vaciarTipo = this.vaciarTipo.bind(this);
        this.handleChangeDataSaldo = this.handleChangeDataSaldo.bind(this);
        this.botonEnviar = this.botonEnviar.bind(this);
        this.formatNumber = this.formatNumber.bind(this);
        this.roundNumber = this.roundNumber.bind(this);
        this.limpiarAlerta = this.limpiarAlerta.bind(this);
        this.handleChangeFiltrar = this.handleChangeFiltrar.bind(this);
        this.handleChangeCodigosAceptados = this.handleChangeCodigosAceptados.bind(this);
        this.handleChangeLeyenda = this.handleChangeLeyenda.bind(this);
        this.handleChangeTipoConsulta = this.handleChangeTipoConsulta.bind(this);
        this.handleChangeAcumulado = this.handleChangeAcumulado.bind(this);
        this.handleChangeSelect1 = this.handleChangeSelect1.bind(this);
        this.handleChangeSelect2 = this.handleChangeSelect2.bind(this);
        this.handleChangeEmpezarConsulta = this.handleChangeEmpezarConsulta.bind(this);
        this.cambiarTipoGrafico = this.cambiarTipoGrafico.bind(this);
        this.handleChangeTipoGrafico = this.handleChangeTipoGrafico.bind(this);
        this.fetchConsulta = this.fetchConsulta.bind(this);
        this.fetchAcumNoAcum = this.fetchAcumNoAcum.bind(this);
        this.fetchSeguimiento = this.fetchSeguimiento.bind(this);
        this.cambiarAlerta = this.cambiarAlerta.bind(this);
        this.cambioGrad = this.cambioGrad.bind(this);
        this.armarDataChart = this.armarDataChart.bind(this);
        this.armarDataChart2 = this.armarDataChart2.bind(this);
        this.generarMes = this.generarMes.bind(this);
        this.fetchArchivos = this.fetchArchivos.bind(this);
        this.deleteArchivos = this.deleteArchivos.bind(this);
 
        this.onChange = this.onChange.bind(this);
        this.opcionArchivos = this.opcionArchivos.bind(this);
        this.opcionUpload = this.opcionUpload.bind(this);
        this.onTestSaveFile = this.onTestSaveFile.bind(this);
        

    }

    onTestSaveFile(e) {
        FileSaver.saveAs("http://190.116.37.106:7000/bajar/"+this.state.eps+"/"+e, e);
    }

    cerrarModal() {
        
    this.setState({ verUpdate  : false});
    this.setState({ verArchivos : false});
    this.setState({ subirArchivos : false});
    }
    cerrarUpload() {
        this.setState({ verUpdate  : false});
        this.setState({ verArchivos : true});
        this.setState({ subirArchivos : false});
        this.fetchArchivos();
    }

    componentDidMount() {
        if (this.props.tokenBody !== undefined) {
            console.log('TOKEN: ');
            console.log(this.props.tokenBody);
        }
    }

    armarDataChart(array){
        var numeromes = 0;
        if(this.state.mes === "01"){ numeromes = 1 }
        else{ if(this.state.mes === "02"){ numeromes = 2 }
            else{if(this.state.mes === "03"){ numeromes = 3 }
                else{if(this.state.mes === "04"){ numeromes = 4 }
                    else{if(this.state.mes === "05"){ numeromes = 5 }
                        else{if(this.state.mes === "06"){ numeromes = 6 }
                            else{if(this.state.mes === "07"){ numeromes = 7 }
                                else{if(this.state.mes === "08"){ numeromes = 8 }
                                    else{if(this.state.mes === "09"){ numeromes = 9 }
                                        else{if(this.state.mes === "10"){ numeromes = 10 }
                                            else{if(this.state.mes === "11"){ numeromes = 11 }
                                                else{if(this.state.mes === "12"){ numeromes = 12 }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var categories = [];
        for(var i=0; i<this.state.codigosAceptados.length;i++){
            if(this.state.tipoReal ==="1"){
                categories.push({"label": array[i*numeromes].codvar} );
            }else{
                categories.push({"label": array[i*numeromes].codind} );
            }
        }
        var dataset = [];
        for(var n=0; n<numeromes;n++){
            var data = [];
            for(var m=0;m<this.state.codigosAceptados.length;m++){
                data.push(
                    { "value" : array[(m*numeromes)+n].valor}
                );
            }
            dataset.push(
                {
                    "seriesname" : this.generarMes(n+1),
                    "data" : data
                }
            );
        }
        var category = { "category" : categories };
        var tit = "";
        if(this.state.tipoReal==="1"){
            if(this.state.select==="1"){
                tit="VARIABLES DE "+this.state.epsNombre;
            }else{
                tit = "VARIABLES DE EMPRESAS "+this.state.grupoNombre.toUpperCase();
            }
        }else{
            if(this.state.tipoReal==="2"){
                if(this.state.select==="1"){
                    tit="INDICADORES DE "+this.state.epsNombre;
                }else{
                    tit = "INDICADORES DE EMPRESAS "+this.state.grupoNombre.toUpperCase();
                }
            }
        }
        var dataSource = {
            "chart" : {
                "bgColor" : "#F4F4F4",
                "bgAlpha" : "100",
                "caption": "SEGUIMIENTO DE "+tit,
                "numvisibleplot": "8",
                "palettecolors":"5d62b5,29c3be,f2726f",
                "showPlotBorder": "0",
                "exportEnabled": "1",
                "usePlotGradientColor": this.state.grad,
                "formatNumberScale" : "0",
                "labeldisplay": "auto",
                "baseFont": "Calibri",
                "baseFontSize": "16"
            },
            "categories" : [category],
            "dataset" : dataset
        }

        this.setState({
            dataSource : dataSource
        });
        console.log(JSON.stringify(dataSource));
    }

    armarDataChart2(array){
        var numeromes = 0;
        if(this.state.mes === "01"){ numeromes = 1 }
        else{ if(this.state.mes === "02"){ numeromes = 2 }
            else{if(this.state.mes === "03"){ numeromes = 3 }
                else{if(this.state.mes === "04"){ numeromes = 4 }
                    else{if(this.state.mes === "05"){ numeromes = 5 }
                        else{if(this.state.mes === "06"){ numeromes = 6 }
                            else{if(this.state.mes === "07"){ numeromes = 7 }
                                else{if(this.state.mes === "08"){ numeromes = 8 }
                                    else{if(this.state.mes === "09"){ numeromes = 9 }
                                        else{if(this.state.mes === "10"){ numeromes = 10 }
                                            else{if(this.state.mes === "11"){ numeromes = 11 }
                                                else{if(this.state.mes === "12"){ numeromes = 12 }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var categories = [];
        for(let i=0; i<numeromes;i++){
            categories.push({"label": this.generarMes(i+1)} );
        }
        var dataset = [];
        for(let i=0; i<this.state.codigosAceptados.length;i++){
            var data = [];
            for(var j=0;j<numeromes;j++){
                data.push(
                    { "value" : array[(i*numeromes)+j].valor}
                );
            }
            if(this.state.tipoReal==="1"){
                dataset.push(
                    {
                        "seriesname" : array[i*numeromes].codvar,
                        "data" : data
                    }
                );
            }else{
                dataset.push(
                    {
                        "seriesname" : array[i*numeromes].codind,
                        "data" : data
                    }
                );
            }
        }
        var category = { "category" : categories };
        var tit = "";
        if(this.state.tipoReal==="1"){
            if(this.state.select==="1"){
                tit="VARIABLES DE "+this.state.epsNombre;
            }else{
                tit = "VARIABLES DE EMPRESAS "+this.state.grupoNombre.toUpperCase();
            }
        }else{
            if(this.state.tipoReal==="2"){
                if(this.state.select==="1"){
                    tit="INDICADORES DE "+this.state.epsNombre;
                }else{
                    tit = "INDICADORES DE EMPRESAS "+this.state.grupoNombre.toUpperCase();
                }
            }
        }
        var dataSource = {
            "chart" : {
                "bgColor" : "#F4F4F4",
                "bgAlpha" : "100",
                "caption": "SEGUIMIENTO DE "+tit,
                "numvisibleplot": "8",
                "palettecolors":"5d62b5,29c3be,f2726f",
                "showPlotBorder": "0",
                "exportEnabled": "1",
                "usePlotGradientColor": this.state.grad,
                "formatNumberScale" : "0",
                "labeldisplay": "auto",
                "baseFont": "Calibri",
                "baseFontSize": "16"
            },
            "categories" : [category],
            "dataset" : dataset
        }

        this.setState({
            dataSource : dataSource
        });
        console.log(JSON.stringify(dataSource));
    }

    generarMes(numeromes){
        switch(numeromes){
            case 1 : return "Enero";
            case 2 : return "Febrero";
            case 3 : return "Marzo";
            case 4 : return "Abril";
            case 5 : return "Mayo";
            case 6 : return "Junio";
            case 7 : return "Julio";
            case 8 : return "Agosto";
            case 9 : return "Septiembre";
            case 10 : return "Octubre";
            case 11 : return "Noviembre";
            case 12 : return "Diciembre";
            default : return null;
        }

    }

    limpiarAlerta(){
        this.setState({ alerta : "" })
    }

    cambiarAlerta(alerta){
        this.setState({ alerta : alerta })
    }

    cambioGrad(event){
        this.setState({ grad : event.target.value })
    }

    handleChangeTipoGrafico(event){
        this.setState({ grafico : event.target.value })
    }

    cambiarTipoGrafico(e){
        this.setState({ grafico : e })
    }

    fetchCodigos(eps,local,periodo,mes){
        var param1 = "";
        var param2 = "";
        if(this.state.tipo==="1"){
            param1 = "variables";
            param2 = "Variables"
        }else{
            param1 = "indicadores";
            param2 = "Indicadores";
        }
        fetch(this.state.hostname+"/APISunass/MainController/"+param1+"/getCodigos"+param2+"?id_eps="+eps+"&periodo="+periodo+mes)//AÑADIR LOCALIDAD CAUNDO NOS AVISEN
        .then((response) =>{
            return response.json()
        })
        .then((result) => {
            if(result.length === 0){
                this.setState({
                    alerta : "No hay CODIGOS para la consulta.",
                    boolcodigos : false
                });
            }else{
                this.setState({
                    boolcodigos : true
                });
            }
            this.setState({
                codigos : result
            });
        });
    }

    

    prepararDataGrafico(result){
        var obj = [];
        var titaux = "";
        if(this.state.tipo === "1"){
            if(this.state.select==="1"){
                titaux = "CONSULTA DE VARIABLES DE "+this.state.epsNombre;
            }else{
                titaux = "CONSULTA DE VARIABLES DE EMPRESAS "+this.state.grupoNombre.toUpperCase();
            }
            for(var i in result){
                obj.push({
                    "label": result[i].codvar,
                    "value": result[i].valor
                })
            }
        }
        if(this.state.tipo === "2"){
            if(this.state.select==="1"){
                titaux = "CONSULTA DE INDICADORES DE "+this.state.epsNombre;
            }else{
                titaux = "CONSULTA DE INDICADORES DE EMPRESAS "+this.state.grupoNombre.toUpperCase();
            }
            for(let i in result){
                obj.push({
                    "label": result[i].codind,
                    "value": result[i].valor
                })
            }
        }

        console.log(result);
        this.setState({
            chartData : obj,
            titulo : titaux
        })
        if(this.state.tipo === "1"){
            this.setState({
                prefijo : result[0].simvar
            })
        }
        if(this.state.tipo === "2"){
            this.setState({
                prefijo : result[0].simind
            })
        }
    }

    fetchConsulta(){
        if(this.state.select==="1"){
            if(this.state.acumulado === "3"){
                this.fetchSeguimiento();
            }else{
                this.fetchAcumNoAcum();
            }
        }else{
            if(this.state.tipoReal==="1"){
                this.fetchConsultaPorGrupo("variables/obtenerVariables");
            }else{
                if(this.state.tipoReal==="2"){
                    this.fetchConsultaPorGrupo("indicadores/obtenerIndicadores");
                }else{
                    console.log("AUN NO SE IMPLEMENTA . . .");
                }
            }
        }
    }

    fetchAcumNoAcum(){
        console.log("ENTRO: ACUM O NO ACUM");
        this.setState({
            empezarConsulta : false,
            isTableLoaded : false,
            isGraficoLoaded : false,
            chartData : [],
            dataSource : {}
        })
        var aux1 = "";
        var aux2 = "";
        if (this.state.tipo === "1") {
            aux1 = "variables";
            aux2 = "Variables";
        }
        if (this.state.tipo === "2") {
            aux1 = "indicadores";
            aux2 = "Indicadores";
        }
        var ac = true;
        if(this.state.acumulado==="1"){
            ac = true;
        }else{
            ac = false;
        }
        const data = {
            eps : parseInt(this.state.eps,10),
			localidad : parseInt(this.state.local,10),
			periodo : this.state.periodo+this.state.mes,
			acumulado : ac,
			codigos : this.state.codigosAceptados
        }
        console.log(JSON.stringify(data));
        fetch(this.state.hostname+"/APISunass/MainController/"+aux1+"/get"+aux2,{
            method : 'POST',
            headers : {
                'Accept' : '*/*',
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            body : JSON.stringify(data)
        })
        .then((response) =>{
            return response.json();
        })
        .then((result) => {
            this.setState({
                dataSaldo : result
            });
            if(result.length === 0){
                this.setState({ alerta : "No hay datos de la consulta." });
            }else{
                if(this.state.tipoConsulta === "tabla"){
                    this.setState({
                        isTableLoaded : true
                    })
                }
                if(this.state.tipoConsulta === "grafico"){
                    this.prepararDataGrafico(result);
                    this.setState({
                        isGraficoLoaded : true
                    })
                }
            }
        });
    }

    fetchSeguimiento(){
        console.log("ENTRO: SEGUIMIENTO");
        this.setState({
            empezarConsulta : false,
            isTableLoaded : false,
            isGraficoLoaded : false,
            chartData : [],
            dataSource : {}
        })
        var aux1 = "";
        if (this.state.tipo === "1") {
            aux1 = "variables";
        }
        if (this.state.tipo === "2") {
            aux1 = "indicadores";
        }
        const data = {
            eps : parseInt(this.state.eps,10),
			localidad : parseInt(this.state.local,10),
			periodo : this.state.periodo+this.state.mes,
			codigos : this.state.codigosAceptados
        }
        fetch(this.state.hostname+"/APISunass/MainController/"+aux1+"/seguimiento",{
            method : 'POST',
            headers : {
                'Accept' : '*/*',
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            body : JSON.stringify(data)
        })
        .then((response) =>{
            return response.json();
        })
        .then((result) => {
            if(result.length === 0){
                this.setState({ alerta : "No hay datos de la consulta." });
            }
            this.setState({
                dataSaldo : result
            });
            if(this.state.tipoConsulta === "tabla"){
                this.setState({
                    isTableLoaded : true
                })
            }
            console.log(result);
            if(this.state.tipoConsulta === "grafico"){
                if(this.state.grafico !== "msarea" && this.state.grafico !== "msline" && this.state.grafico !== "msspline"){
                    this.armarDataChart(result);
                }else{
                    this.armarDataChart2(result);
                }
                this.setState({
                    isGraficoLoaded : true
                })
            }
        });
    }

    fetchConsultaPorGrupo(cadena){
        console.log("ENTRO: CONSULTA GRUPO");
        this.setState({
            empezarConsulta : false,
            isTableLoaded : false,
            isGraficoLoaded : false,
            chartData : [],
            dataSource : {}
        });
        var data ={
            grupo : this.state.grupo,
            periodo : this.state.periodo+this.state.mes,
            tipo : this.state.acumulado,
            codigos : this.state.codigosAceptados
        }
        console.log(data);
        fetch(this.state.hostname+"/APISunass/MainController/"+cadena,{
            method : 'POST',
            headers : {
                'Accept' : '*/*',
                'Content-Type' : 'application/json; charset=UTF-8',
                'token' : this.props.token
            },
            body : JSON.stringify(data)
        })
        .then((response) =>{
            console.log(response); //SE MUESTRA LA RESPUESTA DE LA PETICION
            if(response.status === 404){ //      || response.status === 400){
                return [];
            }else{
                return response.json()
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                dataSaldo : result
            });
            if(result.length === 0){
                this.setState({ alerta : "No hay datos de la consulta." });
            }else{
                if(this.state.tipoConsulta === "tabla"){
                    this.setState({
                        isTableLoaded : true
                    })
                }
                if(this.state.tipoConsulta === "grafico"){
                    if(this.state.acumulado ==="3"){
                        if(this.state.grafico !== "msarea" && this.state.grafico !== "msline" && this.state.grafico !== "msspline"){
                            this.armarDataChart(result);
                        }else{
                            this.armarDataChart2(result);
                        }
                        this.setState({
                            isGraficoLoaded : true
                        })
                    }else{
                        this.prepararDataGrafico(result);
                        this.setState({
                            isGraficoLoaded : true
                        })
                    }
                }
            }
        })
    }

    botonEnviar(eps,local,periodo,mes){
        this.setState({
            tipoReal : "",
            dataSaldo : []
        });
        if(this.state.select==="1"){
            if(this.state.eps !== "" && this.state.local !== "" && this.state.periodo !== "" && this.state.mes !== "" && this.state.tipo !== ""){
                if(this.state.tipo === "1"){
                    this.fetchCodigos(this.state.eps,this.state.local,this.state.periodo,this.state.mes);
                    this.setState({
                        tipoReal : "1",
                        modalbool : true
                    });
                }else{
                    if(this.state.tipo === "2"){
                        this.fetchCodigos(this.state.eps,this.state.local,this.state.periodo,this.state.mes);
                        this.setState({
                            tipoReal : "2",
                            modalbool : true
                        });
                    }else{
                        this.setState({
                            tipoReal : "3",
                            modalbool : true
                        });
                    }
                }
            }else{
                this.setState({
                    alerta : "Faltan campos por seleccionar.",
                    isTableLoaded : false
                });
            }
        }else{
            if(this.state.grupo !== ""  && this.state.periodo !== "" && this.state.mes !== "" && this.state.tipo !== ""){
                if(this.state.tipo === "1"){
                    this.fetchCodigosGrupo(this.state.grupo,this.state.periodo,this.state.mes);
                    this.setState({
                        tipoReal : "1",
                        modalbool : true
                    });
                }else{
                    if(this.state.tipo === "2"){
                        this.fetchCodigosGrupo(this.state.grupo,this.state.periodo,this.state.mes);
                        this.setState({
                            tipoReal : "2",
                            modalbool : true
                        });
                    }else{
                        this.setState({
                            tipoReal : "3",
                            modalbool : true
                        });
                    }
                }
            }else{
                this.setState({
                    alerta : "Faltan campos por seleccionar.",
                    isTableLoaded : false
                });
            }
        }
    }

    handleChangeEps(event){
        this.setState({
            isLocalLoaded : false,
            isPeriodoLoaded : false,
            eps : event.target.value,
            local : "",
            periodo : "",
            alerta : ""
        });
    }

    handleChangeGrupo(event){
        this.setState({
            isLocalLoaded : false,
            isPeriodoLoaded : false,
            grupo : event.target.value,
            local : "",
            periodo : "",
            alerta : ""
        });
    }

    handleChangeEmpezarConsulta(valor){
        this.setState({ empezarConsulta : valor })
    }

    handleChangeLocal(event){
        this.setState({ local : event.target.value, periodo : "", alerta : "" });
    }

    handleChangeCodigosAceptados(c){
        this.setState({ codigosAceptados : c });
    }

    handleChangeLeyenda(c){
        this.setState({ leyenda : c });
    }

    handleChangeTipoConsulta(tipo){
        this.setState({ tipoConsulta : tipo });
    }

    handleChangeAcumulado(a){
        this.setState({ acumulado : a });
    }

    handleChangeFiltrar(event){
        this.setState({ filtrar : !this.state.filtrar}  );
    }

    handleChangePeriodo(event){
        this.setState({ periodo : event.target.value, alerta : "" });
    }

    handleChangeMes(event){
        this.setState({ mes : event.target.value, alerta : "" });
    }

    handleChangeTipo(event){
        this.setState({ tipo : event.target.value, alerta : "" });
    }

    handleChangeDataSaldo(data){
        this.setState({ dataSaldo : data });
    }

    handleChangeEpsNombre(nombre){
        this.setState({ epsNombre : nombre })
    }

    handleChangeGrupoNombre(nombre){
        this.setState({ grupoNombre : nombre })
    }

    handleChangeSelect1(){
        this.vaciarTodo();
        this.setState({ select : "1" });
    }

    handleChangeSelect2(){
        this.vaciarTodo();
        this.setState({ select : "2" });
    }
    opcionArchivos(res){
        
        this.setState({ verArchivos : true});
        this.setState({ dataArchivo : res});
        console.log('ESTOS SON LLS DATOS:',res);
        /* console.log(this.state.verArchivos); */
    }
    opcionUpload(){  
        
        this.setState({ verUpdate  : true});
        this.setState({ verArchivos : false});
        this.setState({ subirArchivos : true});
        
        /* this.setState({ dataArchivo : res}); */
        /* console.log(this.state.verArchivos); */
    }

    vaciarTodo(){
        this.setState({ eps : "", epsNombre : "", local : "", periodo : "", mes : "", grupo : "", tipo : "" });
    }

    vaciarPeriodo(){
        this.setState({ periodo : "", mes : "" });
    }

    vaciarTipoReal(){
        this.setState({ tipoReal : "" })
    }

    vaciarModal(){
        this.setState({ modalbool : false })
    }

    vaciarTipo(){
        this.setState({ tipo : "" })
    }

    parsearPeriodo(cadper){
        var cadenaux = "";
        if(cadper.length === 6){
            cadenaux = cadenaux+cadper[4]+cadper[5]+"/";
            cadenaux = cadenaux+cadper[0]+cadper[1]+cadper[2]+cadper[3];
        }else{
            cadenaux = cadenaux+cadper[6]+cadper[7]+"/";
            cadenaux = cadenaux+cadper[4]+cadper[5]+"/";
            cadenaux = cadenaux+cadper[0]+cadper[1]+cadper[2]+cadper[3];
        }
        return cadenaux;
    }

    roundNumber(num, scale = 2) {
        if(!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale)  + "e-" + scale);
        } else {
            var arr = ("" + num).split("e");
            var sig = ""
            if(+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    }

    formatNumber(num,simbol=""){
        var separador= ",";
        var sepDecimal= '.';
        num = this.roundNumber(num,2);
        num +='';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? (
            splitStr[1].length === 1? (sepDecimal + splitStr[1] + "0") : (sepDecimal + splitStr[1])
        ) : ('');
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + separador + '$2');
        }
        if(splitRight===""){
            splitRight = ".00";
        }
        return simbol + splitLeft + splitRight;
    }

    fetchArchivos() {
        console.log('funcion',this.state.eps);
        this.setState({ verArchivos : true});
        if(this.state.epsNombre!=""){
        fetch(`http://190.116.37.106:7000/ver/${this.state.eps}`,{
                method : 'GET',
                headers : {
                    'Accept' : '*/*',
                    'Content-Type' : 'application/json; charset=UTF-8'
                },
            })
            .then((response) =>{
                
                return response.json()
            })
            .then((result) => {
                this.opcionArchivos(result);
            });
    }
         
    }

    deleteArchivos(e) {
        console.log('borrar',e);
        fetch(`http://190.116.37.106:7000/${this.state.eps}/${e}`,{
                method : 'DELETE',
                headers : {
                    'Accept' : '*/*',
                    'Content-Type' : 'application/json; charset=UTF-8'
                },
            })
            .then((result) => {
                this.fetchArchivos();
            });  
    }


    onChange(e){

        let files=e.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload=(e)=>{
        const url= "http://190.116.37.106:7000/archivos";/*xxxxxx*/ 
        const formData= {file : e.target.result}
        return post(url,formData)
        .then(response => console.log("result",response))

        }

    }


    render() {
        
        const listadoArchivos = this.state.dataArchivo;
        
        const listado = this.state.dataSaldo;
        if(this.state.empezarConsulta===true && this.state.codigosAceptados.length !== 0){
            this.fetchConsulta();
        }

        return (
            <div className="App">

                <br/>   
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8 formulario">
                            <br/>
                            <div className="row celda-otass centrado">
                                <div className="col-3"></div>
                                <div className="col-6">
                                    <a href="#">
                                        <img className="logo-sunass" alt="Enlace página SUNASS" target="_blank" src={require("./LOGO_VECTOR.png")}/>
                                    </a>
                                </div>
                                <div className="col-3">
                                    <div>
    	                               <a className="fa fa-facebook" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/">{null}</a>
                                       <a className="fa fa-twitter" target="_blank" rel="noopener noreferrer" href="https://twitter.com/">{null}</a>
                                       <a className="fa fa-youtube" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/">{null}</a>
                                       <a className="fa fa-instagram" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/">{null}</a>
                                    </div>
                                </div>
                            </div>
                            
                            {(this.state.verArchivos==false && this.state.subirArchivos==false)?(
                               
                            <div>
                                 <br/>
                            

                            <div className="row centrado">
                                <div className="col-4">
                                    <div className="row">
                                        <div className="col-12">
                                            <ComboTipo eps={this.state.eps} grupo={this.state.grupo} local={this.state.local} tipo={this.state.tipo}
                                                onChange={this.handleChangeTipo} handleChangeDataSaldo={this.handleChangeDataSaldo} tokenBody={this.props.tokenBody} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    {this.state.select==="1"?
                                        (
                                            <ComboPeriodo eps={this.state.eps} local={this.state.local} periodo={this.state.periodo} tipo={this.state.tipo}
                                            onChange={this.handleChangePeriodo} vaciarPeriodo={this.vaciarPeriodo} hostname={this.state.hostname}/>
                                        ):(
                                            <ComboPeriodoGrupo grupo={this.state.grupo} periodo={this.state.periodo} tipo={this.state.tipo}
                                            onChange={this.handleChangePeriodo} vaciarPeriodo={this.vaciarPeriodo} hostname={this.state.hostname} token={this.props.token}/>
                                        )
                                    }
                                </div>
                                <div className="col-4">
                                    <ComboMes mes={this.state.mes}
                                    onChange={this.handleChangeMes}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 centrado">
                                    <button className="btn-enviar" onClick={this.botonEnviar}>Enviar</button>
                                </div>
                                <div className="col-6 centrado">
                                    <button className="btn-enviar" onClick={this.fetchArchivos}>Archivos</button>
                                </div>
                            </div>
                            </div>
                            ):(null)}
                            <br/>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
                <br/>

                {this.state.alerta!==""?
                    (<div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <div className="alert alert-primary alert-dismissible fade show" role="alert">
                                {this.state.alerta}
                                <button onClick={this.limpiarAlerta} type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-2"></div>
                    </div>):(null)
                }

                {(this.state.isGraficoLoaded && this.state.tipoConsulta ==="grafico" && this.state.dataSaldo.length !== 0) ? //CAMBIAR A LOS DATOS DE LA TABLA
                    (<div className="row">
                        <div className="col-1"></div>
                        <div className="col-8">
                            {this.state.acumulado !=="3"  && this.state.chartData.length !== 0?
                                (
                                    <Chart
                                        chartData={this.state.chartData}
                                        grafico={this.state.grafico}
                                        legendPosition="bottom"
                                        titulo={this.state.titulo}
                                        grad={this.state.grad}
                                        prefijo={this.state.prefijo}
                                    />
                                ):(
                                    <Chart0
                                        dataSource={this.state.dataSource}
                                        type={this.state.grafico}
                                    />
                                )
                            }
                        </div>
                        <div className="col-2">
                            {this.state.leyenda.length !== 0 ?
                                (<table className="table table-hover table-light" id="tabla-principal">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Codigo</th>
                                            <th>Descripcion</th>
                                        </tr>
                                    </thead>
                                    <tbody>{this.state.leyenda.map((dynamicData, i) =>
                                        <tr key={i}>
                                            <td>{dynamicData.codigo}</td>
                                            <td>{dynamicData.descripcion}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>):(null)
                            }
                        </div>
                        <div className="col-1"></div>
                    </div>):(null)
                }

                {(this.state.isTableLoaded && this.state.tipoConsulta ==="tabla" && this.state.dataSaldo.length !== 0 && this.state.verArchivos==false && this.state.subirArchivos==false)?
                    (
                        <div className="contenido-tabla">
                            <div className="row">
                                <div className="col-2"></div>
                                <div className="col-8">
                                    {this.state.select==="1"?
                                        (
                                            <table className="table table-hover table-light" id="tabla-principal">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>Fecha de registro</th>
                                                        <th>Codigo</th>
                                                        <th>Detalle</th>
                                                        <th style={{"textAlign":"right"}}>Valor</th>
                                                        <th style={{"textAlign":"center"}}>Unidad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{listado.map((dynamicData, i) =>
                                                    <tr key={i}>
                                                        <td>{this.parsearPeriodo(dynamicData.fecultact)}</td>
                                                        {this.state.tipoReal==="1"?
                                                            (<td>{dynamicData.codvar}</td>):(<td>{dynamicData.codind}</td>)
                                                        }
                                                        {this.state.tipoReal==="1"?
                                                            (<td>{dynamicData.desvar}</td>):(<td>{dynamicData.desind}</td>)
                                                        }
                                                        <td align="right">{this.formatNumber(dynamicData.valor)}</td>
                                                        {this.state.tipoReal==="1"?
                                                            (<td style={{"textAlign":"center"}}>{dynamicData.simvar}</td>):(<td style={{"textAlign":"center"}}>{dynamicData.simind}</td>)
                                                        }
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        ):(
                                            <table className="table table-hover table-light" id="tabla-principal">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        {this.state.acumulado==="3"?
                                                            (<th>Fecha de registro</th>):(null)
                                                        }
                                                        <th>Codigo</th>
                                                        <th>Detalle</th>
                                                        <th style={{"textAlign":"right"}}>Valor</th>
                                                        <th style={{"textAlign":"center"}}>Unidad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{listado.map((dynamicData, i) =>
                                                    <tr key={i}>
                                                        {this.state.acumulado==="3"?
                                                            (<td>{this.parsearPeriodo(dynamicData.periodo)}</td>):(null)
                                                        }
                                                        {this.state.tipoReal==="1"?
                                                            (<td>{dynamicData.codvar}</td>):(<td>{dynamicData.codind}</td>)
                                                        }
                                                        {this.state.tipoReal==="1"?
                                                            (<td>{dynamicData.desvar}</td>):(<td>{dynamicData.desind}</td>)
                                                        }
                                                        <td align="right">{this.formatNumber(dynamicData.valor)}</td>
                                                        {this.state.tipoReal==="1"?
                                                            (<td style={{"textAlign":"center"}}>{dynamicData.simvar}</td>):(<td style={{"textAlign":"center"}}>{dynamicData.simind}</td>)
                                                        }
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        )
                                    }
                                </div>
                                <div className="col-2"></div>
                            </div>
                        </div>
                    ):(null)
                }
                {this.state.verArchivos===true?
                                (
                                    
                <div className="modal-dialog tam50">
                    <div className="modal-content" style={{"minHeight":"30vh"}}>
                        <div className="modal-header mb-3 bg-dark text-white">

                            <h5 className="modal-title col-8 mb-1" ><b>Archivos del Servidor</b></h5>

                            <button className="close col-1 text-white" onClick={this.cerrarModal}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                           
                        </div>
                        <div className="row container">
                        {console.log('mirar',this.state.epsNombre)}
                            <div className="col-8">
                            <ComboEps eps={this.state.eps}
                            onChange={this.handleChangeEps} onChange2={this.handleChangeEpsNombre} vaciarTodo={this.vaciarTodo} hostname={this.state.hostname}/>
                            </div>
                            <div className="col-4">
                                    <button className="btn-enviar" onClick={this.fetchArchivos}>Buscar</button>
                            </div>
                            </div>  
                        
                        

                     {
                        this.state.epsNombre!="" ?(
                            <div>  
                        
                        <div className="modal-footer">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-6" >   
                                                <button className="btn-enviar" onClick={this.opcionUpload}>Subir nuevo archivo</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <div className="modal-body">
                            <div className="container">
                            <div className="row">
                                <div className="col">
                                    <table className="table tablex table-hover table-light" id="tabla-principal">
                                        <thead className="thead-dark tablex ">
                                            <tr className="row">
                                                <th className="col-9">Archivo</th>

                                                <th className="col-3"style={{"textAlign":"center"}}>ACCIONES</th>
                                            </tr>
                                        </thead>
                                        <tbody className="tablex">
                                        {listadoArchivos.map((dynamicData, i) =>
                                            <tr key={i} className="row">
                                            
                                                <td className="col-9">
                                               
                                                   <i className="fa fa-file mr-1"></i>
                                                  
                                                { dynamicData.substring(17, dynamicData.length)}
                                                </td>
                                                
                                                <td className="col-3 " style={{"textAlign":"center"}}>
                                                <button className="btn btn-success " onClick={(e) => this.onTestSaveFile(dynamicData)} >
                                                    
                                                    Descargar
                                                    </button>

                                                    {/* <button className="btn  btn-danger ml-2" onClick={(e) => this.setState({ show: true })}>
                                                  
                                                    Borrar
                                                    </button> */}

                                                <button className="btn  btn-danger ml-2" onClick={(e) => this.deleteArchivos(dynamicData)}>
                                                  Borrar
                                                </button>

                                                    <SweetAlert
                                                    show={this.state.show}
                                                    title="Esta seguro?"
                                                    text="Una vez eliminado, no podrás recuperar este archivo!"
                                                    showCancelButton
                                                    onConfirm={(e) => {
                                                    {console.log('este es el valor enviado',i)}
                                                    this.deleteArchivos(dynamicData);
                                                    this.setState({ show: false });
                                                    
                                                    }}
                                                    onCancel={() => {
                                                    this.setState({ show: false });
                                                    }}
                                                    onEscapeKey={() => this.setState({ show: false })}
                                                    onOutsideClick={() => this.setState({ show: false })}
                                                    /> 
                                               
                                                </td>
                                             </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        ):(null)}
                        
                    </div>
                </div>
                                ):(null)}

                {this.state.subirArchivos===true?
                    (
                        
                   <div className="modal-dialog tam50">
                    <div className="modal-content" style={{"minHeight":"70vh"}}>
                        <div className="modal-header mb-3 bg-dark text-white">
                         
                        
                        <button className="close col-1 text-white" onClick={this.cerrarUpload}>
                        <span aria-hidden="true">&laquo;</span>  
                        </button>
                        
                       
                       
                            <h5 className="modal-title col-10"><b>Subir archivos del Servidor</b></h5>
                            <button className="close col-1 text-white" onClick={this.cerrarModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            
                            
                        </div>
                     
                        <div className="modal-body">
                            <div className="container">
                            <div className="row">
                                <div className="col">
                                <Upload eps={this.state.eps}/>
                                </div>
                            </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                    ):(null)
                }              

                {this.state.tipoReal === "1" && this.state.modalbool && this.state.boolcodigos === true?
                    (<ModalVariables vaciarModal={this.vaciarModal} leyendar={this.handleChangeLeyenda} cambiarCodigos={this.handleChangeCodigosAceptados} cambiarAcumulado={this.handleChangeAcumulado} gradiente={this.state.grad} cambioGrad={this.cambioGrad}
                        tipoGrafico={this.state.grafico} cambiarTipoGrafico={this.cambiarTipoGrafico} cambiarTipoConsulta={this.handleChangeTipoConsulta} cambiarEmpezarConsulta={this.handleChangeEmpezarConsulta}
                        eps={this.state.eps} local={this.state.local} periodo={this.state.periodo+this.state.mes} codigos={this.state.codigos} acumulado={this.state.acumulado} tipoConsulta={this.state.tipoConsulta} cambiarAlerta={this.cambiarAlerta}/>):(null)
                }

                {this.state.tipoReal === "2" && this.state.modalbool && this.state.boolcodigos === true?
                    (<ModalVariables vaciarModal={this.vaciarModal} leyendar={this.handleChangeLeyenda} cambiarCodigos={this.handleChangeCodigosAceptados} cambiarAcumulado={this.handleChangeAcumulado} gradiente={this.state.grad} cambioGrad={this.cambioGrad}
                        tipoGrafico={this.state.grafico} cambiarTipoGrafico={this.cambiarTipoGrafico} cambiarTipoConsulta={this.handleChangeTipoConsulta} cambiarEmpezarConsulta={this.handleChangeEmpezarConsulta}
                        eps={this.state.eps} local={this.state.local} periodo={this.state.periodo+this.state.mes} codigos={this.state.codigos} acumulado={this.state.acumulado} tipoConsulta={this.state.tipoConsulta} cambiarAlerta={this.cambiarAlerta}/>):(null)
                }

                {this.state.tipoReal === "3" && this.state.modalbool?
                    (<ModalReportesRegulatorios vaciarModal={this.vaciarModal} opcionReporte={this.state.opcionReporte} 
                        hostname={'http://190.116.37.106:7080'} eps={this.state.eps} local={this.state.local} periodo={this.state.periodo+this.state.mes}/>):(null)
                }

            </div>
        );
    }
}

export default AppPrimary;
