async function modifyFile() {
    const originalFile = originalFileInput.files[0];
    const modifiedFilePath = modifiedFileInput.value.trim();

    if (!originalFile || !modifiedFilePath) {
        alert('Please select the original file and provide the path of the modified file.');
        return;
    }

    try {
        const originalContent = await readFile(originalFile);
        const newContent = originalContent
            .replace(/;CU;/g, ';II;')
            .replace(/;30674464149;/g, ";074213;")
            .replace(/  ;/g, ";")
            .replace(/;MP;S/g, ";MN;C")
            .replace(/ ;(\d{1,12}(?![\d]))/g, ';99999999')
            .replace(/\s+;/g, ';');

        // Use the saved handle to write to the file at the desired location
        const writable = await modifiedFileInput.handle.createWritable();
        await writable.write(newContent);
        await writable.close();

        alert('File modified successfully.')
        location.reload();
    } catch (error) {
        console.error(error);
        alert('An error occurred while modifying the file.');
    }
}

function readFile(file) {
    return file.text();
}