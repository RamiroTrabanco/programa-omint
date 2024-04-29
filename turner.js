async function modificarArchivo() {

    const archivoOriginal = archivoOriginalInput.files[0];
    const rutaModificado = archivoModificadoInput.value.trim();

    if (!archivoOriginal || !rutaModificado) {
        alert('Por favor, selecciona el archivo original y proporciona la ruta del archivo modificado.');
        return;
    }

    try {
        const contenidoOriginal = await readFile(archivoOriginal);
        const nuevoContenido = contenidoOriginal
        .replace(/;CU;/g, ';II;')
        .replace(/;30674464149;/g, ";074213;")
        .replace(/  ;/g, ";")
        .replace(/;MP;S/g, ";MN;C")
        .replace(/ ;(\d{1,12}(?![\d]))/g, ';99999999')
        .replace(/\s+;/g, ';');

        // Utiliza el handle guardado para escribir en el archivo en la ubicación deseada
        const writable = await archivoModificadoInput.handle.createWritable();
        await writable.write(nuevoContenido);
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
