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
                const name = columns[7];
                const memberNumber = columns[5];
                const code = columns[14];
                const startDate = columns[9];
                const endDate = columns[9];
                const codeValue = columns[17];
                const codeDescription = columns[15];
                const providerNumber = 213673;
                const providerName = "IICT";

                const newLine = `CENT;AM;${name};${memberNumber};II;${providerNumber};${startDate};${endDate};${code};${codeDescription};;1;${codeValue};53.00;;;;;;II;${providerNumber};${providerName};;;;;;;99999999;MN;C;;;;;0`;

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