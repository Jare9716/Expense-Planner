
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Pressable,
  Image,
  Modal
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import FormularioGasto from './src/components/FormularioGasto'
import ListadoGastos from './src/components/ListadoGastos';
import Filtro from './src/components/Filtro';

import {generarID} from './src/helpers'
import { err } from 'react-native-svg/lib/typescript/xml';


const App = () => {
  
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)
  const [presupuesto, setPresupuesto] = useState(0)
  const [gastos, setGastos] = useState([])
  const [modal,setModal] = useState(false)
  const [gasto, setGasto] = useState({})
  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState('')

  //CARGAR Y GUARDAR DATOS
  //Cargando datos de presupuesto
  useEffect(() =>{
    const obtenerPresupuestoStore = async () =>{
      try {
        const presupuestoStorage = await AsyncStorage.getItem('planificador_presupuesto') ?? 0

        if(presupuestoStorage > 0) {
          setPresupuesto (presupuestoStorage)
          setIsValidPresupuesto(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    obtenerPresupuestoStore()
  },[])
  //Guardando datos de Presupuesto
  useEffect (() => {
    if (isValidPresupuesto){
      const guardarPresupuestoStorage = async () =>{
        try {
          await AsyncStorage.setItem ('planificador_presupuesto', presupuesto)
        } catch (error) {
          console.log(error)
        }
      }
      
      guardarPresupuestoStorage()
    }
  },[isValidPresupuesto])
  //Cargando datos de gastos
  useEffect(()=>{
    const obtenerGastosStorage = async () =>{
      try {
        const gastosStorage = await AsyncStorage.getItem('planificador_gastos')
        
        setGastos (gastosStorage ? JSON.parse(gastosStorage) : [])
        
      } catch (error) {
        console.log(error)
      }
    }
    obtenerGastosStorage()
  },[])

  //Guardando datos de gastos
  useEffect (() => {
    const guardarGastosStorage = async () =>{
      try {
        await AsyncStorage.setItem('planificador_gastos', JSON.stringify(gastos))
        console.log('se guardo un gasto')
      } catch (error) {
        console.log(error)
      }
    }

    guardarGastosStorage()
  },[gastos])

  //-----------------------------------------------------------------------------------//

  const handleNuevoPresupuesto = (presupuesto) => {
    if (Number(presupuesto) > 0 ) {
          setIsValidPresupuesto(true)
    }
    else{
          Alert.alert(
            'Error', 
            'El presupuesto no puede ser 0 o menor',
          )
    }
  }
  
  const handleGasto = gasto =>{
    
    if([gasto.nombre, gasto.categoria, gasto.cantidad].includes('')) {
       Alert.alert(
        'Error',
        'Todos los campos son obligatorios'
       )
      return
    }

    if(gasto.id){
      const gastosActualizados = gastos.map (gastoState => gastoState.id
        === gasto.id? gasto : gastoState)

      setGastos(gastosActualizados)
    }
    else{
    //Añadir el nuevo gasto al state
    gasto.id = generarID()
    gasto.fecha = Date.now()
    setGastos([...gastos, gasto])
    }

    setModal(!modal)
  }

  const eliminarGasto = id =>{
    Alert.alert(
      'Deseas eliminar este gasto',
      'Un gsto eliminado no se puede recuperar',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Si, Eliminar', onPress: ()=>{

          // Esta función retorna unicamente los elementos del arreglo diferentes al objeto eliminado caracterizado por el id
          const gastosActualizados = gastos.filter(gastoState => 
            gastoState.id !== id)

          setGastos(gastosActualizados)
          setModal(!modal)
          setGasto({})
        }}
      ]
     )
  }
  //Borrar todo e iniciar de nuevo
  const resetApp = () => {
    Alert.alert(
      'Deseas borrar los datos guardados',
      'ESto eliminara presupuesto y gastos',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'Si, Eliminar', onPress: async () =>{
          try {
            await AsyncStorage.clear()

            setIsValidPresupuesto(false)
            setPresupuesto(0)
            setGastos([])
          } catch (error) {
            console.log(error)
          }
        }}
      ]
    )
  }

  return (
    <View style = {styles.contenedor}>
      <ScrollView>
        <View style = {styles.header }> 
          <Header />
            
            {/* A continuación tenemos la validación al pulsar el boton agregar presupuesto 
            (es decir, si en este hay o no hay un valor correcto) 
            y así transicionar hacia ControlPresupuesto*/}
            {isValidPresupuesto ? (
            
            <ControlPresupuesto
              presupuesto = {presupuesto}
              gastos = {gastos}
              resetApp = {resetApp}
            />
              
            )  
            :(
              <NuevoPresupuesto
              presupuesto = {presupuesto}
              setPresupuesto = {setPresupuesto}
              handleNuevoPresupuesto = {handleNuevoPresupuesto}  
              />
            )
          }

        </View>

        {isValidPresupuesto && (
          
          <>
            <Filtro
            filtro = {filtro}
            setFiltro = {setFiltro}
            gastos = {gastos}
            setGastosFiltrados = {setGastosFiltrados}
            />
            <ListadoGastos
              gastos = {gastos}
              setModal = {setModal}
              setGasto = {setGasto}
              filtro = {filtro}
              gastosFiltrados = {gastosFiltrados}
            />
          </>

        )}
      </ScrollView>
      
      {modal && (
        <Modal
          animationType='slide'
          visible = {modal}
          onRequestClose ={() =>{
              setModal(!modal)
          }}
        >
          <FormularioGasto
            setModal = {setModal}
            handleGasto = {handleGasto}
            gasto = {gasto}
            setGasto = {setGasto}
            eliminarGasto = {eliminarGasto}
          /> 
        </Modal>
      )}

        {isValidPresupuesto && (
          <Pressable 
          style = {styles.pressable}
          onPress={() => setModal(!modal)}
          >
            <Image
              style = {styles.imagen}
              source = {require('./src/img/nuevo-gasto.png')}
            />
          </Pressable>
        )}

    </View>
  
)}

const styles = StyleSheet.create({
 
  contenedor: {
  backgroundColor: '#F5F5F5',
  flex: 1,
  },
  header: {
    backgroundColor: '#3B82F6',
    minHeight: 400,
  },
  pressable:{
    width: 60,
    height:60,
    position: 'absolute',
    bottom: 40,
    right: 30,
  },
  imagen: {
    width: 60,
    height: 60,
  },
  
});

export default App;
