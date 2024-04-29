async function modificarArchivo() {

    const archivoOriginal = archivoOriginalInput.files[0];
    const rutaModificado = archivoModificadoInput.value.trim();

    if (!archivoOriginal || !rutaModificado) {
        alert('Por favor, selecciona el archivo original y proporciona la ruta del archivo modificado.');
        return;
    }

    try {
        const contenidoOriginal = await readFile(archivoOriginal);
        const lineasOriginales = contenidoOriginal.split('\r\n');
        const nuevasLineas = [];

        for (let i = 0; i < lineasOriginales.length; i++) {
            const linea = lineasOriginales[i];
            const columnas = linea.split(';');
            
            // Verifica si hay suficientes columnas para acceder a columnas[5]
            if (columnas.length >= 6) {
                const nombre = columnas[1];
                const numeroSocio = columnas[12].replace(/-/g, "");
                const codigo = columnas[3];
                const fechaInicio = columnas[2];
                const fechaFin = columnas[2];
                const valorCodigo = columnas[6];
                const descripcionCodigo = columnas[4];
                const cantCodigo = columnas[5]
                const nombrePrestador = "Traumatologia y Ortopedia"
                
                const nuevaLinea = `CENT;AM;${nombre};${numeroSocio};II;034025;${fechaInicio};${fechaFin};${codigo};${descripcionCodigo};;${cantCodigo};${valorCodigo};53.00;;;;;;II;034025;${nombrePrestador};;;;;;;99999999;MN;C;;;;;0`;
        
                nuevasLineas.push(nuevaLinea);
            } else {
                console.warn(`La línea ${i + 1} no tiene suficientes columnas.`);
            }
        }

        // Lee el archivo modificado antes de realizar los reemplazos
        let contenidoModificado = nuevasLineas.join('\n');

        // Utiliza el handle guardado para escribir en el archivo en la ubicación deseada
        const writable = await archivoModificadoInput.handle.createWritable();

        // Eliminar la primera y la última línea del contenido modificado
        let lineasModificadas = contenidoModificado.split('\n');
        lineasModificadas = lineasModificadas.slice(8, -2);
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