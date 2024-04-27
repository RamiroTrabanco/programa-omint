const modifiedFileInput = document.getElementById('archivoModificado');
const originalFileInput = document.getElementById('archivoOriginal');

document.getElementById('modificarForm').addEventListener('submit', function (event) {
    event.preventDefault();
    modifyFile();
});

document.getElementById('selectScript').addEventListener('change', function () {
    const selectedScript = this.value;

    if (selectedScript) {
        const newScript = document.createElement('script');
        newScript.src = `${selectedScript}.js`;

        const existingScripts = document.querySelectorAll('script[src]');
        existingScripts.forEach(script => script.remove());

        document.body.appendChild(newScript);
    }
});

async function selectPath() {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: '',
            types: [{
                description: 'Text files',
                accept: {
                    'text/plain': ['.txt'],
                },
            }],
        });
        modifiedFileInput.value = handle.name;
        modifiedFileInput.handle = handle;
    } catch (error) {
        console.error(error);
    }
}