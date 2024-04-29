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

        const selectScript = document.getElementById('selectScript');
        const opcionSeleccionada = selectScript.value;

        let valorPrestacion;
        let mes;
        let otroMes;
        let otroValorPrestacion;
        let tercerMes;
        let tercerValorPrestacion;

        if (opcionSeleccionada === 'kinemendoza') {
            const cambiarValor = confirm('¿Quieres agregar el valor de la sesión para un determinado mes?');
            if (cambiarValor) {
                mes = prompt('Ingresa el mes (dos digitos) de la sesión:');
                valorPrestacion = prompt(`Ingresa el valor de la sesión para el mes ${mes}:`);
            }
            const agregarOtroMes = confirm('¿Quieres agregar el valor de la sesión para otro mes?');
            if (agregarOtroMes) {
                otroMes = prompt('Ingresa otro mes (dos digitos):');
                otroValorPrestacion = prompt(`Ingresa el valor para el mes ${otroMes}:`);
            }
            if (agregarOtroMes) {
                const agregarTercerMes = confirm('¿Quieres agregar el valor de la sesión para un tercer mes?');
                if (agregarTercerMes) {
                    tercerMes = prompt('Ingresa un tercer mes:');
                    tercerValorPrestacion = prompt(`Ingresa el valor de la sesión para el mes ${tercerMes}:`);
                }
            }
        }

        for (let i = 0; i < lineasOriginales.length; i++) {
            const linea = lineasOriginales[i];
            const columnas = linea.split(';');

            // Verifica si hay suficientes columnas para acceder a columnas[5]
            if (columnas.length >= 6) {
                const nombre = columnas[2];
                const numeroSocio = columnas[1];
                const codigo = 902522;
                const fechas = columnas[6].split('|'); // Divide las fechas separadas por "|"
                const descripcionCodigo = "FISIO-KINESIO EN CONSULTORIO";
                const nombrePrestador = "Circulo de Kinesiologos y Fisioterapeutas de Mendoza"

                // Por cada fecha encontrada, crea una nueva línea
                fechas.forEach((fecha) => {
                    fecha = fecha.trim();

                    let valorCodigo = "INGRESAR VALOR DE LA PRESTACION"

                    if (opcionSeleccionada === 'kinemendoza' && mes && valorPrestacion && fecha.includes(`/${mes}/`)) {
                        valorCodigo = valorPrestacion;
                    }
                    if (opcionSeleccionada === 'kinemendoza' && otroMes && otroValorPrestacion && fecha.includes(`/${otroMes}/`)) {
                        valorCodigo = otroValorPrestacion;
                    }
                    if (opcionSeleccionada === 'kinemendoza' && tercerMes && tercerValorPrestacion && fecha.includes(`/${tercerMes}/`)) {
                        valorCodigo = tercerValorPrestacion;
                    }
                    const nuevaLinea = `CENT;AM;${nombre};${numeroSocio};II;080564;${fecha};${fecha};${codigo};${descripcionCodigo};;1;${valorCodigo};53.00;;;;;;II;080564;${nombrePrestador};;;;;;;99999999;MN;C;;;;;0`;
                    nuevasLineas.push(nuevaLinea);
                });
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