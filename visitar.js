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

            // Verifica si hay suficientes columnas, al menos las primeras 13, para considerar la línea válida
            if (columnas.length < 13) {
                continue;  // Salta a la siguiente iteración si no hay suficientes columnas
            }

            const nombre = columnas[3];
            const numeroSocio = columnas[4];
            const codigo = columnas[6];
            const fechaInicio = formatearFecha(columnas[13]);
            const fechaFin = formatearFecha(columnas[13]);
            const descripcionCodigo = columnas[7];
            const cantidadCodigo = columnas[11];
            const valorCodigo = columnas[9].replace(/\$| /g, '').replace(/\./g, '').replace(/,/g, '.')

            const nuevaLinea = `CENT;AM;${nombre};${numeroSocio};II;585544;${fechaInicio};${fechaFin};${codigo};${descripcionCodigo};;${cantidadCodigo};${valorCodigo};53.00;;;;;;II;585544;VISITAR;;;;;;;99999999;MN;C;;;;;0`;

            nuevasLineas.push(nuevaLinea);
        }

        // Lee el archivo modificado antes de realizar los reemplazos
        let contenidoModificado = nuevasLineas.join('\n');

        // Realiza los reemplazos adicionales
        contenidoModificado = reemplazar(contenidoModificado);

        // Utiliza el handle guardado para escribir en el archivo en la ubicación deseada
        const writable = await archivoModificadoInput.handle.createWritable();

        // Eliminar la primera y la última línea del contenido modificado
        let lineasModificadas = contenidoModificado.split('\n');
        lineasModificadas.pop(); // Eliminar la última línea
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

function reemplazar(textoProcesado) {
    // Filtra las líneas que no coinciden con el patrón
    const lineasFiltradas = textoProcesado.split('\n').filter(linea => {
        return !/^CENT;AM;;;II;585544;;;;;;;;53\.00;;;;;;II;585544;Laboratorios TURNER;;;;;;;99999999;MN;C;;;;;0$/.test(linea);
    });

    // Une las líneas filtradas
    const textoReemplazado = lineasFiltradas.join('\n')
        .replace(/;1-/g, ";")
        .replace(/;420104/g, ';420102')
        .replace(/;420417/g, ';420101')
        .replace(/;420421/g, ';420101')
        .replace(/;420105/g, ';420101')
        .replace(/;420107/g, ';420101')
        .replace(/;420416/g, ';420101')
        .replace(/;420409/g, ';420101')
        .replace(/;420305/g, ';420101')
        .replace(/;420422/g, ';420101')
        .replace(/;260604/g, ';904607')
        .replace(/;260607/g, ';342001')
        .replace(/;420304/g, ';420101')
        .replace(/;420406/g, ';420101')
        .replace(/;420433/g, ';420101')
        .replace(/;420106/g, ';420101')
        .replace(/;180305/g, ';180301')
        .replace(/;180218/g, ';180601')
        .replace(/;180216/g, ';180124')
        .replace(/;180207/g, ';180103')
        .replace(/;170217/g, ';901727')
        .replace(/;18-/g, ';660')
        .replace(/;2-/g, ';660')
        .replace(/;6601;/g, ";660001;")
        .replace(/;66022;/g, ";660022;")
        .replace(/;660200;/g, ";661035;")
        .replace(/;6609127;/g, ";669127;")
        .replace(/;6601040;/g, ";661040;")
        .replace(/;6601035;/g, ";661035;")
        .replace(/;6601060;/g, ";661060;")
        .replace(/;6601157;/g, ";661157;")
        .replace(/;6601135;/g, ";661136;")
        .replace(/;66063;/g, ";660063;")
        .replace(/;250110/g, ';250104')
        .replace(/;420427/g, ';420101')
        .replace(/�/g, '');

    return textoReemplazado;
}

function formatearFecha(fecha) {
    // Reemplaza cualquier salto de línea o retorno de carro por un espacio
    const fechaLimpia = fecha.replace(/[\r\n]/g, '');

    // Parsea la fecha en formato de objeto Date
    const fechaObjeto = new Date(fechaLimpia);

    // Verifica si la fecha es válida antes de formatearla
    if (!isNaN(fechaObjeto.getTime())) {
        // Obtiene los componentes de la fecha
        const dia = fechaObjeto.getDate().toString().padStart(2, '0');
        const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaObjeto.getFullYear();

        // Formatea la fecha en el formato deseado
        return `${dia}/${mes}/${anio}`;
    } else {
        // En caso de fecha inválida, devuelve la fecha original
        return fecha;
    }
}

function readFile(file) {
    return file.text();
}