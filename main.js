const archivoModificadoInput = document.getElementById('archivoModificado');

const archivoOriginalInput = document.getElementById('archivoOriginal');

document.getElementById('modificarForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que la página se recargue al enviar el formulario
    modificarArchivo();
});

document.getElementById('selectScript').addEventListener('change', function () {
    const selectedScript = this.value;

    // Verificar si se seleccionó un script
    if (selectedScript) {
        // Crear un nuevo script y asignarle el src
        const newScript = document.createElement('script');
        newScript.src = `${selectedScript}.js`;

        // Remover cualquier script existente en el body
        const existingScripts = document.querySelectorAll('script[src]');
        existingScripts.forEach(script => script.remove());

        // Agregar el nuevo script al final del body
        document.body.appendChild(newScript);
    }
});

async function seleccionarRuta() {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: '',
            types: [{
                description: 'Archivos de texto',
                accept: {
                    'text/plain': ['.txt'],
                },
            }],
        });
        archivoModificadoInput.value = handle.name;

        // Guarda la referencia al handle para su uso posterior al escribir en el archivo
        archivoModificadoInput.handle = handle;
    } catch (error) {
        console.error(error);
    }
}