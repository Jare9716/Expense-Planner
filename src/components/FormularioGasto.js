import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import globalStyles from '../Styles';

const FormularioGasto = ({
    setModal, 
    handleGasto,
    gasto, 
    setGasto,
    eliminarGasto
}) => {
    
    const [nombre, setNombre] = useState ('')
    const [cantidad, setCantidad] = useState ('')
    const [categoria, setCategoria] = useState ('')
    const [id, setId] = useState('')
    const [fecha, setFecha] = useState('')
    //Optional changing
    useEffect (() =>{
        if (gasto?.nombre){

            setNombre(gasto.nombre)
            setCantidad(gasto.cantidad)
            setCategoria(gasto.categoria)
            setId(gasto.id)
            setFecha(gasto.fecha)
        }
        else{
            
        }
    }, [gasto])

    return (
        <SafeAreaView style = {styles.contenedor}>
            <View style = {styles.contenedorBotones}>
                <Pressable 
                    onLongPress={() => {
                        setModal(false)
                        setGasto({})
                    }}
                    style = {[styles.btn, styles.btnCancelar]}>
                    <Text style = {styles.btnTexto}>Cancelar</Text>
                </Pressable>
                
                {/* A continuación se evaluca si existe o no una id para mostrar el boton eliminar */}
                { !!id && ( 
                <Pressable 
                    style = {[styles.btn, styles.btnEliminar]}
                    onLongPress={()=> eliminarGasto(id)}
                >
                    <Text style = {styles.btnTexto}>Eliminar</Text>
                </Pressable>    
                
                )}


            </View>

            <View style = {styles.formulario}>
                <Text style = {styles.titulo}>
                    {gasto?.nombre ? 'Editar Gasto' : 'Nuevo Gasto'}    
                </Text>

                <View style = {styles.campo}>
                    <Text style = {styles.label}>Nombre del gasto</Text>
                    <TextInput
                        style = {styles.input}
                        placeholder='Nombre del gasto. ej. Comida'
                        onChangeText={setNombre}
                        value={nombre}
                        
                    />
                </View>

                <View style = {styles.campo}>
                    <Text style = {styles.label}>Cantidad Gasto</Text>
                    <TextInput
                        style = {styles.input}
                        placeholder='Cantidad del gasto. ej. 300'
                        keyboardType='numeric'
                        onChangeText={setCantidad}
                        value={cantidad}
                    />
                </View>

                <View style = {styles.campo}>
                    <Text style = {styles.label}>Categoria Gasto</Text>
                    <Picker 
                    selectedValue={categoria}
                    onValueChange={(itemValue) => {
                        setCategoria(itemValue)
                    }}
                    style = {styles.input}
                    >
                        <Picker.Item label='-- Selecione --' value=''/>
                        <Picker.Item label=' Ahorro ' value='ahorro'/>
                        <Picker.Item label=' Comida ' value='comida'/>
                        <Picker.Item label=' Casa ' value='casa'/>
                        <Picker.Item label=' Gastos Varios ' value='gastos'/>
                        <Picker.Item label=' Ocio ' value='ocio'/>
                        <Picker.Item label=' Salud ' value='salud'/>
                        <Picker.Item label=' Suscripciones ' value='suscripciones'/>
                    </Picker>
                </View>
                <Pressable 
                    style = {styles.sbmitBtn}
                    onPress={() => handleGasto({nombre, cantidad, categoria, id, fecha})}
                >
                    <Text style = {styles.sbmitBtnTexto}>
                        {gasto?.nombre ? 'Guardar Cambios Gasto' : 'Agregar Gasto'} 
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>  
    )
}

const styles = StyleSheet.create ({
    contenedor:{
        backgroundColor: '#1E40AF',
        flex: 1
    },
    contenedorBotones:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn:{
        padding: 10,
        marginTop: 30,
        marginHorizontal: 10, 
        flex: 1
    },
    btnCancelar:{
        backgroundColor: '#DB2777',
    },
    btnEliminar:{
        backgroundColor: 'red'
    },
    btnTexto:{
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#FFF'
    },
    formulario:{
        ...globalStyles.contenedor
    },
    titulo:{
        textAlign: 'center',
        fontSize: 28,
        marginBottom: 30,
        color: '#64748B'
    },
    campo:{
        marginVertical: 10
    },
    label:{
        color: '#64748B',
        textTransform: 'uppercase',
        fontSize: 16,
        fontWeight: 'bold'
    },
    input:{
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    sbmitBtn:{
        backgroundColor: '#38B2F6',
        padding: 10,
        marginTop: 20
    },
    sbmitBtnTexto:{
        textAlign: 'center',
        color : '#FFF',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
        
})
export default FormularioGasto