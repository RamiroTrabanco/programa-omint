async function modifyFile() {
    const originalFile = originalFileInput.files[0];
    const modifiedFilePath = modifiedFileInput.value.trim();

    if (!originalFile || !modifiedFilePath) {
        alert('Please select the original file and provide the path of the modified file.');
        return;
    }

    try {
        const originalContent = await readFile(originalFile);
        const originalLines = originalContent.split('\r\n');
        const newLines = [];

        for (let i = 0; i < originalLines.length; i++) {
            const line = originalLines[i];
            const columns = line.split(';');

            if (columns.length >= 6) {
                const name = columns[1];
                const memberNumber = columns[12].replace(/-/g, "");
                const code = columns[3];
                const startDate = columns[2];
                const endDate = columns[2];
                const codeValue = columns[6];
                const codeDescription = columns[4];
                const codeCount = columns[5];
                const providerName = "Traumatology and Orthopedics";

                const newLine = `CENT;AM;${name};${memberNumber};II;034025;${startDate};${endDate};${code};${codeDescription};;${codeCount};${codeValue};53.00;;;;;;II;034025;${providerName};;;;;;;99999999;MN;C;;;;;0`;

                newLines.push(newLine);
            } else {
                console.warn(`Line ${i + 1} does not have enough columns.`);
            }
        }

        let modifiedContent = newLines.join('\n');
        const writable = await modifiedFileInput.handle.createWritable();

        let modifiedLines = modifiedContent.split('\n');
        modifiedLines = modifiedLines.slice(8, -2);
        modifiedContent = modifiedLines.join('\n');

        await writable.write(modifiedContent);
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