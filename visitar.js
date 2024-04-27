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

            // Check if there are enough columns, at least the first 13, to consider the line valid
            if (columns.length < 13) {
                continue;  // Skip to the next iteration if there are not enough columns
            }

            const name = columns[3];
            const memberNumber = columns[4];
            const code = columns[6];
            const startDate = formatDate(columns[13]);
            const endDate = formatDate(columns[13]);
            const descriptionCode = columns[7];
            const codeQuantity = columns[11];
            const codeValue = columns[9].replace(/\$| /g, '').replace(/\./g, '').replace(/,/g, '.')

            const newLine = `CENT;AM;${name};${memberNumber};II;585544;${startDate};${endDate};${code};${descriptionCode};;${codeQuantity};${codeValue};53.00;;;;;;II;585544;VISIT;;;;;;;99999999;MN;C;;;;;0`;

            newLines.push(newLine);
        }

        // Read the modified file before making replacements
        let modifiedContent = newLines.join('\n');

        // Make additional replacements
        modifiedContent = replace(modifiedContent);

        // Use the saved handle to write to the file at the desired location
        const writable = await modifiedFileInput.handle.createWritable();

        // Remove the first and last line of the modified content
        let modifiedLines = modifiedContent.split('\n');
        modifiedLines.pop(); // Remove the last line
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

function replace(processedText) {
    // Filter lines that do not match the pattern
    const filteredLines = processedText.split('\n').filter(line => {
        return !/^CENT;AM;;;II;585544;;;;;;;;53\.00;;;;;;II;585544;Laboratories TURNER;;;;;;;99999999;MN;C;;;;;0$/.test(line);
    });

    // Join filtered lines
    const replacedText = filteredLines.join('\n')
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

    return replacedText;
}

function formatDate(date) {
    // Replace any newline or carriage return with a space
    const cleanDate = date.replace(/[\r\n]/g, '');

    // Parse the date in Date object format
    const dateObject = new Date(cleanDate);

    // Check if the date is valid before formatting it
    if (!isNaN(dateObject.getTime())) {
        // Get date components
        const day = dateObject.getDate().toString().padStart(2, '0');
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObject.getFullYear();

        // Format the date in the desired format
        return `${day}/${month}/${year}`;
    } else {
        // In case of invalid date, return the original date
        return date;
    }
}

function readFile(file) {
    return file.text();
}