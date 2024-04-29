async function modifyFile() {
    async function modificarArchivo() {

        const archivoOriginal = archivoOriginalInput.files[0];
        const rutaModificado = archivoModificadoInput.value.trim();
        const especialidades = {
            "4468": "13.00",
            "8313": "18.00",
            "2114": "15.00",
            "1567": "16.00",
            "6533": "21.00",
            "4476": "14.08",
            "0583": "23.00",
            "0657": "16.00",
            "9444": "13.00",
            "0587": "13.00",
            "5146": "52.00",
            "9217": "14.14",
            "2114": "15.00",
            "9445": "25.00",
            "9444": "13.00",
            "0998": "18.00",
            "4675": "10.00",
            "0251": "18.00",
            "3097": "21.00",
            "9445": "25.00",
            "1399": "15.00",
            "0326": "21.00",
            "1967": "16.00",
            "7725": "34.00",
            "8516": "13.00",
            "5785": "23.00",
            "0326": "23.00",
            "9444": "13.00",
            "5785": "23.00",
            "3116": "23.00",
            "1130": "13.00",
            "7968": "23.00",
            "0606": "23.00",
            "7298": "14.14",
            "0583": "23.00",
            "4501": "14.00",
            "0947": "40.00",
            "1199": "23.00",
            "6148": "14.00",
            "1557": "34.00",
            "6386": "16.00",
            "1952": "23.00",
            "5295": "40.00",
            "0452": "16.00",
            "1474": "21.00",
            "1399": "15.00",
            "4210": "15.00",
            "0657": "16.00",
            "0326": "23.00",
            "4468": "13.00",
            "0583": "23.00",
            "9445": "25.00",
            "1557": "34.00",
            "1952": "23.00",
            "6662": "40.00",
            "6386": "16.00",
            "4501": "14.00",
            "7311": "23.00",
            "0606": "23.00",
            "1567": "16.00",
            "0587": "13.00",
            "0326": "23.00",
            "1967": "16.00",
            "3761": "10.00",
            "8806": "13.00",
            "2114": "15.00",
            "0583": "23.00",
            "5567": "14.08",
            "0657": "16.00",
            "9271": "14.14"
        }
    
        if (!archivoOriginal || !rutaModificado) {
            alert('Por favor, selecciona el archivo original y proporciona la ruta del archivo modificado.');
            return;
        }
    
        try {
            const contenidoOriginal = await readFile(archivoOriginal);
            const lineasOriginales = contenidoOriginal.split('\r\n');
            const nuevasLineas = [];
    
            for (let i = 0; i < lineasOriginales.length; i++) {
                let linea = lineasOriginales[i];
                linea = linea.replace(/(\*{5})(?=\d)/, '****').replace(/220102/g, '220101')
                const columnas = linea.split('*');
                
                // Verifica si hay suficientes columnas para acceder a columnas[5]
                if (columnas.length >= 6) {
                    const nombre = '';
                    const numeroSocio = columnas[0].replace(/^.{13}/, '').substring(0, 10);
                    const codigo = columnas[8].substring(0, 6);
                    const fechaInicio = columnas[4];
                    const fechaFin = columnas[4];
                    let valorCodigo = parseFloat(columnas[9].substring(3, 9) + '.' + columnas[9].substring(9, 11)).toFixed(2);
                    const descripcionCodigo = '';
                    const numeroMatricula = columnas[0].substring(columnas[0].indexOf("MPS") - 4, columnas[0].indexOf("MPS"));
                    const numeroPrestador = 198785;
                    const especialidad = especialidades[numeroMatricula] ? especialidades[numeroMatricula] : "15.00"
                    const nombrePrestador = "Las Vertientes"
                    
                    if (valorCodigo !== '0.00' && columnas[8] !== '999997'){const nuevaLinea = `CENT;AM;${nombre};${numeroSocio};II;${numeroPrestador};${fechaInicio};${fechaFin};${codigo};${descripcionCodigo};;1;${valorCodigo};${especialidad};;;;;;II;${numeroPrestador};${nombrePrestador};;;;;;;${numeroMatricula};MN;C;;;;;0`;
            
                    nuevasLineas.push(nuevaLinea);}
                } else {
                    console.warn(`La línea ${i + 1} no tiene suficientes columnas.`);
                }
            }
            
            let contenidoModificado = nuevasLineas.join('\n');
            const writable = await archivoModificadoInput.handle.createWritable();
    
            let lineasModificadas = contenidoModificado.split('\n');
            contenidoModificado = lineasModificadas.join('\n');
    
            await writable.write(contenidoModificado);
            await writable.close();
    
            alert('Archivo modificado exitosamente.')
            location.reload();
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al modificar el archivo.');
        }
    }
    
    function readFile(file) {
        return file.text();
    }